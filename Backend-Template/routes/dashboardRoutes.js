const express = require('express');
const { stats, notices, upcomingHolidays } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', protect, authorize('admin', 'hr'), stats);
router.get('/notices', protect, authorize('admin', 'hr'), notices);
router.post('/notices', protect, authorize('admin', 'hr'), notices);
router.get('/upcoming-holidays', protect, authorize('admin', 'hr'), upcomingHolidays);

module.exports = router;
