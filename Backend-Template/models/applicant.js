module.exports = (sequelize, DataTypes) => {
  const Applicant = sequelize.define(
    'Applicant',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true
      },
      experience: {
        type: DataTypes.STRING,
        allowNull: true
      },
      skills: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      education: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resumeUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('applied', 'shortlisted', 'interview', 'selected', 'hired', 'rejected'),
        defaultValue: 'applied'
      },
      appliedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      interviewDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      interviewer: {
        type: DataTypes.STRING,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'applicants',
      timestamps: true
    }
  );

  return Applicant;
};
