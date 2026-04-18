const mongoose = require("mongoose");

// Schema for storing contact/feedback form submissions
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,  // // basic validation to avoid empty/invalid names
    },
    phoneNumber: {
      type: String,
      // required: true,
      // optional field (can be enabled if needed later)
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, //// normalize emails for consistency
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,  // basic validation to avoid empty/too short messages
    },
    type:{
      type:String,
      enum:['CONTACT','FEEDBACK','SUGGESTION'], //// restrict to known categories
      default:"CONTACT"
    }
  },
  // auto tracks submission time and updates
  { timestamps: true }  
);

module.exports = mongoose.model("Contact", contactSchema);
