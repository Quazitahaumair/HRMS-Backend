const { Leave, User } = require('../models');

/**
 * Apply for a leave
 */
const createLeave = async ({ userId, payload }) =>
  Leave.create({
    ...payload,
    userId
  });

/**
 * Get all leaves for a specific user (includes user object for name display)
 */
const getLeavesByUserId = async userId =>
  Leave.findAll({
    where: { userId },
    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email', 'role'] }],
    order: [['createdAt', 'DESC']]
  });

/**
 * Get all leaves of employees ONLY (restricted to admin/hr)
 */
const getLeaves = async () => {
  console.log('[DEBUG] Fetching all leaves with user roles');
  const leaves = await Leave.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email', 'role']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  // Filter for employees only
  const employeeLeaves = leaves.filter(l => l.user && l.user.role === 'employee');
  console.log(`[DEBUG] Final employee leaves found: ${employeeLeaves.length}`);
  return employeeLeaves;
};

/**
 * Update leave status (approved/rejected)
 */
const updateLeaveStatus = async (id, status) => {
  const leave = await Leave.findByPk(id);
  if (!leave) {
    throw new Error('Leave record not found');
  }
  leave.status = status;
  await leave.save();
  return leave;
};

module.exports = { createLeave, getLeavesByUserId, getLeaves, updateLeaveStatus };
