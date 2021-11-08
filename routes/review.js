const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  registReview,
  modifyReview,
  deleteReview,
  getReviewByLatest,
  getReviewByLike,
  getWritingPageOfReview,
  getEditingPageOfReview,
} = require('../controllers/review');
const reviewImgUpload = require('../controllers/reviewImgUpload');
const { isAuth, justCheckAuth } = require('../middlewares/auth');
const reviewLikeRouter = require('./reviewLike');

router.use('/:reviewId/likes', reviewLikeRouter);

/* 리뷰 작성 페이지 조회 */
router.get('/write', isAuth, getWritingPageOfReview);

/* 리뷰 수정 페이지 조회 */
router.get('/:reviewId/edit', isAuth, getEditingPageOfReview);

/* 리뷰 삭제 라우터 */
router.delete('/:reviewId', isAuth, deleteReview);

/* 리뷰 등록 라우터 */
router.post(
  '/',
  isAuth,
  reviewImgUpload.array('reviewImages', 3),
  registReview
);

/* 리뷰 수정 라우터 */

router.put(
  '/:reviewId',
  isAuth,
  reviewImgUpload.array('reviewImages', 3),
  modifyReview
);

/* 리뷰 리스트 (최신순) 라우터 */
router.get('/pages/:num/orders/latest', justCheckAuth, getReviewByLatest);
/* 리뷰 리스트 (추천순) 라우터 */
router.get('/pages/:num/orders/likes', justCheckAuth, getReviewByLike);

module.exports = router;
