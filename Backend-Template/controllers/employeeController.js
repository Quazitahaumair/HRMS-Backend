const {
  getAllEmployees,
  getEmployeeById: getEmployeeByIdService,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  findDuplicates,
  removeDuplicates
} = require('../services/employeeService');

const getEmployees = async (_req, res, next) => {
  try {
    const employees = await getAllEmployees();
    return res.status(200).json(employees);
  } catch (error) {
    return next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await getEmployeeByIdService(req.params.id);
    return res.status(200).json(employee);
  } catch (error) {
    return next(error);
  }
};

const createEmployeeRecord = async (req, res, next) => {
  try {
    const employee = await createEmployee(req.body);
    return res.status(201).json(employee);
  } catch (error) {
    return next(error);
  }
};

const updateEmployeeRecord = async (req, res, next) => {
  try {
    const employee = await updateEmployee(req.params.id, req.body);
    return res.status(200).json(employee);
  } catch (error) {
    return next(error);
  }
};

const deleteEmployeeRecord = async (req, res, next) => {
  try {
    const result = await deleteEmployee(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const findDuplicateEmployees = async (req, res, next) => {
  try {
    const duplicates = await findDuplicates();
    return res.status(200).json({
      totalDuplicates: duplicates.length,
      duplicates
    });
  } catch (error) {
    return next(error);
  }
};

const cleanupDuplicates = async (req, res, next) => {
  try {
    const result = await removeDuplicates();
    return res.status(200).json({
      message: `Removed ${result.count} duplicate employees`,
      removed: result.removed
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getEmployees, getEmployeeById, createEmployeeRecord, updateEmployeeRecord, deleteEmployeeRecord, findDuplicateEmployees, cleanupDuplicates };
