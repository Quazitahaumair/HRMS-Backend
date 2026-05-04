const { User, sequelize } = require('../models');
const { generateToken } = require('../utils/token');

const formatAuthUser = user => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role
});

const registerUser = async ({ firstName, lastName, email, password, role }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    where: sequelize.where(
      sequelize.fn('LOWER', sequelize.col('email')),
      normalizedEmail
    )
  });

  if (existingUser) {
    const error = new Error('Email already exists');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    firstName,
    lastName,
    email: normalizedEmail,
    password,
    role: role || 'employee'
  });

  return {
    token: generateToken(user),
    user: formatAuthUser(user)
  };
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    where: sequelize.where(
      sequelize.fn('LOWER', sequelize.col('email')),
      normalizedEmail
    )
  });

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  return {
    token: generateToken(user),
    user: formatAuthUser(user)
  };
};

const loginAdminUser = async credentials => {
  const payload = await loginUser(credentials);

  if (payload.user.role.toLowerCase() !== 'admin') {
    const error = new Error('Only admin can log in to the admin dashboard');
    error.statusCode = 403;
    throw error;
  }

  return payload;
};

module.exports = { registerUser, loginUser, loginAdminUser };
