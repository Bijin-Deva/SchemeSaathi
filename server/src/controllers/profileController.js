const userStore = require('../services/userStore');
const schemeStore = require('../services/schemeStore');

function getProfile(req, res) {
  const user = userStore.getUserById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { passwordHash, ...safe } = user;
  res.json(safe);
}

function updateProfile(req, res) {
  const allowed = ['name', 'age', 'gender', 'state', 'income', 'occupation', 'caste_category'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  const updated = userStore.updateUser(req.userId, updates);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  const { passwordHash, ...safe } = updated;
  res.json(safe);
}

function getSavedSchemes(req, res) {
  const user = userStore.getUserById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const saved = (user.savedSchemes || []).map((id) => schemeStore.getSchemeById(id)).filter(Boolean);
  res.json(saved);
}

function saveScheme(req, res) {
  const { schemeId } = req.body;
  if (!schemeId) return res.status(400).json({ error: 'schemeId is required' });
  const user = userStore.getUserById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const savedSchemes = user.savedSchemes || [];
  if (!savedSchemes.includes(schemeId)) {
    userStore.updateUser(req.userId, { savedSchemes: [...savedSchemes, schemeId] });
  }
  res.json({ success: true });
}

module.exports = { getProfile, updateProfile, getSavedSchemes, saveScheme };
