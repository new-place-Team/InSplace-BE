const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  registReview,
  modifyReview,
  deleteReview,
} = require('../controllers/review');
const upload = require('../controllers/imgUpload');
const { isAuth } = require('../middlewares/auth');
const reviewLikeRouter = require('./reviewLike');

router.use('/:reviewId/likes', reviewLikeRouter);

/* 리뷰 삭제 라우터 */
router.delete('/:reviewId', isAuth, deleteReview);

/* 리뷰 등록 라우터 */
router.post('/', isAuth, upload.array('reviewImages', 3), registReview);

/* 리뷰 수정 라우터 */
router.put('/:reviewId', isAuth, upload.array('reviewImages', 3), modifyReview);

module.exports = router;
