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
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

initializeSockets(io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

connectToMongoDB(MONGODB_URL).then(() => {
  console.log("MongoDB connected!");
});