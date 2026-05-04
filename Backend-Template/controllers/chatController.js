const { Message, User } = require('../models');
const { Op } = require('sequelize');

const formatChatMessage = record => {
  const item = record.toJSON();

  return {
    ...item,
    recipientId: item.receiverId,
    text: item.message
  };
};

// GET all users (to start a chat with - excludes self)
const users = async (req, res, next) => {
  try {
    const data = await User.findAll({
      where: { id: { [Op.ne]: req.user.id } },
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'designation', 'department'],
      order: [['firstName', 'ASC']]
    });
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

// GET messages between logged-in user and a recipient
const getMessages = async (req, res, next) => {
  try {
    const { recipientId } = req.params;
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id, receiverId: recipientId },
          { senderId: recipientId, receiverId: req.user.id }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'receiver', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['createdAt', 'ASC']]
    });

    // Mark all incoming messages as read
    await Message.update(
      { isRead: true },
      { where: { senderId: recipientId, receiverId: req.user.id, isRead: false } }
    );

    return res.status(200).json(messages.map(formatChatMessage));
  } catch (error) {
    return next(error);
  }
};

// POST send a new message
const sendMessage = async (req, res, next) => {
  try {
    const receiverId = req.body.receiverId || req.body.recipientId;
    const rawMessage = typeof req.body.message === 'string' ? req.body.message : req.body.text;
    const message = typeof rawMessage === 'string' ? rawMessage.trim() : '';

    if (!receiverId || !message) {
      return res.status(400).json({ message: 'receiverId and message are required' });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({ message: 'You cannot send a message to yourself' });
    }

    const receiver = await User.findByPk(receiverId, {
      attributes: ['id']
    });

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const newMessage = await Message.create({
      senderId: req.user.id,
      receiverId,
      message
    });

    const full = await Message.findByPk(newMessage.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'receiver', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    return res.status(201).json(formatChatMessage(full));
  } catch (error) {
    return next(error);
  }
};

module.exports = { users, getMessages, sendMessage };
