const express = require("express");
const {
  handleCreateNewsletter,
  handleGetNewsletters,
  handleGetNewsletterById,
  handleUpdateNewsletter,
  handleDeleteNewsletter,
} = require("../controllers/newsletter/newsletter");
const authMiddleware = require("../mildewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, handleCreateNewsletter);
router.get("/all", authMiddleware, handleGetNewsletters);
router.get("/:id", authMiddleware, handleGetNewsletterById);
router.patch("/:id", authMiddleware, handleUpdateNewsletter);
router.delete("/:id", authMiddleware, handleDeleteNewsletter);

module.exports = router;
