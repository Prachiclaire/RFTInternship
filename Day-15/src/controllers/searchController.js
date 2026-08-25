const db = require('../models/db');

// Helper: case-insensitive partial match
const match = (field, query) =>
  field.toLowerCase().includes(query.toLowerCase());

// GET /search?name=phone&category=electronics&minPrice=500&maxPrice=30000
const searchProducts = (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;

  if (!name && !category && !minPrice && !maxPrice) {
    return res.status(400).json({
      success: false,
      message: 'Provide at least one query param: name, category, minPrice, maxPrice'
    });
  }

  let results = [...db.products];

  // Partial match on name (Bonus)
  if (name) {
    results = results.filter(p => match(p.name, name));
  }

  // Filter by category (Multiple filters - Bonus)
  if (category) {
    results = results.filter(p => match(p.category, category));
  }

  // Filter by price range (Multiple filters - Bonus)
  if (minPrice) {
    results = results.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    results = results.filter(p => p.price <= parseFloat(maxPrice));
  }

  res.status(200).json({
    success: true,
    query: req.query,
    count: results.length,
    data: results
  });
};

// GET /search/users?name=john&email=gmail&role=admin
const searchUsers = (req, res) => {
  const { name, email, role } = req.query;

  if (!name && !email && !role) {
    return res.status(400).json({
      success: false,
      message: 'Provide at least one query param: name, email, role'
    });
  }

  let results = [...db.users];

  if (name) {
    results = results.filter(u => match(u.name, name));
  }

  if (email) {
    results = results.filter(u => match(u.email, email));
  }

  if (role) {
    results = results.filter(u => match(u.role, role));
  }

  res.status(200).json({
    success: true,
    query: req.query,
    count: results.length,
    data: results
  });
};

// GET /search/posts?title=hello&author=john
const searchPosts = (req, res) => {
  const { title, author } = req.query;

  if (!title && !author) {
    return res.status(400).json({
      success: false,
      message: 'Provide at least one query param: title, author'
    });
  }

  let results = [...db.posts];

  if (title) {
    results = results.filter(p => match(p.title, title));
  }

  if (author) {
    results = results.filter(p => match(p.author, author));
  }

  res.status(200).json({
    success: true,
    query: req.query,
    count: results.length,
    data: results
  });
};

module.exports = { searchProducts, searchUsers, searchPosts };