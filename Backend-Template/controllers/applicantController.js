const {
  getAllApplicants,
  getApplicantById,
  createApplicant,
  updateApplicantStatus,
  scheduleInterview,
  addNotes,
  getApplicantStats
} = require('../services/applicantService');

const getApplicants = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      role: req.query.role,
      search: req.query.search
    };
    const applicants = await getAllApplicants(filters);
    return res.status(200).json(applicants);
  } catch (error) {
    return next(error);
  }
};

const getApplicant = async (req, res, next) => {
  try {
    const applicant = await getApplicantById(req.params.id);
    return res.status(200).json(applicant);
  } catch (error) {
    return next(error);
  }
};

const createNewApplicant = async (req, res, next) => {
  try {
    const applicant = await createApplicant(req.body);
    return res.status(201).json(applicant);
  } catch (error) {
    return next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const applicant = await updateApplicantStatus(req.params.id, status);
    return res.status(200).json(applicant);
  } catch (error) {
    return next(error);
  }
};

const scheduleApplicantInterview = async (req, res, next) => {
  try {
    const { interviewDate, interviewer } = req.body;
    const applicant = await scheduleInterview(req.params.id, { interviewDate, interviewer });
    return res.status(200).json(applicant);
  } catch (error) {
    return next(error);
  }
};

const addApplicantNotes = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const applicant = await addNotes(req.params.id, notes);
    return res.status(200).json(applicant);
  } catch (error) {
    return next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await getApplicantStats();
    return res.status(200).json(stats);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getApplicants,
  getApplicant,
  createNewApplicant,
  updateStatus,
  scheduleApplicantInterview,
  addApplicantNotes,
  getStats
};
