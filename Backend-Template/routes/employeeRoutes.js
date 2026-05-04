const express = require('express');
const { body } = require('express-validator');
const { getEmployees, getEmployeeById, createEmployeeRecord, updateEmployeeRecord, deleteEmployeeRecord, findDuplicateEmployees, cleanupDuplicates } = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin', 'hr'), getEmployees);
router.post(
  '/',
  protect,
  authorize('admin', 'hr'),
  [body('firstName').notEmpty(), body('lastName').notEmpty(), body('email').isEmail()],
  validate,
  createEmployeeRecord
);
router.get('/duplicates', protect, authorize('admin', 'hr'), findDuplicateEmployees);
router.delete('/duplicates/cleanup', protect, authorize('admin', 'hr'), cleanupDuplicates);
router.get('/:id', protect, authorize('admin', 'hr'), getEmployeeById);
router.put('/:id', protect, authorize('admin', 'hr'), updateEmployeeRecord);
router.delete('/:id', protect, authorize('admin', 'hr'), deleteEmployeeRecord);

module.exports = router;
