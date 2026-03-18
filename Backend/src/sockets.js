const Message = require("./models/message");
const Community = require("./models/community");

function initializeSockets(io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a specific community room
    socket.on("join_community", (communityId) => {
      socket.join(communityId);
      console.log(`User ${socket.id} joined community ${communityId}`);
    });

    // Leave a specific community room
    socket.on("leave_community", (communityId) => {
      socket.leave(communityId);
      console.log(`User ${socket.id} left community ${communityId}`);
    });

    // Handle sending message
    socket.on("send_message", async (data) => {
      try {
        const { communityId, senderId, text } = data;
        
        // Save message to database
        const newMessage = new Message({
          communityId,
          senderId,
          text
        });
        await newMessage.save();

        // Populate sender info before broadcasting
        await newMessage.populate("senderId", "name email avatar username");

        // Broadcast to everyone in the room
        io.to(communityId).emit("receive_message", newMessage);
      } catch (error) {
        console.error("Error sending message via socket:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = initializeSockets;
