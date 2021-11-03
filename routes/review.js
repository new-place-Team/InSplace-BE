const express = require('express');
const router = express.Router({ mergeParams: true });

/* GET users listing. */

const {
  registReview,
  modifyReview,
  deleteReview,
  addReviewLike,
} = require('../controllers/review');
const upload = require('../controllers/imgUpload');
const { isAuth } = require('../middlewares/auth');

/* 리뷰 삭제 라우터 */
router.delete('/:reviewId', isAuth, deleteReview);

/* 리뷰 좋아요 추가 라우터 */
router.post('/:reviewId/likes', isAuth, addReviewLike);
/* 리뷰 등록 라우터 */
router.post('/', isAuth, upload.array('reviewImages', 3), registReview);

/* 리뷰 수정 라우터 */
router.put('/:reviewId', modifyReview);
module.exports = router;
