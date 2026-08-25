const express = require('express');
const router = express.Router();
const { searchProducts, searchUsers, searchPosts } = require('../controllers/searchController');

// GET /search?name=phone                              - search products by name
// GET /search?name=phone&category=electronics         - multiple filters
// GET /search?minPrice=500&maxPrice=5000              - price range filter
router.get('/', searchProducts);

// GET /search/users?name=john
// GET /search/users?email=gmail&role=admin
router.get('/users', searchUsers);

// GET /search/posts?title=hello
// GET /search/posts?title=hello&author=john
router.get('/posts', searchPosts);

module.exports = router;