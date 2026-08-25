const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const users = require('../store/users');

const router = express.Router();

// GET /api/profile — Protected route, accessible only with a valid JWT token
router.get('/', authenticateToken, (req, res) => {
  // req.user is set by the authenticateToken middleware
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'User account no longer exists.',
    });
  }

  res.status(200).json({
    message: 'Profile retrieved successfully.',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

module.exports = router;