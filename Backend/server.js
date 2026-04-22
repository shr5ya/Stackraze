require('dotenv').config({ path: './src/config/config.env' });
const app = require("./src/app");
const { connectToMongoDB } = require("./src/connectMongo");
const http = require("http");
const { Server } = require("socket.io");
const initializeSockets = require("./src/sockets");

const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;
// Create HTTP server and attach Socket.IO for real-time features

const server = http.createServer(app);

// Attach Socket.IO to the HTTP server with CORS configuration
const io = new Server(server, {
  cors: {

    // Allow requests from client URL or all origins (fallback)
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Initialize all socket event handlers
initializeSockets(io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

connectToMongoDB(MONGODB_URL).then(() => {
  console.log("MongoDB connected!");
});