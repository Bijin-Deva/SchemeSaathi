const schemeStore = require('../services/schemeStore');

function listSchemes(req, res) {
  const { q, category, state, gender, caste } = req.query;
  let schemes;
  if (q) {
    schemes = schemeStore.searchSchemes(q);
  } else {
    schemes = schemeStore.filterSchemes({ category, state, gender, caste });
  }
  res.json(schemes);
}

function getScheme(req, res) {
  const scheme = schemeStore.getSchemeById(Number(req.params.id));
  if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
  res.json(scheme);
}

module.exports = { listSchemes, getScheme };
