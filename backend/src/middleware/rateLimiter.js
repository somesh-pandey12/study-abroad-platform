let apiLimiter = (req, res, next) => next(); // Default fallback safe middleware

try {
  const rateLimit = require('express-rate-limit');
  apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes'
    }
  });
} catch (error) {
  // If express-rate-limit is not installed, it falls back gracefully without crashing
  console.warn('express-rate-limit package not found, rate limiting bypassed.');
}

module.exports = apiLimiter;