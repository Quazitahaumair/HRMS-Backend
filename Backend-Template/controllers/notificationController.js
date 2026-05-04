const { Notification, User } = require('../models');

/**
 * Send a notification to everyone or a specific user
 */
const createNotification = async (req, res, next) => {
  try {
    const { title, message, type, recipientId } = req.body;
    
    const notification = await Notification.create({
      title,
      message,
      type: type || 'info',
      senderId: req.user.id,
      recipientId: recipientId || null // null means global
    });

    return res.status(201).json(notification);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get notifications for the logged in user (includes global notifications)
 */
const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { recipientId: req.user.id },
          { recipientId: null }
        ]
      },
      include: [{ model: User, as: 'sender', attributes: ['firstName', 'lastName'] }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(notifications);
  } catch (error) {
    return next(error);
  }
};

module.exports = { createNotification, getMyNotifications };
