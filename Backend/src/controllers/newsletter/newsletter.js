const Post = require("../../models/post");
const User = require("../../models/user");

// Create a newsletter post
async function handleCreateNewsletter(req, res) {
  try {
    const { title, content, category, summary, coverImage } = req.body;
    const author = req.user.id;

    // Putting Basic validation to avoid empty/low-quality posts
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (!coverImage) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    let newsletter = await Post.create({
      title: title.trim(),
      content: content.trim(),
      category: category?.trim() || "General",
      summary: summary?.trim() || content.trim().slice(0, 200),
      coverImage,
      photos: coverImage ? [coverImage] : [],
      isNewLetter: true,
      isPublic: true,
      author,
    });

    // Attach author's details before sending response
    newsletter = await newsletter.populate("author", "username name avatar");

    return res.status(201).json({
      message: "Newsletter created successfully",
      newsletter,
    });
  } catch (error) {
    console.log("Create Newsletter Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get all newsletters with pagination
async function handleGetNewsletters(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const newsletters = await Post.find({ isNewLetter: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username name avatar");

    const totalNewsletters = await Post.countDocuments({ isNewLetter: true });

    // Fetch saved posts for logged-in user
    const currentUser = await User.findById(req.user.id)
      .select("savedPosts")
      .lean();
    const savedSet = new Set(
      (currentUser?.savedPosts || []).map((id) => id.toString())
    );

    const newslettersWithMeta = newsletters.map((post) => {
      const obj = post.toObject();
      obj.latestComment =
        obj.comments.length > 0
          ? obj.comments[obj.comments.length - 1]
          : null;
      obj.commentsCount = obj.comments.length;
      obj.isSaved = savedSet.has(obj._id.toString());
      delete obj.comments;
      return obj;
    });

    return res.status(200).json({
      message: "Newsletters fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalNewsletters / limit),
      totalNewsletters,
      newsletters: newslettersWithMeta,
    });
  } catch (error) {
    console.log("Get Newsletters Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get a single newsletter by ID
async function handleGetNewsletterById(req, res) {
  try {
    const { id } = req.params;

    const newsletter = await Post.findOne({ _id: id, isNewLetter: true })
      .populate("author", "username name avatar");

    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }

    return res.status(200).json({
      message: "Newsletter fetched successfully",
      newsletter,
    });
  } catch (error) {
    console.log("Get Newsletter Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Update a newsletter (author only)
async function handleUpdateNewsletter(req, res) {
  try {
    const { id } = req.params;
    const { title, content, category, summary, coverImage } = req.body;
    const userId = req.user.id;

    const newsletter = await Post.findOne({ _id: id, isNewLetter: true });

    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }

    if (newsletter.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this newsletter" });
    }

    if (title) newsletter.title = title.trim();
    if (content) newsletter.content = content.trim();
    if (category) newsletter.category = category.trim();
    if (summary) newsletter.summary = summary.trim();
    if (coverImage) {
      newsletter.coverImage = coverImage;
      newsletter.photos = [coverImage];
    }

    await newsletter.save();
    await newsletter.populate("author", "username name avatar");

    return res.status(200).json({
      message: "Newsletter updated successfully",
      newsletter,
    });
  } catch (error) {
    console.log("Update Newsletter Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Delete a newsletter (author only)
async function handleDeleteNewsletter(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const newsletter = await Post.findOne({ _id: id, isNewLetter: true });

    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }

    if (newsletter.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this newsletter" });
    }

    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Newsletter deleted successfully",
    });
  } catch (error) {
    console.log("Delete Newsletter Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = {
  handleCreateNewsletter,
  handleGetNewsletters,
  handleGetNewsletterById,
  handleUpdateNewsletter,
  handleDeleteNewsletter,
};
