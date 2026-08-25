const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expected: Bearer <token>

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No token provided. Please login to access this resource.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Your session has expired. Please login again.',
      });
    }
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid token. Access denied.',
    });
  }
};

module.exports = { authenticateToken };