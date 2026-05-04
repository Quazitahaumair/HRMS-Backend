const { User, Payroll, Attendance, Leave, Notification, Message, sequelize } = require('../models');

const getAllEmployees = async () =>
  User.findAll({
    where: { status: 'active' },
    attributes: { exclude: ['password'] },
    include: [{ model: Payroll, as: 'payroll' }],
    order: [['createdAt', 'DESC']]
  });

const getEmployeeById = async id => {
  const employee = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Payroll, as: 'payroll' }]
  });

  if (!employee) {
    const error = new Error('Employee not found');
    error.statusCode = 404;
    throw error;
  }

  return employee;
};

const createEmployee = async payload => {
  const normalizedRole = (payload.role || 'employee').toLowerCase();
  const normalizedStatus = (payload.status || 'active').toLowerCase();
  const normalizedEmail = payload.email.toLowerCase().trim();

  // Case-insensitive duplicate check
  const existingUser = await User.findOne({
    where: sequelize.where(
      sequelize.fn('LOWER', sequelize.col('email')),
      normalizedEmail
    )
  });

  if (existingUser) {
    const error = new Error('Employee with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: normalizedEmail,
    password: payload.password || 'Temp@123456',
    role: normalizedRole,
    designation: payload.designation || 'Associate Engineer',
    department: payload.department || 'Engineering',
    status: normalizedStatus
  });

  return getEmployeeById(user.id);
};

const updateEmployee = async (id, payload) => {
  const employee = await User.findByPk(id);

  if (!employee) {
    const error = new Error('Employee not found');
    error.statusCode = 404;
    throw error;
  }

  const allowed = ['firstName', 'lastName', 'email', 'designation', 'department', 'status', 'role'];
  allowed.forEach(field => {
    if (payload[field] !== undefined) employee[field] = payload[field];
  });

  await employee.save();
  return getEmployeeById(employee.id);
};

const deleteEmployee = async id => {
  const employee = await User.findByPk(id);

  if (!employee) {
    const error = new Error('Employee not found');
    error.statusCode = 404;
    throw error;
  }

  // Cascade delete all related records in correct order
  await Message.destroy({ where: { senderId: id } });
  await Message.destroy({ where: { receiverId: id } });
  await Notification.destroy({ where: { senderId: id } });
  await Notification.destroy({ where: { recipientId: id } });
  await Attendance.destroy({ where: { userId: id } });
  await Leave.destroy({ where: { userId: id } });
  await Payroll.destroy({ where: { userId: id } });

  await employee.destroy();
  return { message: 'Employee deleted successfully', id };
};

const findDuplicates = async () => {
  const employees = await User.findAll({
    attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt'],
    raw: true
  });

  const emailMap = {};
  employees.forEach(emp => {
    const lowerEmail = emp.email.toLowerCase();
    if (!emailMap[lowerEmail]) {
      emailMap[lowerEmail] = [];
    }
    emailMap[lowerEmail].push(emp);
  });

  const duplicates = Object.entries(emailMap)
    .filter(([email, list]) => list.length > 1)
    .map(([email, list]) => ({
      email,
      count: list.length,
      employees: list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    }));

  return duplicates;
};

const removeDuplicates = async () => {
  const duplicates = await findDuplicates();
  const removed = [];

  for (const dup of duplicates) {
    // Sort by createdAt, keep the oldest (first one)
    const sorted = dup.employees.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    // Remove all except the oldest
    const toDelete = sorted.slice(1);

    for (const emp of toDelete) {
      await deleteEmployee(emp.id);
      removed.push({ id: emp.id, email: emp.email, name: `${emp.firstName} ${emp.lastName}` });
    }
  }

  return { removed, count: removed.length };
};

module.exports = { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, findDuplicates, removeDuplicates };
