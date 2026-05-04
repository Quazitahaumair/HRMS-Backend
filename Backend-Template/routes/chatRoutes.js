const express = require('express');
const { users, getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all users (to start a chat with)
router.get('/users', protect, users);

// GET messages between logged-in user and a recipient
router.get('/messages/:recipientId', protect, getMessages);

// POST send a new message
router.post('/messages', protect, sendMessage);

module.exports = router;
