const express = require('express');
const { getSalary, getSlips, updateSalary, generate } = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/salary/:userId', protect, authorize('admin', 'hr'), getSalary);
router.put('/salary/:userId', protect, authorize('admin', 'hr'), updateSalary);
router.get('/slips', protect, authorize('admin', 'hr'), getSlips);
router.post('/generate', protect, authorize('admin', 'hr'), generate);

module.exports = router;
