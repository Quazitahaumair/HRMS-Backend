const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('admin', 'hr', 'employee'),
        allowNull: false,
        defaultValue: 'employee'
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Associate Engineer'
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Engineering'
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      isResigned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      resignationDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      lastWorkingDay: {
        type: DataTypes.DATE,
        allowNull: true
      },
      resignationType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resignationReason: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'users',
      timestamps: true,
      hooks: {
        beforeCreate: async user => {
          user.password = await bcrypt.hash(user.password, 10);
        },
        beforeUpdate: async user => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        }
      }
    }
  );

  User.associate = models => {
    User.hasMany(models.Attendance, { foreignKey: 'userId', as: 'attendances' });
    User.hasMany(models.Leave, { foreignKey: 'userId', as: 'leaves' });
    User.hasOne(models.Payroll, { foreignKey: 'userId', as: 'payroll' });
    User.hasMany(models.Notification, { foreignKey: 'senderId', as: 'sentNotifications' });
    User.hasMany(models.Notification, { foreignKey: 'recipientId', as: 'notifications' });
    User.hasMany(models.Message, { foreignKey: 'senderId', as: 'sentMessages' });
    User.hasMany(models.Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
  };

  User.prototype.comparePassword = function comparePassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
  };

  return User;
};
