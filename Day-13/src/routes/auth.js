const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const userModel = require('../models/userModel');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route example (requires valid JWT token)
router.get('/me', protect, (req, res) => {
  const user = userModel.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, user: { id: user.id, email: user.email, createdAt: user.createdAt } });
});

module.exports = router;