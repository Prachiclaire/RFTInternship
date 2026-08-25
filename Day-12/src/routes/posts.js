const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');

// Core Features
router.get('/', getAllPosts);         // GET all posts
router.get('/:id', getSinglePost);   // GET single post
router.post('/', createPost);        // CREATE post

// Bonus Features
router.put('/:id', updatePost);      // UPDATE post
router.delete('/:id', deletePost);   // DELETE post

module.exports = router;