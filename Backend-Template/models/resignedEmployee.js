module.exports = (sequelize, DataTypes) => {
  const ResignedEmployee = sequelize.define(
    'ResignedEmployee',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      employeeId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true
      },
      joiningDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      resignationDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      lastWorkingDay: {
        type: DataTypes.DATE,
        allowNull: true
      },
      noticePeriodDays: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      resignationType: {
        type: DataTypes.ENUM('voluntary', 'terminated', 'retirement', 'other'),
        defaultValue: 'voluntary'
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      exitNotes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      assetsReturned: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      settlementStatus: {
        type: DataTypes.ENUM('pending_clearance', 'completed'),
        defaultValue: 'pending_clearance'
      },
      settlementAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('in_notice_period', 'completed'),
        defaultValue: 'in_notice_period'
      }
    },
    {
      tableName: 'resigned_employees',
      timestamps: true
    }
  );

  return ResignedEmployee;
};
