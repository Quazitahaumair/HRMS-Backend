const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

const User = sequelize.define('User', {
  email: DataTypes.STRING,
  role: DataTypes.STRING
}, { tableName: 'users', timestamps: true });

async function listUsers() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll();
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listUsers();
