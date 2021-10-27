const express = require('express');
const router = express.Router({ mergeParams: true });
const { postingReview } = require('../controllers/review');
const upload = require('../controllers/imgUpload');
const logger = require('../config/logger');

/* GET users listing. */
router.post('/', upload.array('img', 3), postingReview);

module.exports = router;
