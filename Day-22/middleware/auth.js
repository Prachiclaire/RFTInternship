const jwt = require('jsonwebtoken');
const Activity = require('../models/Activity');

// Verify Token & Log Activity
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    // Async activity tracking
    Activity.create({
      userId: req.user.id,
      endpoint: req.originalUrl,
      method: req.method
    }).catch(err => console.error('Activity Logging Error:', err));

    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// Role-Based Authorization
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };