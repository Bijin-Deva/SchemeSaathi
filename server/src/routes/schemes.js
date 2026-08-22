const router = require('express').Router();
const { listSchemes, getScheme } = require('../controllers/schemesController');

router.get('/', listSchemes);
router.get('/:id', getScheme);

module.exports = router;
