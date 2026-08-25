const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createPost,
  getAllPosts,
  getPostsByUser,
  getSinglePost,
  updatePost,
  deletePost
} = require('../controllers/postController');

router.get('/',                getAllPosts);              // GET all posts (public)
router.get('/user/:userId',    getPostsByUser);          // GET posts by user (public)
router.get('/:id',             getSinglePost);           // GET single post (public)
router.post('/',      protect, createPost);              // CREATE post (auth required)
router.put('/:id',    protect, updatePost);              // UPDATE post (owner only)
router.delete('/:id', protect, deletePost);              // DELETE post (owner only)

module.exports = router;