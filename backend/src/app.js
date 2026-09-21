const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const apiLimiter = require('./middleware/rateLimiter');

// Import routes safely
const authRoutes = require('./routes/authRoutes');
const universityRoutes = require('./routes/universityRoutes');
const programRoutes = require('./routes/programRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Standard Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(apiLimiter);

// Safe Router Mounting Helper (Prevents 'Router.use() requires a middleware function but got a undefined' error)
const mountRoute = (path, router) => {
  if (router && typeof router === 'function') {
    app.use(path, router);
  } else {
    console.warn(`[Warning] Route for ${path} skipped because it is undefined or invalid.`);
  }
};

// Registering Routes
mountRoute('/api/auth', authRoutes);
mountRoute('/api/universities', universityRoutes);
mountRoute('/api/programs', programRoutes);
mountRoute('/api/applications', applicationRoutes);
mountRoute('/api/dashboard', dashboardRoutes);
mountRoute('/api/recommendations', recommendationRoutes);
mountRoute('/api/health', healthRoutes);

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;