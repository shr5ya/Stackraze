const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
      // Not required — Google OAuth users won't have a password
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // Only one avatar field
    avatar: {
      type: String,   // URL or preset avatar name
      default: "https://ui-avatars.com/api/?background=random&name=User",    // Default avatar
    },

    about:{
      type:String,
      default:"",
    },

    coverPhoto: {
      type: String,
      default: "",
    },

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailOtp: {
      type: String, // hashed OTP
    },

    emailOtpExpiry: {
      type: Date,
    },

    location: {
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      county: {
        type: String,
        trim: true,
      },
      placeName: {
        type: String,
        trim: true,
      },
      coordinates: {
        type: [Number], // [lat, long]
        default: undefined,
      },
    },

    lastLogin: {
      type: Date,
    }
  },
  { timestamps: true }
);

userSchema.index({ "location.coordinates": "2dsphere" });

const User = mongoose.model("User", userSchema);
module.exports = User;
