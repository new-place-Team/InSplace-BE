const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  addReviewLike,
  deleteReviewLike,
} = require('../controllers/reviewLike');
const { isAuth } = require('../middlewares/auth');

/* 리뷰 좋아요 추가 라우터 */
router.post('/', isAuth, addReviewLike);

/* 리뷰 좋아요 취소 라우터  */
router.delete('/', isAuth, deleteReviewLike);

module.exports = router;
