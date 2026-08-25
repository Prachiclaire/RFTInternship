// Basic email format validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password length validation
const MIN_PASSWORD_LENGTH = 6;
const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH;
};

module.exports = { isValidEmail, isValidPassword, MIN_PASSWORD_LENGTH };