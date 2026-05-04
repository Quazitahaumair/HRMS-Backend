module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    'Attendance',
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
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      checkIn: {
        type: DataTypes.DATE,
        allowNull: true
      },
      checkOut: {
        type: DataTypes.DATE,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('present', 'absent', 'late'),
        defaultValue: 'present'
      }
    },
    {
      tableName: 'attendances',
      timestamps: true
    }
  );

  Attendance.associate = models => {
    Attendance.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Attendance;
};
