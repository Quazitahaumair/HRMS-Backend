const {
  markUserAttendance,
  getAttendanceByUserId,
  updateAttendanceRecord,
  getTodayAttendance,
  getPerformanceSummary,
  getMonthlyStats
} = require('../services/attendanceService');

const markAttendance = async (req, res, next) => {
  try {
    console.log('DEBUG Backend: markAttendance called, req.user:', req.user);
    console.log('DEBUG Backend: user.id:', req.user?.id, 'user.role:', req.user?.role);
    const result = await markUserAttendance(req.user.id);
    console.log('DEBUG Backend: markUserAttendance result:', result);
    return res.status(result.statusCode).json(result.data);
  } catch (error) {
    console.error('DEBUG Backend: markAttendance error:', error);
    return next(error);
  }
};

const getMyAttendance = async (req, res, next) => {
  try {
    const records = await getAttendanceByUserId(req.user.id);
    return res.status(200).json(records);
  } catch (error) {
    return next(error);
  }
};

const getEmployeeAttendance = async (req, res, next) => {
  try {
    const records = await getAttendanceByUserId(req.params.userId);
    return res.status(200).json(records);
  } catch (error) {
    return next(error);
  }
};

const markEmployeeAttendance = async (req, res, next) => {
  try {
    const result = await markUserAttendance(req.params.userId);
    return res.status(result.statusCode).json(result.data);
  } catch (error) {
    return next(error);
  }
};

const markAttendanceByEmail = async (req, res, next) => {
  try {
    const { User } = require('../models');
    const { sequelize } = require('../models');
    const email = req.body.email?.toLowerCase().trim();
    
    const user = await User.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('email')),
        email
      )
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Employee not found with this email' });
    }
    
    const result = await markUserAttendance(user.id);
    return res.status(result.statusCode).json({
      ...result.data,
      employee: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      }
    });
  } catch (error) {
    return next(error);
  }
};

const updateAttendance = async (req, res, next) => {
  try {
    const record = await updateAttendanceRecord(req.params.id, req.body);
    return res.status(200).json(record);
  } catch (error) {
    return next(error);
  }
};

const getToday = async (_req, res, next) => {
  try {
    const result = await getTodayAttendance();
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const getPerformanceSummaryData = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const result = await getPerformanceSummary(limit);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const getMonthlyStatsData = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const result = await getMonthlyStats(year);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  markAttendance,
  getMyAttendance,
  getEmployeeAttendance,
  markEmployeeAttendance,
  markAttendanceByEmail,
  updateAttendance,
  getToday,
  getPerformanceSummaryData,
  getMonthlyStatsData
};
