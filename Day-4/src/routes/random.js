const express = require('express');
const RandomPicker = require('../utils/randomPicker');
const { quotes, jokes, facts } = require('../data/data');

const router = express.Router();

// Initialize pickers — each maintains its own state and no-repetition pool
const quotePicker = new RandomPicker(quotes);
const jokePicker = new RandomPicker(jokes);
const factPicker = new RandomPicker(facts);

// GET /quote — Return a random quote (no consecutive repetition)
router.get('/quote', (req, res) => {
  const quote = quotePicker.pick();
  res.status(200).json({
    type: 'quote',
    data: quote,
  });
});

// GET /joke — Return a random joke (no consecutive repetition)
router.get('/joke', (req, res) => {
  const joke = jokePicker.pick();
  res.status(200).json({
    type: 'joke',
    data: joke,
  });
});

// BONUS: GET /fact — Return a random fact (no consecutive repetition)
router.get('/fact', (req, res) => {
  const fact = factPicker.pick();
  res.status(200).json({
    type: 'fact',
    data: fact,
  });
});

// GET / — List all available endpoints
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Random Data API',
    endpoints: [
      { method: 'GET', path: '/quote', description: 'Returns a random quote' },
      { method: 'GET', path: '/joke', description: 'Returns a random joke' },
      { method: 'GET', path: '/fact', description: 'Returns a random fact (bonus)' },
    ],
  });
});

module.exports = router;