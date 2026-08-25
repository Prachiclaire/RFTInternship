const express = require('express');
const router = express.Router();

// GET /hello
// GET /hello?name=John  — personalized greeting
router.get('/', (req, res) => {
  const name = req.query.name;

  if (name && typeof name === 'string' && name.trim().length > 0) {
    return res.status(200).json({
      message: `Hello, ${name.trim()}! Welcome to the API.`,
    });
  }

  res.status(200).json({
    message: 'Hello! Welcome to the API.',
  });
});

module.exports = router;