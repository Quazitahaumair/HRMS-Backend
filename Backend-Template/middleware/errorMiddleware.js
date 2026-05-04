const notFoundHandler = (req, res, _next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

const fs = require('fs');

const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  
  // Log the crash to a file for debugging
  fs.appendFileSync('backend_crashes.log', `[${new Date().toISOString()}] ERROR ${status}: ${err.message}\n${err.stack}\n\n`);

  res.status(status).json({
    message: err.message || 'Internal server error'
  });
};

module.exports = { notFoundHandler, errorHandler };
