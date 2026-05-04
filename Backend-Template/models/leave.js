module.exports = (sequelize, DataTypes) => {
  const Leave = sequelize.define(
    'Leave',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      leaveType: {
        type: DataTypes.ENUM('casual', 'sick', 'annual', 'unpaid'),
        allowNull: false
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
      }
    },
    {
      tableName: 'leaves',
      timestamps: true
    }
  );

  Leave.associate = models => {
    Leave.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Leave;
};
