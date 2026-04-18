const User = require('../../models/user');
const Contact = require("../../models/contactFrom");

// Fetch all users and contact submissions for admin-level access

async function handleGetAllusers(req,res) {
    const users = await User.find({});
    if(!users){
        res.status(400).json({ msg: "No user found"})
    }
    res.status(200).json({users});
}


async function handleGetContactInfo(req, res) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

module.exports = {
    handleGetAllusers,
    handleGetContactInfo
}