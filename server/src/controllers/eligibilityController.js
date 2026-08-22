const schemeStore = require('../services/schemeStore');
const eligibilityMatcher = require('../services/eligibilityMatcher');

function checkEligibility(req, res) {
  const { age, gender, state, income, caste } = req.body;
  const allSchemes = schemeStore.getAllSchemes();
  const results = eligibilityMatcher.matchSchemes({ age, gender, state, income, caste }, allSchemes);
  res.json(results);
}

module.exports = { checkEligibility };
