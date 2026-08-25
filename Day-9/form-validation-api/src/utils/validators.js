// Email format validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
};

// Name validation - must be a non-empty string after trimming
const isValidName = (name) => {
  return typeof name === 'string' && name.trim().length > 0;
};

// Age validation - must be a number between 5 and 100 (inclusive)
const MIN_AGE = 5;
const MAX_AGE = 100;
const isValidAge = (age) => {
  const num = Number(age);
  return age !== '' && age !== null && age !== undefined &&
    !isNaN(num) && Number.isInteger(num) && num >= MIN_AGE && num <= MAX_AGE;
};

module.exports = { isValidEmail, isValidName, isValidAge, MIN_AGE, MAX_AGE };