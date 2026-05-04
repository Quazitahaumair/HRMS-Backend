const { User, Attendance, Leave, Notice } = require('../models');

const stats = async (_req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [totalEmployees, newEmployees, resignedEmployees, presentToday, onLeaveToday] = await Promise.all([
      User.count({ where: { status: 'active' } }),
      User.count({
        where: {
          createdAt: { [require('sequelize').Op.gte]: monthStart }
        }
      }),
      User.count({ where: { status: 'inactive' } }),
      Attendance.count({ where: { date: today } }),
      Leave.count({ where: { startDate: today } })
    ]);

    return res.status(200).json({
      totalEmployees,
      jobApplicants: 0,
      newEmployees,
      newEmployee: newEmployees,
      resignedEmployees,
      resignedEmployee: resignedEmployees,
      presentToday,
      onLeaveToday
    });
  } catch (error) {
    return next(error);
  }
};

const notices = async (req, res, next) => {
  try {
    if (req.method === 'POST') {
      const { title, content } = req.body;
      const notice = await Notice.create({
        title,
        content,
        createdBy: req.user?.id
      });
      return res.status(201).json(notice);
    }

    const notices = await Notice.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    return res.status(200).json(notices);
  } catch (error) {
    return next(error);
  }
};

const upcomingHolidays = async (_req, res) =>
  res.status(200).json([
    { id: 1, name: 'Labor Day', date: '2026-05-01' },
    { id: 2, name: 'Independence Day', date: '2026-08-14' }
  ]);

module.exports = { stats, notices, upcomingHolidays };
