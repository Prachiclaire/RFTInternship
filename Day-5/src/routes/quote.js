const express = require('express');
const router = express.Router();

const quotes = [
  'The best way to get started is to quit talking and begin doing. — Walt Disney',
  'It is not whether you get knocked down, it is whether you get up. — Vince Lombardi',
  'If you are working on something you really care about, you do not have to be pushed. The vision pulls you. — Steve Jobs',
  'People who are crazy enough to think they can change the world are the ones who do. — Rob Siltanen',
  'Failure will never overtake me if my determination to succeed is strong enough. — Og Mandino',
  'We may encounter many defeats but we must not be defeated. — Maya Angelou',
  'Knowing is not enough; we must apply. Wishing is not enough; we must do. — Johann Wolfgang Von Goethe',
  'You learn more from failure than from success. Do not let it stop you. Failure builds character.',
];

// No-repetition state
let pool = [...quotes];
let last = null;

// GET /quote — Return a random quote without consecutive repetition
router.get('/', (req, res) => {
  if (pool.length === 0) pool = [...quotes];

  let available = pool.filter((q) => q !== last);
  if (available.length === 0) available = [...pool];

  const index = Math.floor(Math.random() * available.length);
  const selected = available[index];

  pool.splice(pool.indexOf(selected), 1);
  last = selected;

  res.status(200).json({
    type: 'quote',
    data: selected,
  });
});

module.exports = router;