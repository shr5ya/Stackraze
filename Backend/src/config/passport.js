const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;

        // 1. Check if user already exists with this Google ID
        let user = await User.findOne({ googleId });

        if (user) {
          return done(null, user);
        }

        // 2. Check if user exists with same email (signed up with local auth)
        user = await User.findOne({ email });

        if (user) {
          try {
            // Link the Google account to the existing local user
            user.googleId = googleId;
            if (!user.isVerified) user.isVerified = true;
            await user.save();
            return done(null, user);
          } catch (saveError) {
            console.error("Error saving linked Google account:", saveError);
            return done(saveError, null);
          }
        }

        // 3. Create a brand-new user from Google profile
        const nameParts = profile.displayName || "User";
        // Generate a unique username from email prefix
        let baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
        let username = baseUsername;
        let counter = 1;
        while (await User.exists({ username })) {
          username = `${baseUsername}_${counter}`;
          counter++;
        }

        user = await User.create({
          name: nameParts,
          username,
          email,
          googleId,
          authProvider: "google",
          isVerified: true, // Google emails are already verified
          avatar: profile.photos?.[0]?.value || "Avatar1",
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
