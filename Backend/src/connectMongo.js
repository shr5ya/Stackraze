
// Import mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// Establish connection to MongoDB with specified database name
async function connectToMongoDB(url) {
    
    // Connect to MongoDB using the provided URL
    // The 'dbName' specifies which database to use inside the cluster
    return mongoose.connect(url, {
        dbName: "anchor",    // Database name (will be created if it doesn't exist)
    });
}

// Export the connection function so it can be used in server.js
module.exports = {
    connectToMongoDB,
}
