// In-memory database (simulates a real DB with relationships)

const users    = [];
const posts    = [];
const comments = [];

let userNextId    = 1;
let postNextId    = 1;
let commentNextId = 1;

// --- Users ---
const findUserByEmail = (email) => users.find(u => u.email === email);
const findUserById    = (id)    => users.find(u => u.id === parseInt(id));
const saveUser        = (user)  => { users.push(user); return user; };
const getNextUserId   = ()      => userNextId++;

// --- Posts ---
const getAllPosts      = ()       => posts;
const findPostById    = (id)     => posts.find(p => p.id === parseInt(id));
const findPostsByUser = (userId) => posts.filter(p => p.userId === parseInt(userId));
const savePost        = (post)   => { posts.push(post); return post; };
const getNextPostId   = ()       => postNextId++;

const updatePost = (id, data) => {
  const index = posts.findIndex(p => p.id === parseInt(id));
  if (index === -1) return null;
  posts[index] = { ...posts[index], ...data, updatedAt: new Date().toISOString() };
  return posts[index];
};

const deletePost = (id) => {
  const index = posts.findIndex(p => p.id === parseInt(id));
  if (index === -1) return null;
  return posts.splice(index, 1)[0];
};

// --- Comments ---
const getCommentsByPost = (postId)  => comments.filter(c => c.postId === parseInt(postId));
const saveComment       = (comment) => { comments.push(comment); return comment; };
const getNextCommentId  = ()        => commentNextId++;

module.exports = {
  findUserByEmail, findUserById, saveUser, getNextUserId,
  getAllPosts, findPostById, findPostsByUser, savePost, updatePost, deletePost, getNextPostId,
  getCommentsByPost, saveComment, getNextCommentId
};