const { Applicant } = require('../models');
const { Op } = require('sequelize');

const getAllApplicants = async (filters = {}) => {
  const where = {};
  
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.role) {
    where.role = { [Op.like]: `%${filters.role}%` };
  }
  if (filters.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${filters.search}%` } },
      { email: { [Op.like]: `%${filters.search}%` } }
    ];
  }

  return Applicant.findAll({
    where,
    order: [['appliedDate', 'DESC']]
  });
};

const getApplicantById = async id => {
  const applicant = await Applicant.findByPk(id);
  if (!applicant) {
    const error = new Error('Applicant not found');
    error.statusCode = 404;
    throw error;
  }
  return applicant;
};

const createApplicant = async payload => {
  return Applicant.create({
    name: payload.name,
    email: payload.email.toLowerCase().trim(),
    phone: payload.phone,
    role: payload.role,
    experience: payload.experience,
    skills: payload.skills || [],
    education: payload.education,
    resumeUrl: payload.resumeUrl,
    status: payload.status || 'applied',
    appliedDate: payload.appliedDate || new Date(),
    interviewDate: payload.interviewDate,
    interviewer: payload.interviewer,
    notes: payload.notes
  });
};

const updateApplicantStatus = async (id, status) => {
  const applicant = await Applicant.findByPk(id);
  if (!applicant) {
    const error = new Error('Applicant not found');
    error.statusCode = 404;
    throw error;
  }
  
  applicant.status = status;
  await applicant.save();
  return applicant;
};

const scheduleInterview = async (id, { interviewDate, interviewer }) => {
  const applicant = await Applicant.findByPk(id);
  if (!applicant) {
    const error = new Error('Applicant not found');
    error.statusCode = 404;
    throw error;
  }
  
  applicant.interviewDate = interviewDate;
  applicant.interviewer = interviewer;
  applicant.status = 'interview';
  await applicant.save();
  return applicant;
};

const addNotes = async (id, notes) => {
  const applicant = await Applicant.findByPk(id);
  if (!applicant) {
    const error = new Error('Applicant not found');
    error.statusCode = 404;
    throw error;
  }
  
  applicant.notes = notes;
  await applicant.save();
  return applicant;
};

const getApplicantStats = async () => {
  const total = await Applicant.count();
  const byStatus = await Applicant.findAll({
    attributes: ['status', [Applicant.sequelize.fn('COUNT', '*'), 'count']],
    group: ['status'],
    raw: true
  });
  
  return {
    total,
    byStatus: byStatus.reduce((acc, item) => {
      acc[item.status] = item.count;
      return acc;
    }, {})
  };
};

module.exports = {
  getAllApplicants,
  getApplicantById,
  createApplicant,
  updateApplicantStatus,
  scheduleInterview,
  addNotes,
  getApplicantStats
};
