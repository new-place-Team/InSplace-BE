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
const logger = require('../config/logger');

/* 포스트 찜하기 추가 */
const addFavorite = async (req, res, next) => {
  let errMsg = '';
  const lang = req.headers['language'];
  const userId = req.user;
  const postId = req.params.postId;

  try {
    /* 유효성 검사: Success */
    await schemas.validateAsync({ userId, postId });
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
    const params = [userId, postId];
    const [result] = await connection.query(queryOfGettingFavoriteData, params);
    console.log('result:', result);
    if (result.length >= 1) {
      await connection.release();
      errMsg =
        lang === 'ko' || lang === undefined
          ? '찜목록에 이미 추가되어 있는 게시글입니다.'
          : 'This post has already been added to the favorite list.';
      logger.info(errMsg);
      return next(customizedError(errMsg, 400));
    }
  } catch (err) {
    /* 존재 유무 검사 중 예측하지 못한 에러 발생 */
    await connection.release();
    errMsg =
      'func: addFavorite에서 존재 유무 검사 중 Internal server Error 발생';
    logger.error(`${errMsg}: ${err}`);
    return next(customizedError(errMsg, 500));
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
    errMsg = 'func: addFavorite에서 찜목록 추가 중 Internal server Error 발생';
    logger.error(`${errMsg}: ${err}`);
    return next(customizedError(errMsg, 500));
  } finally {
    await connection.release(); // 연결 끊기
  }
};

/* 포스트 찜하기 삭제*/
const deleteFavorite = async (req, res, next) => {
  let errMsg = '';
  const lang = req.headers['language'];
  const postId = req.params.postId;
  const userId = req.user;

  try {
    /* 유효성 검사: Success */
    await schemas.validateAsync({ userId, postId });
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
    const params = [userId, postId];
    const [result] = await connection.query(queryOfGettingFavoriteData, params);
    if (result.length === 0) {
      await connection.release();
      errMsg =
        lang === 'ko' || lang === undefined
          ? '찜목록에 존재하지 않는 게시글입니다.'
          : 'This post does not exist in the favorite list.';
      logger.info(errMsg);
      return next(customizedError(errMsg, 400));
    }
  } catch (err) {
    /* 존재 유무 검사 중 예측하지 못한 에러 발생 */
    await connection.release();
    errMsg =
      'func: deleteFavorite에서 존재 유무 검사 중 Internal server Error 발생';
    logger.error(`${errMsg}: ${err}`);
    return next(customizedError(errMsg, 500));
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
    errMsg =
      'func: deleteFavorite에서 찜목록 삭제 중 Internal server Error 발생';
    logger.error(`${errMsg}: ${err}`);
    return next(customizedError(errMsg, 500));
  } finally {
    await connection.release();
  }
};

module.exports = {
  addFavorite,
  deleteFavorite,
};
