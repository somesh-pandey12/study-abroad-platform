const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// Route handler mapping with explicit check
router.get('/', protect, getDashboardData);

module.exports = router;