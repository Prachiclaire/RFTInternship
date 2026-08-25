const postModel = require('../models/postModel');

// GET /posts - Get all posts
const getAllPosts = (req, res) => {
  const posts = postModel.getAllPosts();
  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
};

// GET /posts/:id - Get single post
const getSinglePost = (req, res) => {
  const post = postModel.getPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }
  res.status(200).json({ success: true, data: post });
};

// POST /posts - Create post
const createPost = (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' });
  }
  const post = postModel.createPost(title, content);
  res.status(201).json({ success: true, data: post });
};

// PUT /posts/:id - Update post (BONUS)
const updatePost = (req, res) => {
  const { title, content } = req.body;
  const post = postModel.updatePost(req.params.id, title, content);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }
  res.status(200).json({ success: true, data: post });
};

// DELETE /posts/:id - Delete post (BONUS)
const deletePost = (req, res) => {
  const post = postModel.deletePost(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }
  res.status(200).json({ success: true, message: 'Post deleted successfully', data: post });
};

module.exports = { getAllPosts, getSinglePost, createPost, updatePost, deletePost };