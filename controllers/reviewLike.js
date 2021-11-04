const { pool } = require('../models/index');

const {
  addReviewLikes,
  updateReviewLikeCnt,
  queryOfGettingReviewLikes,
  queryOfDecreasingReviewLikeCnt,
  queryOfDeletingReviewLikes,
} = require('../query/reviewLike');
const customizedError = require('../controllers/error');
const { schemasOfReviewLike } = require('../middlewares/validationReview');
require('dotenv').config();

/* 리뷰 좋아요 추가  */
const addReviewLike = async (req, res, next) => {
  const userId = req.user;
  const reviewId = req.params.reviewId;

  try {
    /* 유효성 검사: Success */
    await schemasOfReviewLike.validateAsync({ userId, reviewId });
  } catch (err) {
    /* 유효성 검사: Fail */
    return next(customizedError(err, 400));
  }

  const connection = await pool.getConnection(async (conn) => conn);
  /* 존재 유무 검사 */
  try {
    const params = [userId, reviewId];
    const result = await connection.query(queryOfGettingReviewLikes, params);
    if (result[0].length >= 1) {
      return next(customizedError('좋아요를 이미 눌렀습니다.', 400));
    }
  } catch (err) {
    /* 존재 유무 검사 중 예측하지 못한 에러 발생 */
    return next(customizedError(err, 500));
  }
  try {
    // transaction 시작
    await connection.beginTransaction();
    await connection.query(addReviewLikes(reviewId, userId));
    await connection.query(updateReviewLikeCnt(reviewId));
    await connection.commit(); // 적용
    /* 좋아요 추가: Success */
    return res.sendStatus(201);
  } catch (err) {
    /* 좋아요 추가: Fail -> 예측하지 못한 에러 */
    await connection.rollback(); // 에러가 발생할 경우 원래 상태로 돌리기
    return next(customizedError(err, 500));
  } finally {
    await connection.release(); // 연결 끊기
  }
};
/* 리뷰 좋아요 취소 */
const deleteReviewLike = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const userId = req.user;

  try {
    /* 유효성 검사: Success */
    await schemasOfReviewLike.validateAsync({ userId, reviewId });
  } catch (err) {
    /* 유효성 검사: Fail */
    return next(customizedError(err, 400));
  }

  const connection = await pool.getConnection(async (conn) => conn);

  /* 존재 유무 검사 */
  try {
    const params = [userId, reviewId];
    let result = await connection.query(queryOfGettingReviewLikes, params);
    if (result[0].length === 0) {
      return next(
        customizedError(
          '도움이 돼요 버튼을 눌렀던 이력이 존재하지 않습니다.',
          400
        )
      );
    }
  } catch (err) {
    /* 존재 유무 검사 중 예측하지 못한 에러 발생 */
    return next(customizedError(err, 500));
  }
  try {
    await connection.beginTransaction(); // transaction 시작
    await connection.query(queryOfDeletingReviewLikes, [userId, reviewId]);
    await connection.query(queryOfDecreasingReviewLikeCnt, [reviewId]);
    await connection.commit(); // 적용

    /* 리뷰 좋아요 취소 : Success */
    return res.sendStatus(200);
  } catch (err) {
    /* 리뷰 좋아요 취소: Fail -> 예측하지 못한 에러 */
    await connection.rollback();
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

module.exports = {
  addReviewLike,
  deleteReviewLike,
};
