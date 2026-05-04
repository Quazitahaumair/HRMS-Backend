const express = require('express');
const { body } = require('express-validator');
const {
  getApplicants,
  getApplicant,
  createNewApplicant,
  updateStatus,
  scheduleApplicantInterview,
  addApplicantNotes,
  getStats
} = require('../controllers/applicantController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin', 'hr'), getApplicants);
router.get('/stats', protect, authorize('admin', 'hr'), getStats);
router.get('/:id', protect, authorize('admin', 'hr'), getApplicant);
router.post(
  '/',
  protect,
  authorize('admin', 'hr'),
  [body('name').notEmpty(), body('email').isEmail()],
  validate,
  createNewApplicant
);
router.patch('/:id/status', protect, authorize('admin', 'hr'), updateStatus);
router.post('/:id/schedule-interview', protect, authorize('admin', 'hr'), scheduleApplicantInterview);
router.post('/:id/notes', protect, authorize('admin', 'hr'), addApplicantNotes);

module.exports = router;
