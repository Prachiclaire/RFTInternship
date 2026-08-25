
// Prints method, URL, timestamp, and response time for every request

const logger = (req, res, next) => {
  const start = Date.now();

  // Run after response is sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} — Status: ${res.statusCode} — ${duration}ms`
    );
  });

  next();
};

module.exports = logger;