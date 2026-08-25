// In-memory posts store (acts like a database)
let posts = [
  {
    id: 1,
    title: "MY BLOG",
    content: "HELLO WORLD",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = 2;

// Get all posts
const getAllPosts = () => posts;

// Get single post by ID
const getPostById = (id) => posts.find(p => p.id === parseInt(id));

// Create a new post
const createPost = (title, content) => {
  const newPost = {
    id: nextId++,
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  posts.push(newPost);
  return newPost;
};

// Update post by ID
const updatePost = (id, title, content) => {
  const index = posts.findIndex(p => p.id === parseInt(id));
  if (index === -1) return null;

  posts[index] = {
    ...posts[index],
    title: title !== undefined ? title : posts[index].title,
    content: content !== undefined ? content : posts[index].content,
    updatedAt: new Date().toISOString()
  };

  return posts[index];
};

// Delete post by ID
const deletePost = (id) => {
  const index = posts.findIndex(p => p.id === parseInt(id));
  if (index === -1) return null;

  const deleted = posts[index];
  posts.splice(index, 1);
  return deleted;
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };