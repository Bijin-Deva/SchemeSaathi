const XLSX = require('xlsx');
const path = require('path');

const SCHEMES_FILE = path.join(__dirname, '../../data/schemes.xlsx');

let schemesCache = null;

function loadSchemes() {
  if (schemesCache) return schemesCache;
  const workbook = XLSX.readFile(SCHEMES_FILE);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(sheet);
  schemesCache = raw.map((row) => ({
    id: parseInt(row.id, 10),
    name: String(row.name || '').trim(),
    description: String(row.description || '').trim(),
    category: String(row.category || '').trim(),
    state: String(row.state || '').trim(),
    eligibility_age_min: parseInt(row.eligibility_age_min, 10) || 0,
    eligibility_age_max: parseInt(row.eligibility_age_max, 10) || 999,
    eligibility_income_max: parseFloat(row.eligibility_income_max) || 99999999,
    eligibility_gender: String(row.eligibility_gender || 'Any').trim(),
    eligibility_caste: String(row.eligibility_caste || 'Any').trim(),
    apply_url: String(row.apply_url || '').trim(),
    documents_required: String(row.documents_required || '').trim(),
    benefits: String(row.benefits || '').trim(),
    language: String(row.language || 'English').trim(),
  }));
  return schemesCache;
}

function getAllSchemes() {
  return loadSchemes();
}

function filterSchemes({ category, state, gender, caste } = {}) {
  return loadSchemes().filter((s) => {
    if (category && s.category.toLowerCase() !== category.toLowerCase()) return false;
    if (state && s.state.toLowerCase() !== state.toLowerCase() && s.state.toLowerCase() !== 'national') return false;
    if (gender && s.eligibility_gender.toLowerCase() !== 'any' && s.eligibility_gender.toLowerCase() !== gender.toLowerCase()) return false;
    if (caste && s.eligibility_caste.toLowerCase() !== 'any' && s.eligibility_caste.toLowerCase() !== caste.toLowerCase()) return false;
    return true;
  });
}

function searchSchemes(query) {
  const q = query.toLowerCase();
  return loadSchemes().filter(
    (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
  );
}

function getSchemeById(id) {
  return loadSchemes().find((s) => s.id === id) || null;
}

module.exports = { getAllSchemes, filterSchemes, searchSchemes, getSchemeById };
