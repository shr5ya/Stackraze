const Post = require("../../models/post");
const User = require("../../models/user");

async function handleCreatePost(req, res) {
  try {
    const { content, photos, isPublic } = req.body;
    const author = req.user.id;

    if (!content || content.length > 800) {
      return res.status(400).json({
        message: "Content is required and must be under 200 characters",
      });
    }

    let post = await Post.create({
      content,
      photos: photos || [],
      isPublic,
      author,
    });

    post = await post.populate("author", "username name avatar");

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log("Create Post Error:", error.message);
    console.log("Full Error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message, // temporarily showing error for debugging
    });
  }
}

// async function handleGetAllPosts(req, res) {
//     try {
//         const posts = await Post.find().populate("author", "username name avatar");
//         return res.status(200).json({
//             message: 'Posts fetched successfully',
//             posts
//         });
//     } catch (error) {
//         console.log("Get All Posts Error:", error.message);
//         console.log("Full Error:", error);

//         return res.status(500).json({
//             message: 'Internal server error',
//             error: error.message  // temporarily showing error for debugging
//         });
//     }
// }

async function handleGetAllPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit)
      .populate("author", "username name avatar");

    const totalPosts = await Post.countDocuments();

    return res.status(200).json({
      message: "Posts fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      posts,
    });
  } catch (error) {
    console.log("Get All Posts Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function handleDeletePost(req, res) {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    // Find and delete
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
      post: deletedPost,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function handleLikePost(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
        
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let liked;

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((uid) => uid.toString() !== userId.toString());
      liked = false;
    } else {
      post.likes.push(userId);
      liked = true;
    }

    await post.save();

    return res.status(200).json({
      message: liked ? "Post liked successfully" : "Post unliked successfully",
      likesCount: post.likes.length,
      liked,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function handleGetUSerPosts(req,res) {
  try {
    const username = String(req.params.username || "").trim().toLowerCase();

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await User.findOne({ username }).select("_id").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("author", "username name avatar");

    return res.status(200).json({
      message: "User posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
  handleCreatePost,
  handleGetAllPosts,
  handleDeletePost,
  handleLikePost,
  handleGetUSerPosts
};
