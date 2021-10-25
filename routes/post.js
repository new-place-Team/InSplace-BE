const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewRouter = require('./review');
const likeRouter = require('./like');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.use('/:postId/reviews', reviewRouter);
router.use('/:postId/likes', likeRouter);

module.exports = router;
