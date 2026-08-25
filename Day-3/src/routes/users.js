const express = require('express');
const router = express.Router();

// In-memory data store (as specified in the task)
const users = [
  { id: 1, name: 'Amit' },
  { id: 2, name: 'Riya' },
];

// GET /users — Return all users
router.get('/', (req, res) => {
  res.status(200).json({
    total: users.length,
    users: users,
  });
});

// GET /users/:id — Return a specific user by ID
// BONUS: Return error if user not found
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format. ID must be a number.' });
  }

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: `User with ID ${id} not found` });
  }

  res.status(200).json({ user });
});

module.exports = router;