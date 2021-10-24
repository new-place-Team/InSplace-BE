const express = require('express');
const router = express.Router({ mergeParams: true });
const logger = require('../config/logger');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
