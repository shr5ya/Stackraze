const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");

// Initialize passport config
require("./config/passport");

const app = express();
const userRoutes = require("./routes/user");
const adminRoutes = require('./routes/admin');
const newsletterRoutes = require('./routes/newsletter');
const communityRoutes = require('./routes/community');

// middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
}));
app.use(express.json());
app.use(passport.initialize());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// routes
app.get("/", (req, res) => {
    return res.send("Hello World!");
});

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/newsletter', newsletterRoutes);
app.use('/community', communityRoutes);

app.use((req, res) => {
    res.status(404).render("404", {
        message: "The requested page could not be found"
    });
});


module.exports = app;
