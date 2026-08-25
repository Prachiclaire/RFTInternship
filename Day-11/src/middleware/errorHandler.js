const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: messages,
    });
  }

  // Mongoose duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: 'Duplicate Entry',
      message: `A student with this ${field} already exists.`,
    });
  }

  // Mongoose CastError — invalid ObjectId format
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID',
      message: `"${err.value}" is not a valid student ID.`,
    });
  }

  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong.',
  });
};

module.exports = errorHandler;