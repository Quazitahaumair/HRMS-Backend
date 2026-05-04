const { getSalaryByUserId, getPayrollSlips, updateSalaryByUserId, generatePayroll } = require('../services/payrollService');

const getSalary = async (req, res, next) => {
  try {
    const payroll = await getSalaryByUserId(req.params.userId);
    return res.status(200).json(payroll);
  } catch (error) {
    return next(error);
  }
};

const getSlips = async (_req, res, next) => {
  try {
    const slips = await getPayrollSlips();
    return res.status(200).json(slips);
  } catch (error) {
    return next(error);
  }
};

const updateSalary = async (req, res, next) => {
  try {
    const payroll = await updateSalaryByUserId(req.params.userId, req.body);
    return res.status(200).json(payroll);
  } catch (error) {
    return next(error);
  }
};

const generate = async (req, res, next) => {
  try {
    const payroll = await generatePayroll(req.body);
    return res.status(200).json(payroll);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getSalary, getSlips, updateSalary, generate };
