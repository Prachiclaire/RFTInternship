const express = require('express');
const searchRoutes = require('./src/routes/search');

const app = express();

app.use(express.json());

// Routes
app.use('/search', searchRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Search API - Day 15',
    endpoints: {
      searchProducts: '/search?name=phone',
      searchUsers:    '/search/users?name=john&email=gmail',
      searchPosts:    '/search/posts?title=hello',
      multiFilter:    '/search?name=phone&minPrice=500&maxPrice=5000&category=electronics'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Search API running on port ${PORT}`);
});

module.exports = app;