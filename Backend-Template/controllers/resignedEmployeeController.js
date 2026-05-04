const {
  getAllResignedEmployees,
  getResignedEmployeeById,
  createResignedEmployee,
  updateResignedEmployee,
  generateExitLetterData,
  getResignedStats
} = require('../services/resignedEmployeeService');

const getResignedEmployees = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      resignationType: req.query.resignationType
    };
    const employees = await getAllResignedEmployees(filters);
    return res.status(200).json(employees);
  } catch (error) {
    return next(error);
  }
};

const getResignedEmployee = async (req, res, next) => {
  try {
    const employee = await getResignedEmployeeById(req.params.id);
    return res.status(200).json(employee);
  } catch (error) {
    return next(error);
  }
};

const createResigned = async (req, res, next) => {
  try {
    const { userId, ...payload } = req.body;
    const employee = await createResignedEmployee(userId, payload);
    return res.status(201).json(employee);
  } catch (error) {
    return next(error);
  }
};

const updateResigned = async (req, res, next) => {
  try {
    const employee = await updateResignedEmployee(req.params.id, req.body);
    return res.status(200).json(employee);
  } catch (error) {
    return next(error);
  }
};

const getExitLetter = async (req, res, next) => {
  try {
    const data = await generateExitLetterData(req.params.id);
    return res.status(200).json({
      message: 'Exit letter data generated',
      data
    });
  } catch (error) {
    return next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await getResignedStats();
    return res.status(200).json(stats);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getResignedEmployees,
  getResignedEmployee,
  createResigned,
  updateResigned,
  getExitLetter,
  getStats
};
