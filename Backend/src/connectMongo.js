const mongoose = require('mongoose');

async function connectToMongoDB(url) {
    return mongoose.connect(url, {
        dbName: "anchor",
        tls: true,
        tlsAllowInvalidCertificates: true,
    });
}

module.exports = {
    connectToMongoDB,
}
