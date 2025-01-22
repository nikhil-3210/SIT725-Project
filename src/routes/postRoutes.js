const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  getPosts,
  createPost,
  getMyPosts,
  updatePost,
  deletePost,
  getPostById,
} = require('../controllers/postController');

const router = express.Router();

router.get('/', getPosts); // Public: Fetch all posts
router.post('/', protect, createPost); // Private: Create a post (Donors only)
router.get('/my-posts', protect, getMyPosts); // Private: Fetch posts created by logged-in user
router.put('/:id', protect, updatePost); // Private: Update a post
router.delete('/:id', protect, deletePost); // Private: Delete a post
router.get('/:id', protect, getPostById); // Private: Get a post by ID

module.exports = router;