const rateLimit = require('express-rate-limit');

// Max 10 short URL generation requests per 15 minutes per IP
const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many URL creation requests from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { createUrlLimiter };