const express = require('express');
const authRoutes  = require('./src/routes/auth');
const postRoutes  = require('./src/routes/posts');
const commentRoutes = require('./src/routes/comments');

const app = express();

app.use(express.json());

// Routes
app.use('/auth',     authRoutes);
app.use('/posts',    postRoutes);
app.use('/comments', commentRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Blog System with Users - Day 17',
    endpoints: {
      register:          'POST /auth/register',
      login:             'POST /auth/login',
      createPost:        'POST /posts              (auth required)',
      getAllPosts:        'GET  /posts',
      getPostsByUser:    'GET  /posts/user/:userId',
      getSinglePost:     'GET  /posts/:id',
      updatePost:        'PUT  /posts/:id          (owner only)',
      deletePost:        'DELETE /posts/:id        (owner only)',
      addComment:        'POST /comments/:postId   (auth required)',
      getComments:       'GET  /comments/:postId'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Blog System running on port ${PORT}`);
});

module.exports = app;