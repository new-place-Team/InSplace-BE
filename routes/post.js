const express = require('express');
const router = express.Router({ mergeParams: true });
const review = require('./review');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.use('/:postId/reviews', review);

module.exports = router;
