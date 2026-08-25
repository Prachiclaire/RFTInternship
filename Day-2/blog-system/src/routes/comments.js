const express = require('express');
const { posts, comments } = require('../store');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/comments/:postId — Add a comment to a post (protected)
router.post('/:postId', authenticateToken, (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  const post = posts.find((p) => p.id === req.params.postId);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const newComment = {
    id: Date.now().toString(),
    postId: req.params.postId,
    text,
    authorId: req.user.id,
    authorName: req.user.username,
    createdAt: new Date().toISOString(),
  };

  comments.push(newComment);

  res.status(201).json({ message: 'Comment added successfully', comment: newComment });
});

// DELETE /api/comments/:id — Delete a comment (owner only)
router.delete('/:id', authenticateToken, (req, res) => {
  const index = comments.findIndex((c) => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (comments[index].authorId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden: You can only delete your own comments' });
  }

  comments.splice(index, 1);

  res.status(200).json({ message: 'Comment deleted successfully' });
});

module.exports = router;