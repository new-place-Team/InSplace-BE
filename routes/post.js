const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewRouter = require('./review');
const showDetailRouter = require('./detail');
const favoriteRouter = require('./favorite');
const addVisited = require('./visited');
const { addVisitedList } = require('../controllers/post');
const { justCheckAuth } = require('../middlewares/auth');

router.use('/:postId/reviews', reviewRouter);
router.use('/:postId', justCheckAuth, showDetailRouter);
router.use('/:postId/visited', addVisited);
router.use('/:postId/favorites', favoriteRouter);
router.use('/:postId/reviews', reviewRouter);
/* 가본 장소 리스트에 추가 */
router.post('/:postId/visited', addVisitedList);

module.exports = router;
