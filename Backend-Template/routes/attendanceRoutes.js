const express = require('express');
const {
  markAttendance,
  getMyAttendance,
  getEmployeeAttendance,
  markEmployeeAttendance,
  markAttendanceByEmail,
  updateAttendance,
  getToday,
  getPerformanceSummaryData,
  getMonthlyStatsData
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/mark', protect, markAttendance);
router.post('/check-in', protect, markAttendance);
router.post('/mark-by-email', protect, authorize('admin', 'hr'), markAttendanceByEmail);
router.get('/me', protect, getMyAttendance);
router.get('/today', protect, authorize('admin', 'hr'), getToday);
router.get('/user/:userId', protect, authorize('admin', 'hr'), getEmployeeAttendance);
router.post('/mark/:userId', protect, authorize('admin', 'hr'), markEmployeeAttendance);
router.put('/:id', protect, authorize('admin', 'hr'), updateAttendance);
router.get('/performance-summary', protect, authorize('admin', 'hr'), getPerformanceSummaryData);
router.get('/monthly-stats', protect, authorize('admin', 'hr'), getMonthlyStatsData);

module.exports = router;
