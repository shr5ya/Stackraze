const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community');

// Get all communities
router.get('/', communityController.getAllCommunities);

// Get a single community by ID
router.get('/:id', communityController.getCommunityById);

// Create a new community
router.post('/', communityController.createCommunity);

// Get messages for a community
router.get('/:id/messages', communityController.getCommunityMessages);

module.exports = router;
