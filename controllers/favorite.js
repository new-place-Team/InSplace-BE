const { pool } = require('../models/index');
const {
  queryOfAddingFavorite,
  queryOfDeletingFavorite,
  queryOfGettingFavoriteData,
  queryOfIncreasingFavoriteCnt,
  queryOfDecreasingFavoriteCnt,
} = require('../query/favorite');
const customizedError = require('./error');
const schemas = require('../middlewares/validation');

/* 포스트 찜하기 추가 */
const addFavorite = async (req, res, next) => {
  const userId = req.user;
  const postId = req.params.postId;

  try {
    /* 유효성 검사: Success */
    await schemas.validateAsync({ userId, postId });
  } catch (err) {
    /* 유효성 검사: Fail */
    return next(customizedError(err, 400));
  }

  const connection = await pool.getConnection(async (conn) => conn);
  /* 존재 유무 검사 */
  try {
    const params = [userId, postId];
    const result = await connection.query(queryOfGettingFavoriteData, params);
    if (result[0].length >= 1) {
      await connection.release();
      console.log('if 문 안에 release()');
      return next(customizedError('찜목록에 이미 존재합니다.', 400));
    }
  } catch (err) {
    /* 존재 유무 검사 중 예측하지 못한 에러 발생 */
    await connection.release();
    console.log('first catch release()');
    return next(customizedError(err, 500));
  }
  try {
    // transaction 시작
    await connection.beginTransaction();
    await connection.query(queryOfAddingFavorite, [userId, postId]);
    await connection.query(queryOfIncreasingFavoriteCnt, [postId]);
    await connection.commit(); // 적용
    /* 찜목록 추가: Success */
    return res.sendStatus(201);
  } catch (err) {
    /* 찜목록 추가: Fail -> 예측하지 못한 에러 */
    await connection.rollback(); // 에러가 발생할 경우 원래 상태로 돌리기
    return next(customizedError(err, 500));
  } finally {
    console.log('second catch release()');
    await connection.release(); // 연결 끊기
  }
};
/* 포스트 찜하기 삭제*/
const deleteFavorite = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user;

  try {
    /* 유효성 검사: Success */
    await schemas.validateAsync({ userId, postId });
  } catch (err) {
    /* 유효성 검사: Fail */
    return next(customizedError(err, 400));
  }

  const connection = await pool.getConnection(async (conn) => conn);

  /* 존재 유무 검사 */
  try {
    const params = [userId, postId];
    const result = await connection.query(queryOfGettingFavoriteData, params);
    if (result[0].length === 0) {
      console.log('if 문 안에 release()');
      await connection.release();
      return next(customizedError('찜목록에 존재하지 않습니다.', 400));
    }
  } catch (err) {
    /* 존재 유무 검사 중 예측하지 못한 에러 발생 */
    await connection.release();
    console.log('first catach release()');
    return next(customizedError(err, 500));
  }

  try {
    await connection.beginTransaction(); // transaction 시작
    await connection.query(queryOfDeletingFavorite, [userId, postId]);
    await connection.query(queryOfDecreasingFavoriteCnt, [postId]);
    await connection.commit(); // 적용
    /* 찜목록 삭제: Success */
    return res.sendStatus(200);
  } catch (err) {
    /* 찜목록 삭제: Fail -> 예측하지 못한 에러 */
    await connection.rollback();
    return next(customizedError(err, 400));
  } finally {
    console.log('second finally release()');
    await connection.release();
  }
};

module.exports = {
  addFavorite,
  deleteFavorite,
};
