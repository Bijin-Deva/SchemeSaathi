const router = require('express').Router();
const { checkEligibility } = require('../controllers/eligibilityController');

router.post('/check', checkEligibility);

module.exports = router;
