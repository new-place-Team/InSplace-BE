const logger = require('../config/logger');
const { pool } = require('../models/index');
const { customizedError } = require('./error');
const {
  queryOfAddingPostLikes,
  queryOfIncreasingLikeCnt,
  queryOfDeletingPostLikes,
  queryOfDecreasingLikeCnt,
} = require('../query/like');

/* 좋아요 추가 함수 */
const addLike = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user;
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    // transaction 시작
    await connection.beginTransaction();
    await connection.query(queryOfAddingPostLikes, [userId, postId]);
    await connection.query(queryOfIncreasingLikeCnt, [postId]);
    await connection.commit(); // 적용
    return res.sendStatus(201);
  } catch (err) {
    await connection.rollback(); // 에러가 발생할 경우 원래 상태로 돌리기
  } finally {
    await connection.release(); // 연결 끊기
  }
};

/* 좋아요 취소 함수 */
const cancelLike = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user;

  const connection = await pool.getConnection(async (conn) => conn);
  try {
    // transaction 시작
    await connection.beginTransaction();
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
