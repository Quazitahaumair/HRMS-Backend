const { Attendance, User } = require('../models');

const markUserAttendance = async userId => {
  const today = new Date().toISOString().slice(0, 10);
  console.log('DEBUG Service: markUserAttendance called, userId:', userId, 'today:', today);

  const existing = await Attendance.findOne({
    where: { userId, date: today }
  });
  console.log('DEBUG Service: existing record:', existing);

  if (existing) {
    console.log('DEBUG Service: Updating checkOut for existing record');
    existing.checkOut = new Date();
    await existing.save();
    console.log('DEBUG Service: checkOut updated:', existing.checkOut);
    return { statusCode: 200, data: existing };
  }

  console.log('DEBUG Service: Creating new attendance record');
  const attendance = await Attendance.create({
    userId,
    date: today,
    checkIn: new Date(),
    status: 'present'
  });
  console.log('DEBUG Service: new attendance created:', attendance.id);

  return { statusCode: 201, data: attendance };
};

const getAttendanceByUserId = async userId =>
  Attendance.findAll({
    where: { userId },
    order: [['date', 'DESC']]
  });

const updateAttendanceRecord = async (attendanceId, updateData) => {
  const attendance = await Attendance.findByPk(attendanceId);

  if (!attendance) {
    const error = new Error('Attendance record not found');
    error.statusCode = 404;
    throw error;
  }

  return attendance.update(updateData);
};

const getTodayAttendance = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const records = await Attendance.findAll({
    where: { date: today },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'designation', 'department', 'status']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  const summary = {
    date: today,
    total: records.length,
    present: records.filter(record => record.status === 'present').length,
    absent: records.filter(record => record.status === 'absent').length,
    late: records.filter(record => record.status === 'late').length
  };

  return {
    summary,
    records,
    data: records
  };
};

const getPerformanceSummary = async (limit = 3) => {
  const { sequelize } = require('../models');
  const { Op } = require('sequelize');

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).toISOString().slice(0, 10);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().slice(0, 10);

  const users = await User.findAll({
    where: { role: 'employee', status: 'active' },
    attributes: ['id', 'firstName', 'lastName', 'email', 'designation']
  });

  const performanceData = await Promise.all(
    users.map(async user => {
      const attendances = await Attendance.findAll({
        where: {
          userId: user.id,
          date: {
            [Op.gte]: firstDayOfMonth,
            [Op.lte]: lastDayOfMonth
          }
        }
      });

      const { Leave } = require('../models');
      const leaves = await Leave.findAll({
        where: {
          userId: user.id,
          status: 'approved',
          [Op.or]: [
            {
              startDate: { [Op.lte]: lastDayOfMonth },
              endDate: { [Op.gte]: firstDayOfMonth }
            }
          ]
        }
      });

      const workingDays = 22;
      const daysPresent = attendances.filter(a => a.status === 'present').length;
      const daysAbsent = attendances.filter(a => a.status === 'absent').length;
      const daysLate = attendances.filter(a => a.status === 'late').length;

      let daysOnLeave = 0;
      leaves.forEach(leave => {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        const monthStart = new Date(firstDayOfMonth);
        const monthEnd = new Date(lastDayOfMonth);
        const effectiveStart = start > monthStart ? start : monthStart;
        const effectiveEnd = end < monthEnd ? end : monthEnd;
        const diffTime = Math.abs(effectiveEnd - effectiveStart);
        daysOnLeave += Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      });

      const attendanceRate = workingDays > 0 ? ((daysPresent + daysLate) / workingDays) * 100 : 0;
      const punctualityScore = daysPresent + daysLate > 0
        ? (daysPresent / (daysPresent + daysLate)) * 100
        : 0;

      let totalWorkHours = 0;
      let workDaysWithHours = 0;
      attendances.forEach(a => {
        if (a.checkIn && a.checkOut) {
          const hours = (new Date(a.checkOut) - new Date(a.checkIn)) / (1000 * 60 * 60);
          if (hours > 0) {
            totalWorkHours += hours;
            workDaysWithHours++;
          }
        }
      });
      const averageWorkHours = workDaysWithHours > 0 ? totalWorkHours / workDaysWithHours : 0;

      const performanceScore = (
        attendanceRate * 0.5 +
        punctualityScore * 0.3 +
        (averageWorkHours / 8) * 20 * 0.2
      );

      return {
        employeeId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.avatar || null,
        attendanceRate: Math.round(attendanceRate * 10) / 10,
        punctualityScore: Math.round(punctualityScore * 10) / 10,
        daysPresent,
        daysAbsent,
        daysOnLeave,
        averageWorkHours: Math.round(averageWorkHours * 10) / 10,
        performanceScore: Math.round(performanceScore * 10) / 10
      };
    })
  );

  return performanceData
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, limit);
};

const getMonthlyStats = async year => {
  const { Op } = require('sequelize');
  const targetYear = year || new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthlyStats = await Promise.all(
    months.map(async (month, index) => {
      const firstDay = new Date(targetYear, index, 1).toISOString().slice(0, 10);
      const lastDay = new Date(targetYear, index + 1, 0).toISOString().slice(0, 10);

      const attendances = await Attendance.findAll({
        where: {
          date: {
            [Op.gte]: firstDay,
            [Op.lte]: lastDay
          }
        }
      });

      const totalRecords = attendances.length;
      const presentDays = attendances.filter(a => a.status === 'present').length;
      const absentDays = attendances.filter(a => a.status === 'absent').length;
      const lateDays = attendances.filter(a => a.status === 'late').length;

      let totalWorkHours = 0;
      let workDaysWithHours = 0;
      attendances.forEach(a => {
        if (a.checkIn && a.checkOut) {
          const hours = (new Date(a.checkOut) - new Date(a.checkIn)) / (1000 * 60 * 60);
          if (hours > 0) {
            totalWorkHours += hours;
            workDaysWithHours++;
          }
        }
      });

      const averageAttendanceRate = totalRecords > 0
        ? ((presentDays + lateDays) / totalRecords) * 100
        : 0;
      const averageWorkHours = workDaysWithHours > 0
        ? totalWorkHours / workDaysWithHours
        : 0;

      return {
        month,
        averageAttendanceRate: Math.round(averageAttendanceRate * 10) / 10,
        totalPresentDays: presentDays,
        totalAbsentDays: absentDays,
        totalOnLeaveDays: 0,
        averageWorkHours: Math.round(averageWorkHours * 10) / 10
      };
    })
  );

  return monthlyStats;
};

module.exports = {
  markUserAttendance,
  getAttendanceByUserId,
  updateAttendanceRecord,
  getTodayAttendance,
  getPerformanceSummary,
  getMonthlyStats
};
