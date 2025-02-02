const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getPosts, createPost, getMyPosts, updatePost, deletePost, getPostById } = require('../controllers/postController');
const multer = require("multer");

// Initialize router before using it
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/", // Directory where files will be stored
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Allow only images
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

// Debugging: Ensure all controller functions are properly defined
console.log({
  getPosts,
  createPost,
  getMyPosts,
  updatePost,
  deletePost,
  getPostById,
});

// Routes
router.get("/", getPosts); // Public: Fetch all posts
//router.post("/", protect, upload.none(), createPost); // Use multer to parse form-data router.get("/my-posts", protect, getMyPosts);
router.post("/", protect, upload.fields([{ name: "foodImage", maxCount: 1 }]), createPost); // Private: Create a post with image
router.get("/my-posts", protect, getMyPosts); // Private: Fetch posts created by logged-in user
router.put("/:id", protect, updatePost); // Private: Update a post
router.delete("/:id", protect, deletePost); // Private: Delete a post
router.get("/:id", protect, getPostById); // Private: Get a post by ID

module.exports = router;