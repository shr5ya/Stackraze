const User = require("../../models/user");
const Contact = require("../../models/contactFrom");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateOtp, sendOtpEmail } = require("../../utils/emailService");

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

async function handleUserSignup(req, res) {
  try {
    const { name, username, email, password, avatar } = req.body || {};

    if (!name || !username || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, username, email, and password are required" });
    }

    const existingUser = await User.exists({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const existingUsername = await User.exists({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Generate OTP for email verification
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      avatar: avatar || "Avatar1",
      authProvider: "local",
      isVerified: false,
      emailOtp: hashedOtp,
      emailOtpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send OTP email
    try {
      await sendOtpEmail(email, otp, name);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // Still create user, they can resend OTP later
    }

    return res.status(201).json({
      message: "Signup successful. Please verify your email with the OTP sent to your inbox.",
      requiresVerification: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email })
      .select("_id name username email avatar password about isVerified authProvider")
      .lean();

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If user signed up with Google and has no password
    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({
        message: "This account uses Google sign-in. Please use the Google button to log in.",
      });
    }

    // Compare password — support both bcrypt hashes and legacy plaintext
    let isPasswordValid = false;
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Legacy plaintext password — compare directly, then re-hash
      isPasswordValid = user.password === password;
      if (isPasswordValid) {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      // Generate and send a new OTP
      const otp = generateOtp();
      const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS);

      await User.findByIdAndUpdate(user._id, {
        emailOtp: hashedOtp,
        emailOtpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      });

      try {
        await sendOtpEmail(user.email, otp, user.name);
      } catch (emailError) {
        console.error("Failed to send OTP email:", emailError);
      }

      return res.status(403).json({
        message: "Email not verified. A new OTP has been sent to your email.",
        requiresVerification: true,
        email: user.email,
      });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        about: user.about,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleVerifyOtp(req, res) {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email })
      .select("_id name username email avatar about emailOtp emailOtpExpiry isVerified");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (!user.emailOtp || !user.emailOtpExpiry) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }

    // Check OTP expiry
    if (new Date() > user.emailOtpExpiry) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Verify OTP
    const isOtpValid = await bcrypt.compare(otp, user.emailOtp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark as verified and clear OTP fields
    user.isVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    await user.save();

    // Generate token and log in the user
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        about: user.about,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleResendOtp(req, res) {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email }).select("_id name email isVerified");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new OTP
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS);

    user.emailOtp = hashedOtp;
    user.emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(user.email, otp, user.name);

    return res.status(200).json({
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleGoogleCallback(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=auth_failed`);
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    // Build user data to pass via URL
    const userData = encodeURIComponent(
      JSON.stringify({
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        about: user.about || "",
      })
    );

    // Redirect to frontend with token and user data
    res.redirect(
      `${process.env.CLIENT_URL || "http://localhost:5173"}/auth/google/success?token=${token}&user=${userData}`
    );
  } catch (error) {
    console.error("Error in Google callback:", error);
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=server_error`);
  }
}

async function handleUserData(req, res) {
  const userId = req.user.id;
  const userData = await User.findById(userId).select("-password").lean();

  if (!userData) {
    return res.status(404).json({ message: "No data found" });
  }

  return res.status(200).json({ userData });
}

async function handleCreateContact(req, res) {
  try {
    const { name, phoneNumber, email, message, type } = req.body;

    const newContact = await Contact.create({
      name,
      phoneNumber,
      email,
      message,
      type,
    });

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: newContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function handleUpdateUserData(req, res) {
  try {
    const userId = req.user.id;
    const updateFields = req.body || {};

    const allowedFields = ["name", "username", "email", "avatar", "about", "location", "password"];
    const updates = {};

    for (const key of allowedFields) {
      if (updateFields[key] !== undefined) {
        updates[key] = updateFields[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    if (updates.email) {
      const existingEmail = await User.exists({ email: updates.email, _id: { $ne: userId } });
      if (existingEmail) {
        return res.status(409).json({ message: "Email already taken" });
      }
    }

    if (updates.username) {
      const existingUsername = await User.exists({ username: updates.username, _id: { $ne: userId } });
      if (existingUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    // Handle password change specifically for security
    if (updates.password) {
      if (!updateFields.oldPassword) {
        return res.status(400).json({ message: "oldPassword is required to change the password" });
      }

      const currentUser = await User.findById(userId).select("password").lean();

      // Support both bcrypt and plaintext old passwords
      let oldPasswordValid = false;
      if (currentUser.password.startsWith("$2a$") || currentUser.password.startsWith("$2b$")) {
        oldPasswordValid = await bcrypt.compare(updateFields.oldPassword, currentUser.password);
      } else {
        oldPasswordValid = currentUser.password === updateFields.oldPassword;
      }

      if (!currentUser || !oldPasswordValid) {
        return res.status(401).json({ message: "Incorrect old password" });
      }

      if (updates.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      // Hash the new password
      updates.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password").lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User data updated successfully",
      userData: updatedUser
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleGetProfileByUsername(req, res) {
  const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;
  try {
    const normalized = String(req.query.username || "").trim().toLowerCase();

    if (!USERNAME_REGEX.test(normalized)) {
      return res.status(400).json({ error: "Invalid username" });
    }

    const user = await User.findOne(
      { username: normalized },
      "name username about avatar"
    ).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleSavePostToUserData(req, res) {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedPosts: postId } },
      { new: true }
    );

    res.status(200).json({
      message: "Post saved successfully",
      savedPosts: user.savedPosts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function handleUnsavePost(req, res) {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedPosts: postId } },
      { new: true }
    );

    res.status(200).json({
      message: "Post unsaved successfully",
      savedPosts: user.savedPosts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function handleGetSavedPosts(req, res) {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .select("username savedPosts")
      .populate({
        path: "savedPosts",
        select: "content photos likes comments shares createdAt author",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "name username avatar"
        }
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      username: user.username,
      savedPosts: user.savedPosts
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleVerifyOtp,
  handleResendOtp,
  handleGoogleCallback,
  handleUserData,
  handleCreateContact,
  handleUpdateUserData,
  handleGetProfileByUsername,
  handleSavePostToUserData,
  handleUnsavePost,
  handleGetSavedPosts
};
