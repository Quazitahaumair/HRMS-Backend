const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const taxRoutes = require('./routes/taxRoutes');
const applicantRoutes = require('./routes/applicantRoutes');
const resignedEmployeeRoutes = require('./routes/resignedEmployeeRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/employees/resigned', resignedEmployeeRoutes);  // Must be before /api/employees
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/applicants', applicantRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

function startListening(label = '') {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}${label}`);
  });

  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the previous backend process, then restart.`);
      return;
    }

    console.error('Server startup error:', err.message);
  });
}

async function ensureDefaultUsers() {
  const db = require('./models');

  const adminUser = await db.User.findOne({ where: { email: 'Fivopay@gmail.com' } });
  if (!adminUser) {
    await db.User.create({
      firstName: 'Fivopay',
      lastName: 'HR',
      email: 'Fivopay@gmail.com',
      password: 'Fivopay@123',
      role: 'admin',
      designation: 'HR Manager',
      department: 'Human Resources'
    });
    console.log('AUTO-SEED: Fivopay admin created on startup.');
  }

  const employeeUser = await db.User.findOne({ where: { email: 'Quazi@hrms.local' } });
  if (!employeeUser) {
    await db.User.create({
      firstName: 'Quazi',
      lastName: 'Taha',
      email: 'Quazi@hrms.local',
      password: 'Quazi@123',
      role: 'employee',
      designation: 'Frontend Developer',
      department: 'Engineering'
    });
    console.log('AUTO-SEED: Quazi employee created on startup.');
  }
}

async function startServer() {
  try {
    await sequelize.authenticate({ logging: false });
    console.log('Connection to the database has been established successfully.');

    // force: true = clean slate (deletes all data) - use for fresh start
    // alter: true = preserve data (updates schema) - use after initial setup
    const fs = require('fs');
    const setupFlag = './.db-initialized';
    const syncOptions = fs.existsSync(setupFlag) ? { alter: true } : { force: true };
    
    await sequelize.sync({ ...syncOptions, logging: false });
    
    if (!fs.existsSync(setupFlag)) {
      fs.writeFileSync(setupFlag, 'Database initialized');
      console.log('Database initialized with fresh schema');
    }
    
    await ensureDefaultUsers();
    startListening();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.warn('Starting server without database connection...');
    startListening(' (Database Disconnected)');
  }
}

startServer();

module.exports = app;
