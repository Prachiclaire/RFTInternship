const { isValidEmail, isValidName, isValidAge, MIN_AGE, MAX_AGE } = require('../utils/validators');

// POST /submit
const submitForm = (req, res) => {
  const { name, email, age } = req.body;

  const errors = [];

  // Validate name -> not empty
  if (!isValidName(name)) {
    errors.push({ field: 'name', message: 'Name is required and cannot be empty' });
  }

  // Validate email -> valid format
  if (!email || !isValidEmail(email)) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }

  // Validate age -> 5-100
  if (age === undefined || age === null || age === '') {
    errors.push({ field: 'age', message: 'Age is required' });
  } else if (!isValidAge(age)) {
    errors.push({ field: 'age', message: `Age must be a whole number between ${MIN_AGE} and ${MAX_AGE}` });
  }

  // Bonus: return ALL errors at once, not just the first one
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Success
  res.status(200).json({
    success: true,
    message: 'Form submitted successfully',
    data: {
      name: name.trim(),
      email,
      age: Number(age)
    }
  });
};

module.exports = { submitForm };