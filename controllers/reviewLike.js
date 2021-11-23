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
const logger = require('../config/logger');
require('dotenv').config();

/* 리뷰 좋아요 추가  */
const addReviewLike = async (req, res, next) => {
  let errMsg = '';
  const lang = req.headers['language'];
  const userId = req.user;
  const reviewId = req.params.reviewId;
  try {
    /* 유효성 검사: Success */
    await schemasOfReviewLike.validateAsync({ userId, reviewId });
  } catch (err) {
    /* 유효성 검사: Fail */
    errMsg =
      lang === 'ko' || lang === undefined
        ? '잘못된 형식입니다.'
        : 'Invalid format.';
    logger.info(`${errMsg} : ${err}`);
    return next(customizedError(errMsg, 400));
  }

  const connection = await pool.getConnection(async (conn) => conn);
  /* 존재 유무 검사 */
  try {
    const [result] = await connection.query(
      queryOfGettingReviewLikes(userId, reviewId)
    );
    if (result.length >= 1) {
      await connection.release();
      errMsg =
        lang === 'ko' || lang === undefined
          ? '이미 좋아요가 눌린 게시글 입니다.'
          : 'This post has already been pressed on like';
      return next(customizedError(errMsg, 400));
    }
  } catch (err) {
    /* 존재 유무 검사 중 예측하지 못한 에러 발생 */
    await connection.release();
    errMsg =
      'func: addReviewLike에서 존재 유무 검사 중 Internal server Error 발생';
    logger.error(`${errMsg}: ${err}`);
    return next(customizedError(errMsg, 500));
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
    errMsg =
      'func: addReviewLike에서 리뷰 좋아요 추가 중 Internal server Error 발생';
    logger.error(`${errMsg}: ${err}`);
    return next(customizedError(errMsg, 500));
  } finally {
    await connection.release(); // 연결 끊기
  }
};
/* 리뷰 좋아요 취소 */
const deleteReviewLike = async (req, res, next) => {
  let errMsg = '';
  const lang = req.headers['language'];
  const reviewId = req.params.reviewId;
  const userId = req.user;

  try {
    /* 유효성 검사: Success */
    await schemasOfReviewLike.validateAsync({ userId, reviewId });
  } catch (err) {
    /* 유효성 검사: Fail */
    errMsg =
      lang === 'ko' || lang === undefined
        ? '잘못된 형식입니다.'
        : 'Invalid format.';
    logger.error(`${errMsg} : ${err}`);
    return next(customizedError(errMsg, 400));
  }

  const connection = await pool.getConnection(async (conn) => conn);

  /* 존재 유무 검사 */
  try {
    let [result] = await connection.query(
      queryOfGettingReviewLikes(userId, reviewId)
    );
    if (result.length === 0) {
      await connection.release();
      errMsg =
        lang === 'ko' || lang == undefined
          ? '도움이 돼요 버튼을 눌렀던 이력이 존재하지 않습니다.'
          : 'There is no history of pressing the like button.';
      logger.info(errMsg);
      return next(customizedError(errMsg, 400));
    }
  } catch (err) {
    /* 존재 유무 검사 중 예측하지 못한 에러 발생 */
    await connection.release();
    errMsg =
      'func: deleteReviewLike에서 존재 유무 검사 중 Internal server Error 발생';
    logger.error(`${errMsg}: ${err}`);
    return next(customizedError(errMsg, 500));
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
    errMsg =
      'func: deleteReviewLike에서 좋아요 목록 삭제 중 Internal server Error 발생';
    logger.error(`${errMsg}: ${err}`);
    return next(customizedError(errMsg, 500));
  } finally {
    await connection.release();
  }
};

module.exports = {
  addReviewLike,
  deleteReviewLike,
};
