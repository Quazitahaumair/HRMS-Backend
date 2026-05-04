const { createLeave, getLeavesByUserId, getLeaves, updateLeaveStatus } = require('../services/leaveService');

const applyLeave = async (req, res, next) => {
  try {
    const leave = await createLeave({
      userId: req.user.id,
      payload: req.body
    });
    return res.status(201).json(leave);
  } catch (error) {
    return next(error);
  }
};

const getMyLeaves = async (req, res, next) => {
  try {
    const leaves = await getLeavesByUserId(req.user.id);
    return res.status(200).json(leaves);
  } catch (error) {
    return next(error);
  }
};

const getAllLeaves = async (req, res, next) => {
  try {
    const rawLeaves = await getLeaves();

    // FINAL HARD FILTER
    const filteredLeaves = rawLeaves.filter(leave => {
      const userRole = (leave.user?.role || '').toLowerCase();
      return userRole === 'employee';
    });

    // VERIFICATION HEADER
    res.setHeader('X-Refreshed-By', 'Antigravity');
    
    console.log(`[STRICT FILTER] Found ${rawLeaves.length} raw records, sending ${filteredLeaves.length} filtered records.`);
    return res.status(200).json(filteredLeaves);
  } catch (error) {
    return next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be approved or rejected.' });
    }

    const leave = await updateLeaveStatus(id, status);
    return res.status(200).json(leave);
  } catch (error) {
    return next(error);
  }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateStatus };
