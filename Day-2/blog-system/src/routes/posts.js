const express = require('express');
const { posts, comments } = require('../store');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/posts — Create a post (protected)
router.post('/', authenticateToken, (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }

  const newPost = {
    id: Date.now().toString(),
    title,
    content,
    authorId: req.user.id,
    authorName: req.user.username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  posts.push(newPost);

  res.status(201).json({
    message: 'Post created successfully',
    post: newPost,
  });
});

// GET /api/posts — Fetch all posts (public)
router.get('/', (req, res) => {
  const allPosts = posts.map((post) => ({
    ...post,
    commentCount: comments.filter((c) => c.postId === post.id).length,
  }));

  res.status(200).json({
    total: allPosts.length,
    posts: allPosts,
  });
});

// GET /api/posts/user/:userId — Fetch posts by a specific user (public)
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userPosts = posts.filter((p) => p.authorId === userId);

  res.status(200).json({
    total: userPosts.length,
    posts: userPosts,
  });
});

// GET /api/posts/:id — Fetch a single post with its comments (public)
router.get('/:id', (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const postComments = comments.filter((c) => c.postId === post.id);

  res.status(200).json({ post, comments: postComments });
});

// PUT /api/posts/:id — Edit a post (owner only)
router.put('/:id', authenticateToken, (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (post.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden: You can only edit your own posts' });
  }

  const { title, content } = req.body;

  if (title) post.title = title;
  if (content) post.content = content;
  post.updatedAt = new Date().toISOString();

  res.status(200).json({ message: 'Post updated successfully', post });
});

// DELETE /api/posts/:id — Delete a post (owner only)
router.delete('/:id', authenticateToken, (req, res) => {
  const index = posts.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (posts[index].authorId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden: You can only delete your own posts' });
  }

  posts.splice(index, 1);

  // Also remove all comments for this post
  const postId = req.params.id;
  const toRemove = comments.filter((c) => c.postId === postId);
  toRemove.forEach((c) => comments.splice(comments.indexOf(c), 1));

  res.status(200).json({ message: 'Post deleted successfully' });
});

module.exports = router;