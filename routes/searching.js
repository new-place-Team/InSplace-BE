const express = require('express');
const router = express.Router({ mergeParams: true });
const { searchingMain } = require('../controllers/searching');

/* GET users listing. */
router.get('/main', searchingMain);

module.exports = router;
