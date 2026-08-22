const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  getSavedSchemes,
  saveScheme,
} = require('../controllers/profileController');

router.use(authMiddleware);

router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/saved-schemes', getSavedSchemes);
router.post('/saved-schemes', saveScheme);

module.exports = router;
