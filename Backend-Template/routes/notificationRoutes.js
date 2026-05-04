const express = require('express');
const { createNotification, getMyNotifications } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Get my notifications (All Users)
router.get('/', protect, getMyNotifications);

// Create notification (HR/Admin Only)
router.post('/', protect, authorize('admin', 'hr'), createNotification);

module.exports = router;
