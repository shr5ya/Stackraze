const Message = require("./models/message");
const Community = require("./models/community");

// Initialize all socket event handlers
function initializeSockets(io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a specific community room
    socket.on("join_community", (communityId) => {
      socket.join(communityId);
      console.log(`User ${socket.id} joined community ${communityId}`);
    });

    socket.on("leave_community", (communityId) => {
      socket.leave(communityId);
      console.log(`User ${socket.id} left community ${communityId}`);
    });

    // Handle sending message+broadcasting
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

       // Attach sender details before emitting
        await newMessage.populate("senderId", "name email avatar username");

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
