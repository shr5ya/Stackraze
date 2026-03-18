const Community = require('../models/community');
const Message = require('../models/message');

exports.getAllCommunities = async (req, res) => {
  try {
    let communities = await Community.find();
    
    // Create some default communities if none exist
    if (communities.length === 0) {
      const defaults = [
        { name: 'General', description: 'General discussion', isDefault: true },
        { name: 'Announcements', description: 'Important updates', isDefault: true },
        { name: 'Tech Talk', description: 'Technology and programming', isDefault: true },
        { name: 'Gaming', description: 'Gaming discussion', isDefault: true },
      ];
      await Community.insertMany(defaults);
      communities = await Community.find();
    }
    
    res.status(200).json(communities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ message: 'Server error fetching communities' });
  }
};

exports.getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    res.status(200).json(community);
  } catch (error) {
    console.error('Error fetching community:', error);
    res.status(500).json({ message: 'Server error fetching community' });
  }
};

exports.createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const existing = await Community.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Community with this name already exists' });
    }

    const newCommunity = new Community({
      name,
      description
    });

    await newCommunity.save();
    res.status(201).json(newCommunity);
  } catch (error) {
    console.error('Error creating community:', error);
    res.status(500).json({ message: 'Server error creating community' });
  }
};

exports.getCommunityMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const { before, limit = 20 } = req.query;
    
    let query = { communityId: id };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate('senderId', 'name email avatar username')
      .sort({ createdAt: -1 }) // Newest first for easy limit
      .limit(parseInt(limit));
      
    // Return in chronological order (oldest first)
    res.status(200).json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};
