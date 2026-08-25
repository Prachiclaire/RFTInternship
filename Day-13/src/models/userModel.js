// In-memory users store (acts like a database)
const users = [];

// Find user by email
const findByEmail = (email) => users.find(u => u.email === email);

// Find user by ID
const findById = (id) => users.find(u => u.id === id);

// Save a new user
const saveUser = (user) => {
  users.push(user);
  return user;
};

// Get all users (without passwords)
const getAllUsers = () => users.map(({ password, ...rest }) => rest);

let nextId = 1;
const getNextId = () => String(nextId++);

module.exports = { findByEmail, findById, saveUser, getAllUsers, getNextId };