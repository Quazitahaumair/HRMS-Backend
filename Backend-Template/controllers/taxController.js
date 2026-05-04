const { getTaxStructure } = require('../services/taxService');

const getStructure = async (_req, res, next) => {
  try {
    const structure = await getTaxStructure();
    return res.status(200).json(structure);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getStructure };
