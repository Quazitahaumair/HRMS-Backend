module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('info', 'warning', 'alert'),
        allowNull: false,
        defaultValue: 'info'
      },
      recipientId: {
        type: DataTypes.UUID,
        allowNull: true, // NULL means global notification to all
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      tableName: 'notifications',
      timestamps: true
    }
  );

  Notification.associate = models => {
    Notification.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
    Notification.belongsTo(models.User, { foreignKey: 'recipientId', as: 'recipient' });
  };

  return Notification;
};
