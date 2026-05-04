const { ResignedEmployee, User } = require('../models');

const getAllResignedEmployees = async (filters = {}) => {
  const where = {};
  
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.resignationType) {
    where.resignationType = filters.resignationType;
  }

  return ResignedEmployee.findAll({
    where,
    order: [['resignationDate', 'DESC']]
  });
};

const getResignedEmployeeById = async id => {
  const employee = await ResignedEmployee.findByPk(id);
  if (!employee) {
    const error = new Error('Resigned employee not found');
    error.statusCode = 404;
    throw error;
  }
  return employee;
};

const createResignedEmployee = async (userId, payload) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error('Employee not found');
    error.statusCode = 404;
    throw error;
  }

  // Create resigned employee record
  const resignedEmployee = await ResignedEmployee.create({
    employeeId: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: payload.phone,
    department: user.department,
    role: user.role,
    joiningDate: user.createdAt,
    resignationDate: payload.resignationDate || new Date(),
    lastWorkingDay: payload.lastWorkingDay,
    noticePeriodDays: payload.noticePeriodDays,
    resignationType: payload.resignationType || 'voluntary',
    reason: payload.reason,
    exitNotes: payload.exitNotes,
    assetsReturned: payload.assetsReturned || [],
    settlementStatus: payload.settlementStatus || 'pending_clearance',
    settlementAmount: payload.settlementAmount,
    status: payload.status || 'in_notice_period'
  });

  // Update user status
  await user.update({
    status: 'inactive',
    isResigned: true,
    resignationDate: payload.resignationDate || new Date(),
    lastWorkingDay: payload.lastWorkingDay,
    resignationType: payload.resignationType || 'voluntary',
    resignationReason: payload.reason
  });

  return resignedEmployee;
};

const updateResignedEmployee = async (id, payload) => {
  const employee = await ResignedEmployee.findByPk(id);
  if (!employee) {
    const error = new Error('Resigned employee not found');
    error.statusCode = 404;
    throw error;
  }

  return employee.update(payload);
};

const generateExitLetterData = async id => {
  const employee = await ResignedEmployee.findByPk(id);
  if (!employee) {
    const error = new Error('Resigned employee not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    employeeId: employee.employeeId,
    name: employee.name,
    department: employee.department,
    role: employee.role,
    joiningDate: employee.joiningDate,
    resignationDate: employee.resignationDate,
    lastWorkingDay: employee.lastWorkingDay,
    resignationType: employee.resignationType,
    generatedDate: new Date()
  };
};

const getResignedStats = async () => {
  const total = await ResignedEmployee.count();
  const inNoticePeriod = await ResignedEmployee.count({
    where: { status: 'in_notice_period' }
  });
  const completed = await ResignedEmployee.count({
    where: { status: 'completed' }
  });

  return {
    total,
    inNoticePeriod,
    completed
  };
};

module.exports = {
  getAllResignedEmployees,
  getResignedEmployeeById,
  createResignedEmployee,
  updateResignedEmployee,
  generateExitLetterData,
  getResignedStats
};
