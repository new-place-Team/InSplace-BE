const { pool } = require('../models/index');
const { customizedError } = require('./error');
const {
  queryOfAddingPostLikes,
  queryOfIncreasingLikeCnt,
  queryOfDeletingPostLikes,
  queryOfDecreasingLikeCnt,
  queryOfGettingLikeData,
} = require('../query/like');
const schemas = require('../middlewares/validation');

/* 좋아요 추가 함수 */
const addLike = async (req, res, next) => {
  const userId = req.user;
  const postId = req.params.postId;

  /* 유효성 검사 */
  try {
    await schemas.validateAsync({ userId, postId });
  } catch (err) {
    return next(customizedError(err, 400));
  }

  const connection = await pool.getConnection(async (conn) => conn);
  /* 존재 유무 검사 */
  try {
    const params = [userId, postId];
    const result = await connection.query(queryOfGettingLikeData, params);
    if (result[0].length >= 1) {
      return next(customizedError('좋아요가 이미 눌린 Post 입니다.', 400));
    }
  } catch (err) {
    return next(customizedError(err, 400));
  }
  try {
    // transaction 시작
    await connection.beginTransaction();
    await connection.query(queryOfAddingPostLikes, [userId, postId]);
    await connection.query(queryOfIncreasingLikeCnt, [postId]);
    await connection.commit(); // 적용
    return res.sendStatus(201);
  } catch (err) {
    await connection.rollback(); // 에러가 발생할 경우 원래 상태로 돌리기
    return next(customizedError(err, 400));
  } finally {
    await connection.release(); // 연결 끊기
  }
};

/* 좋아요 취소 함수 */
const cancelLike = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user;

  /* 유효성 검사 */
  try {
    await schemas.validateAsync({ userId, postId });
  } catch (err) {
    return next(customizedError(err, 400));
  }

  const connection = await pool.getConnection(async (conn) => conn);
  /* 존재 유무 검사 */
  try {
    const params = [userId, postId];
    const result = await connection.query(queryOfGettingLikeData, params);
    if (result[0].length === 0) {
      return next(customizedError('Like Table에 존재하지 않습니다.', 400));
    }
  } catch (err) {
    return next(customizedError(err, 400));
  }
  try {
    await connection.beginTransaction(); // transaction 시작
    await connection.query(queryOfDeletingPostLikes, [userId, postId]);
    await connection.query(queryOfDecreasingLikeCnt, [postId]);
    await connection.commit(); // 적용
    return res.sendStatus(200);
  } catch (err) {
    await connection.rollback(); // 에러가 발생할 경우 원래 상태로 돌리기
    return next(customizedError(err, 400));
  } finally {
    await connection.release(); // 연결 끊기
  }
};

module.exports = {
  addLike,
  cancelLike,
};
