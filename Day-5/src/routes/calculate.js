const express = require('express');
const router = express.Router();


// Supported operations: add, subtract, multiply, divide

router.get('/', (req, res) => {
  const { a, b, op } = req.query;

  // BONUS: Input validation with descriptive error responses
  if (a === undefined || b === undefined || !op) {
    return res.status(400).json({
      error: 'Missing parameters',
      message: 'Provide query params: a (number), b (number), op (add | subtract | multiply | divide)',
      example: '/calculate?a=10&b=5&op=add',
    });
  }

  const numA = parseFloat(a);
  const numB = parseFloat(b);

  if (isNaN(numA) || isNaN(numB)) {
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Both a and b must be valid numbers',
    });
  }

  const validOps = ['add', 'subtract', 'multiply', 'divide'];
  if (!validOps.includes(op)) {
    return res.status(400).json({
      error: 'Invalid operation',
      message: `op must be one of: ${validOps.join(', ')}`,
    });
  }

  if (op === 'divide' && numB === 0) {
    return res.status(400).json({
      error: 'Division by zero',
      message: 'b cannot be 0 when using the divide operation',
    });
  }

  let result;
  switch (op) {
    case 'add':      result = numA + numB; break;
    case 'subtract': result = numA - numB; break;
    case 'multiply': result = numA * numB; break;
    case 'divide':   result = numA / numB; break;
  }

  res.status(200).json({
    operation: op,
    a: numA,
    b: numB,
    result,
  });
});

module.exports = router;