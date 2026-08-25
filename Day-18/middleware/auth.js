// middleware/auth.js — Simple user authentication middleware
// In a real app this would verify a JWT token. Here we read x-user-id from headers.

const { users } = require('../data/store');

const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Please provide x-user-id header.',
    });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: `Unauthorized: User "${userId}" not found. Valid users: u1, u2`,
    });
  }

  req.user = user; // attach user to request
  next();
};

module.exports = authenticate;