const mongoose = require("mongoose");


// Schema for community groups (used for chat + user grouping)
const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true   // ensures no duplicate community names
  },
  description: {
    type: String,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false  // used to identify default communities like "General" or "Announcements" basically community names that are reserved and cannot be created by users
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"  //reference to users in this community
  }]
}, { timestamps: true });  // auto adds createdAt and updatedAt fields

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
