// In-memory user store (acts like a database)
const users = [];

let nextId = 1;

const findByEmail = (email) => users.find(u => u.email === email);

const saveUser = (user) => {
  users.push(user);
  return user;
};

const getNextId = () => nextId++;

module.exports = { findByEmail, saveUser, getNextId };