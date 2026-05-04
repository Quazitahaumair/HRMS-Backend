const { Payroll, User } = require('../models');

const toNumber = value => Number(value || 0);

const formatPayroll = payroll => {
  const item = payroll.toJSON();
  const basicSalary = toNumber(item.basicSalary);
  const allowances = toNumber(item.allowances);
  const deductions = toNumber(item.deductions);
  const grossSalary = basicSalary + allowances;
  const netSalary = grossSalary - deductions;

  return {
    ...item,
    basicSalary,
    allowances,
    deductions,
    grossSalary,
    netSalary
  };
};

const ensurePayrollForUser = async userId => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'designation', 'department', 'status']
  });

  if (!user) {
    const error = new Error('Employee not found');
    error.statusCode = 404;
    throw error;
  }

  const [payroll] = await Payroll.findOrCreate({
    where: { userId: user.id },
    defaults: {
      basicSalary: 0,
      allowances: 0,
      deductions: 0,
      currency: 'USD'
    },
    include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'designation', 'department', 'status'] }]
  });

  const hydratedPayroll =
    payroll.user
      ? payroll
      : await Payroll.findOne({
          where: { userId: user.id },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'designation', 'department', 'status']
            }
          ]
        });

  return formatPayroll(hydratedPayroll);
};

const getSalaryByUserId = async userId => ensurePayrollForUser(userId);

const getPayrollSlips = async () => {
  const users = await User.findAll({
    attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'designation', 'department', 'status'],
    order: [['createdAt', 'ASC']]
  });

  const slips = await Promise.all(users.map(user => ensurePayrollForUser(user.id)));
  return slips;
};

const normalizeMoney = (value, fieldName) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    const error = new Error(`${fieldName} must be a valid non-negative number`);
    error.statusCode = 400;
    throw error;
  }

  return numericValue;
};

const updateSalaryByUserId = async (userId, payload) => {
  await ensurePayrollForUser(userId);

  const payroll = await Payroll.findOne({ where: { userId } });

  if (payload.basicSalary !== undefined) {
    payroll.basicSalary = normalizeMoney(payload.basicSalary, 'basicSalary');
  }

  if (payload.allowances !== undefined) {
    payroll.allowances = normalizeMoney(payload.allowances, 'allowances');
  }

  if (payload.deductions !== undefined) {
    payroll.deductions = normalizeMoney(payload.deductions, 'deductions');
  }

  if (payload.currency !== undefined) {
    payroll.currency = String(payload.currency || '').trim().toUpperCase() || 'USD';
  }

  await payroll.save();
  return ensurePayrollForUser(userId);
};

const generatePayroll = async payload => {
  const userId = payload && payload.userId;

  if (userId) {
    return getSalaryByUserId(userId);
  }

  return getPayrollSlips();
};

module.exports = { getSalaryByUserId, getPayrollSlips, updateSalaryByUserId, generatePayroll };
