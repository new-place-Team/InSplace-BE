const express = require('express');
const router = express.Router({ mergeParams: true });
const { postingReview, deleteReview } = require('../controllers/review');
const upload = require('../controllers/imgUpload');
const logger = require('../config/logger');
const { isAuth } = require('../middlewares/auth');
/* GET users listing. */
router.post('/', upload.array('img', 3), postingReview);
router.delete('/:reviewId', isAuth, deleteReview);

module.exports = router;
