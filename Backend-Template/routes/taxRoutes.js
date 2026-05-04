const express = require('express');
const { getStructure } = require('../controllers/taxController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/structure', protect, authorize('admin', 'hr'), getStructure);

module.exports = router;
