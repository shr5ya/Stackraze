
// Import required modules
const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");

// Initialize passport config
require("./config/passport");

// Create Express app instance
const app = express();
const userRoutes = require("./routes/user");
const adminRoutes = require('./routes/admin');
const newsletterRoutes = require('./routes/newsletter');
const communityRoutes = require('./routes/community');
const newsRoutes = require('./routes/news');

// middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
    
}));
app.use(express.json());
app.use(passport.initialize());

// ================= VIEW ENGINE SETUP ================= //

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Define the directory where view files (EJS templates) are stored
app.set("views", path.join(__dirname, "views"));

// routes
app.get("/", (req, res) => {
    return res.send("Hello World!");
});

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/newsletter', newsletterRoutes);
app.use('/community', communityRoutes);
app.use('/api/news', newsRoutes);

// Catch-all handler for undefined routes (must be last)
app.use((req, res) => {
    res.status(404).render("404", {
        message: "The requested page could not be found"
    });
});

// Export app to be used in server.js
module.exports = app;
