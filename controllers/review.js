const logger = require('../config/logger');
const { pool } = require('../models/index');
const {
  updateReviewDeleteYn,
  addReviewLikes,
  updateReviewsLikeCnt,
} = require('../query/review');
const customizedError = require('../controllers/error');
/* 리뷰 등록 함수 */

const postingReview = async (req, res) => {
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

const deleteReview = async (req, res, next) => {
  try {
    const result = await pool.query(
      updateReviewDeleteYn(req.params.postId, req.params.reviewId, req.user)
    );

    if (result[0].changedRows == 0) {
      return next(customizedError('이미 삭제된 리뷰입니다.', 400));
    }
    return res.sendStatus(200);
  } catch (err) {
    return next(customizedError(err.message, 500));
  }
};

const addReviewLike = async (req, res, next) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      connection.beginTransaction();
      await connection.query(addReviewLikes(req.params.reviewId, req.user));
      await connection.query(
        updateReviewsLikeCnt(req.params.postId, req.params.reviewId, req.user)
      );
      await connection.commit();
      connection.release();
      return res.sendStatus(201);
    } catch (err) {
      await connection.rollback();
      connection.release();
      return next(customizedError(err.message, 400));
    }
  } catch (err) {
    connection.release();
    return next(customizedError(err.message, 500));
  }
};

module.exports = {
  postingReview,
  deleteReview,
  addReviewLike,
};
