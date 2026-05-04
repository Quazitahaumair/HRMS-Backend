const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_me');
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token verification failed' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.map(r => r.toLowerCase()).includes(req.user.role.toLowerCase())) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
};

module.exports = { protect, authorize };
