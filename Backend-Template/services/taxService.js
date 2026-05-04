const getTaxStructure = async () => ({
  regime: 'default',
  country: 'India',
  currency: 'INR',
  assessmentYear: '2026-27',
  standardDeduction: 50000,
  cessRate: 0.04,
  slabs: [
    { min: 0, max: 400000, rate: 0 },
    { min: 400001, max: 800000, rate: 0.05 },
    { min: 800001, max: 1200000, rate: 0.1 },
    { min: 1200001, max: 1600000, rate: 0.15 },
    { min: 1600001, max: 2000000, rate: 0.2 },
    { min: 2000001, max: 2400000, rate: 0.25 },
    { min: 2400001, max: null, rate: 0.3 }
  ],
  rebate: {
    section: '87A',
    maxTaxableIncome: 1200000,
    maxRebate: 60000
  }
});

module.exports = { getTaxStructure };
