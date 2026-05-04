const express = require('express');
const {
  getResignedEmployees,
  getResignedEmployee,
  createResigned,
  updateResigned,
  getExitLetter,
  getStats
} = require('../controllers/resignedEmployeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin', 'hr'), getResignedEmployees);
router.get('/stats', protect, authorize('admin', 'hr'), getStats);
router.post('/', protect, authorize('admin', 'hr'), createResigned);
router.get('/:id', protect, authorize('admin', 'hr'), getResignedEmployee);
router.put('/:id', protect, authorize('admin', 'hr'), updateResigned);
router.get('/:id/exit-letter', protect, authorize('admin', 'hr'), getExitLetter);

module.exports = router;
