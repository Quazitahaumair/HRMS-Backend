const express = require('express');
const { body } = require('express-validator');
const { applyLeave, getMyLeaves, getAllLeaves, updateStatus } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Apply for leave (Self)
router.post(
  '/',
  protect,
  [body('leaveType').notEmpty(), body('startDate').isISO8601(), body('endDate').isISO8601()],
  validate,
  applyLeave
);

// Get all leaves (Admin/HR only - filtered to employees only in service)
router.get('/', protect, authorize('admin', 'hr'), getAllLeaves);

// Get my own leaves
router.get('/me', protect, getMyLeaves);
router.get('/my-leaves', protect, getMyLeaves);

// Update leave status (Admin/HR only)
router.patch('/:id/status', protect, authorize('admin', 'hr'), updateStatus);

module.exports = router;
