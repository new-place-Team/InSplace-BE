const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewRouter = require('./review');
const showDetailRouter = require('./detail');
const favoriteRouter = require('./favorite');
const visitedRouter = require('./visited');
const { justCheckAuth } = require('../middlewares/auth');

/* 찜하기 API로 이동 (추가삭제기능) */
router.use('/:postId/favorites', favoriteRouter);

/* visited Post API로 이동 (추가삭제기능) */
router.use('/:postId/visitedPosts', visitedRouter);

/* review router로 이동 */
router.use('/:postId/reviews', reviewRouter);

/* detail router로 이동 */
router.use('/:postId', justCheckAuth, showDetailRouter);

module.exports = router;
