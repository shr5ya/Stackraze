const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    phoneNumber: {
      type: String,
      // required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    type:{
      type:String,
      enum:['CONTACT','FEEDBACK','SUGGESTION'],
      default:"CONTACT"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
