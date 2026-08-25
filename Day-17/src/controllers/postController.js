const db = require('../models/db');

// POST /posts - User creates a post (auth required)
const createPost = (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'title and content are required' });
  }

  const post = db.savePost({
    id:        db.getNextPostId(),
    userId:    req.user.id,
    author:    req.user.name,
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  res.status(201).json({ success: true, message: 'Post created', data: post });
};

// GET /posts - Fetch all posts
const getAllPosts = (req, res) => {
  const posts = db.getAllPosts();
  res.status(200).json({ success: true, count: posts.length, data: posts });
};

// GET /posts/user/:userId - Fetch posts by user (linking data: user -> post)
const getPostsByUser = (req, res) => {
  const posts = db.findPostsByUser(req.params.userId);
  res.status(200).json({ success: true, count: posts.length, data: posts });
};

// GET /posts/:id - Fetch single post
const getSinglePost = (req, res) => {
  const post = db.findPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }
  res.status(200).json({ success: true, data: post });
};

// PUT /posts/:id - Edit post (owner only - Bonus)
const updatePost = (req, res) => {
  const post = db.findPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  // Owner check
  if (post.userId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Access denied. You can only edit your own posts.' });
  }

  const { title, content } = req.body;
  const updated = db.updatePost(req.params.id, { title, content });

  res.status(200).json({ success: true, message: 'Post updated', data: updated });
};

// DELETE /posts/:id - Delete post (owner only - Bonus)
const deletePost = (req, res) => {
  const post = db.findPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  // Owner check
  if (post.userId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Access denied. You can only delete your own posts.' });
  }

  db.deletePost(req.params.id);
  res.status(200).json({ success: true, message: 'Post deleted' });
};

module.exports = { createPost, getAllPosts, getPostsByUser, getSinglePost, updatePost, deletePost };