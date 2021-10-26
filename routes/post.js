const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewRouter = require('./review');
const likeRouter = require('./like');
const { addVisitedList } = require('../controllers/post');

router.use('/:postId/reviews', reviewRouter);
router.use('/:postId/likes', likeRouter);
router.use('/:postId', likeRouter);
router.use('/:postId/visited', likeRouter);

/* 가본 장소 리스트에 추가 */
router.post('/:postId/visited', addVisitedList);

module.exports = router;
