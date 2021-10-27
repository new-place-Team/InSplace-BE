const express = require('express');
const router = express.Router();
const { searchingMain } = require('../controllers/searching');

/* GET users listing. */
router.get('/main', searchingMain);

module.exports = router;
