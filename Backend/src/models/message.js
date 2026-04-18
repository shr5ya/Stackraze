const mongoose = require("mongoose");

// Schema for storing messages within a community (chat system)
const messageSchema = new mongoose.Schema({
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
    // ensures message always belongs to a community
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true  // tracks who sent the message
  },
  text: {
    type: String,
    required: true  // message content
  }
}, 

// adds createdAt for sorting/chat history and updatedAt for potential edits
{ timestamps: true });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
