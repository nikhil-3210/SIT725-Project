const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { getProfile, updateUserProfile } = require('../controllers/authController');

const router = express.Router();

router.post("/register", registerUser); // Register endpoint
router.post('/login', loginUser);
router.get('/profile', protect, getProfile); // Get user profile
router.put("/profile", protect, updateUserProfile);
module.exports = router;