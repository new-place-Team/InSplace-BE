const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewRouter = require('./review');
const showDetailRouter = require('./detail');

const { justCheckAuth } = require('../middlewares/auth');

router.use('/:postId/reviews', reviewRouter);
router.use('/:postId', justCheckAuth, showDetailRouter);

module.exports = router;
