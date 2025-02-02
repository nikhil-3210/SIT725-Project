const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getPosts, createPost, getMyPosts, updatePost, deletePost, getPostById } = require('../controllers/postController');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Set storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// Ensure 'uploads' directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Only accept images
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

router.get("/", getPosts);
router.post("/", protect, upload.single("foodImage"), createPost);
router.get("/my-posts", protect, getMyPosts);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.get("/:id", protect, getPostById);

// Serve images statically
router.use("/uploads", express.static("uploads"));

module.exports = router;