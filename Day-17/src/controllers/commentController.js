const db = require('../models/db');

// POST /comments/:postId - Add comment to a post (auth required - Bonus)
const addComment = (req, res) => {
  const post = db.findPostById(req.params.postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ success: false, message: 'content is required' });
  }

  const comment = db.saveComment({
    id:        db.getNextCommentId(),
    postId:    parseInt(req.params.postId),
    userId:    req.user.id,
    author:    req.user.name,
    content,
    createdAt: new Date().toISOString()
  });

  res.status(201).json({ success: true, message: 'Comment added', data: comment });
};

// GET /comments/:postId - Get all comments for a post
const getComments = (req, res) => {
  const post = db.findPostById(req.params.postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const comments = db.getCommentsByPost(req.params.postId);
  res.status(200).json({ success: true, count: comments.length, data: comments });
};

module.exports = { addComment, getComments };