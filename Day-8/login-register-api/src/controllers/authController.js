const userModel = require('../models/userModel');
const { isValidEmail, isValidPassword, MIN_PASSWORD_LENGTH } = require('../utils/validators');

// POST /register
const registerUser = (req, res) => {
  const { email, password } = req.body;

  // Validation: required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Validation: email format
  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  // Validation: password length
  if (!isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    });
  }

  // Bonus: prevent duplicate users
  if (userModel.findByEmail(email)) {
    return res.status(409).json({
      success: false,
      message: 'A user with this email already exists'
    });
  }

  // Store user in memory
  const user = userModel.saveUser({
    id: userModel.getNextId(),
    email,
    password, // NOTE: stored in plain text for this basic exercise (Day 13 covers hashing)
    createdAt: new Date().toISOString()
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: { id: user.id, email: user.email, createdAt: user.createdAt }
  });
};

// POST /login
const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Validation: required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Validation: email format
  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  // Check user exists
  const user = userModel.findByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check password matches
  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: { id: user.id, email: user.email }
  });
};

module.exports = { registerUser, loginUser };