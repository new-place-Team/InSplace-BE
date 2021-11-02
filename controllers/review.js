const logger = require('../config/logger');
const { db } = require('../models/index');
const { updateReviewDeleteYn } = require('../query/review');
/* 리뷰 등록 함수 */

const postingReview = async (req, res) => {
  console.log(req.file);
  const postId = req.params.postId;
  const reviewImages = req.file.transforms[0].location;
  const { review_desc, revisit_yn } = req.body;
  const params = [postId, reviewImages, reviewImages, review_desc, revisit_yn];
  try {
    const reviewQuery = `
    INSERT INTO 
    Reviews(post_id, review_images, review_desc, revisit_yn, review_delete_yn)
    VALUES(?, ?, ?, ?, ?)
    `;
    await db.query(reviewQuery, params);
    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    logger.error('리뷰 등록에서 예상치 못한 에러가 발생했습니다:', err);
    return res.status(400).json({
      success: false,
      errMsg: `리뷰 등록에서 예상치 못한 에러가 발생했습니다: ${err}`,
    });
  }
};

const deleteReview = async (req, res) => {
  const result = await pool.query(
    updateReviewDeleteYn(req.params.postId, req.params.reviewId)
  );
  if (result[0].changedRows == 0) {
    return next(customizedError('이미 탈퇴된 회원입니다.', 400));
  }
  return res.sendStatus(200);
};

module.exports = {
  postingReview,
  deleteReview,
};
