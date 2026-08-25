// Global error handler — catches any unhandled errors thrown in routes
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);

  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong. Please try again.',
  });
};

module.exports = errorHandler;