const mongoose = require('mongoose');

async function connectToMongoDB(url) {
    return mongoose.connect(url, {
        dbName: "anchor",   
    });
}

module.exports = {
    connectToMongoDB,
}
