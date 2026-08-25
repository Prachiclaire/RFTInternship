const express = require('express');
const router = express.Router();

// In-memory user store (seeded with task data)
const users = [
  { id: 1, name: 'Amit', email: 'amit@example.com' },
  { id: 2, name: 'Riya', email: 'riya@example.com' },
];

// GET /users — Return all users
router.get('/', (req, res) => {
  res.status(200).json({
    total: users.length,
    users,
  });
});

// GET /users/:id — Return a specific user
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID. ID must be a number.' });
  }

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: `User with ID ${id} not found` });
  }

  res.status(200).json({ user });
});

// POST /users — Add a new user
router.post('/', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name,
    email,
  };

  users.push(newUser);

  res.status(201).json({
    message: 'User added successfully',
    user: newUser,
  });
});

module.exports = router;