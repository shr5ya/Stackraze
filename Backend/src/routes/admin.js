const express = require('express');
const {handleGetAllusers,handleGetContactInfo} = require('../controllers/admin/admin')

const router = express.Router();

// Admin routes to fetch users and contact form submissions
router.get('/allusers',handleGetAllusers);
router.get('/contactFroms',handleGetContactInfo);

module.exports = router;