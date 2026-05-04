const express = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/events', protect, getEvents);
router.post('/events', protect, createEvent);
router.put('/events/:id', protect, updateEvent);
router.patch('/events/:id', protect, updateEvent);
router.delete('/events/:id', protect, deleteEvent);
router.post('/', protect, createEvent);

module.exports = router;
