// Validates register and login request bodies
// Returns an array of error messages (empty if valid)

const validateRegister = ({ username, email, password }) => {
  const errors = [];

  if (!username || typeof username !== 'string' || username.trim().length < 2) {
    errors.push('username must be at least 2 characters');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('a valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('password must be at least 6 characters');
  }

  return errors;
};

const validateLogin = ({ email, password }) => {
  const errors = [];

  if (!email || typeof email !== 'string') {
    errors.push('email is required');
  }

  if (!password || typeof password !== 'string') {
    errors.push('password is required');
  }

  return errors;
};

module.exports = { validateRegister, validateLogin };