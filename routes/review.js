const express = require('express');
const router = express.Router({ mergeParams: true });
const { registReview, modifyReview } = require('../controllers/review');
const upload = require('../controllers/imgUpload');
const { isAuth } = require('../middlewares/auth');

/* 리뷰 등록 라우터 */
router.post('/', isAuth, upload.array('reviewImages', 3), registReview);

/* 리뷰 수정 라우터 */
//router.patch('/:reviewId', isAuth, modifyReview);
router.put('/:reviewId', modifyReview);
module.exports = router;
