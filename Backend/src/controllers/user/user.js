const User = require("../../models/user");
const Contact = require("../../models/contactFrom")
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

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

    const user = await User.create({ name, username, email, password, avatar: avatar || "Avatar1" });

    return res.status(201).json({
      message: "Signup successful",
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
      .select("_id name username email avatar password about")
      .lean();

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    // console.log(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        about: user.about
      },
    });
  } catch (error) {
    // console.log(error);

    return res.status(500).json({ message: "Internal server error" });
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
};

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

      // Fetch the user's current password
      const currentUser = await User.findById(userId).select("password").lean();
      if (!currentUser || currentUser.password !== updateFields.oldPassword) {
        return res.status(401).json({ message: "Incorrect old password" });
      }

      // Optional: Since there is a minlength of 6 on the schema, we can enforce it explicitly
      if (updates.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
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


module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserData,
  handleCreateContact,
  handleUpdateUserData,
  handleGetProfileByUsername
};
