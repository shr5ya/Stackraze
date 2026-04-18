const mongoose = require('mongoose');

// Establish connection to MongoDB with specified database name
async function connectToMongoDB(url) {
    
    return mongoose.connect(url, {
        dbName: "anchor",   
    });
}

module.exports = {
    connectToMongoDB,
}
