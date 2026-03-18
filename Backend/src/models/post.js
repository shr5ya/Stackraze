const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      required: true,
      maxlength: 300,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    photos: [{ type: String }],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    shares: {
      type: Number,
      default: 0,
    },

    comments: [commentSchema], // embedded subdocuments

    // Newsletter-specific fields
    title: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    category: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    summary: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    coverImage: {
      type: String,
    },

    isNewLetter: {
      type: Boolean,
      default: false,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
