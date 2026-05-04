const { registerUser, loginUser, loginAdminUser } = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const payload = await registerUser(req.body);
    return res.status(201).json(payload);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const payload = await loginUser(req.body);
    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const payload = await loginAdminUser(req.body);
    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

module.exports = { register, login, adminLogin, me };
