const schemas = require('../middlewares/validation');
const {
  queryOfDeletingVisitedPost,
  queryOfGettingVisitedData,
} = require('../query/visited');

const { checkVisitedUser, addVisited } = require('../query/post');
const customizedError = require('./error');
const { pool } = require('../models/index');
const logger = require('../config/logger');

/* 가본 장소 리스트에 추가 */
const addVisitedPosts = async (req, res, next) => {
  const lang = req.headers['language'];
  let errMsg;
  //유저가 가본 리스트에 추가했는지 확인
  const resultCheckVisitedUser = async (user, postID) => {
    const result = await pool.query(checkVisitedUser(user, postID));
    if (result[0].length !== 0) {
      errMsg = 
      (lang === 'ko' || lang === undefined)
      ? `이미 가본 리스트에 추가되어 있습니다`
      : `Already exist in Visited Place`
      return next(
        customizedError(errMsg, 400)
      );
    }
    return true;
  };
  try {
    //resultCheckVisitedUser가 true면 추가 안되있다는 뜻
    if (await resultCheckVisitedUser(req.user, req.params.postId)) {
      //장소 리스트에 추가해주기
      await pool.query(addVisited(req.user, req.params.postId));
      return res.sendStatus(201);
    }
  } catch (err) {
    return next(customizedError(err, 400));
  }
};

/* 가본 장소 리스트에서 삭제하는 미들웨어 */
const deleteVisitedPosts = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user;
  const lang = req.headers['language'];
  let errMsg;

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
    const result = await connection.query(queryOfGettingVisitedData, params);
    if (result[0].length === 0) {
      errMsg = 
      (lang === 'ko' || lang === undefined)
      ? `삭제할 데이터가 없습니다.`
      : `There is nothing to delete `
      return next(customizedError(errMsg, 400));
    }
  } catch (err) {
    /* 존재 유무 검사 중 예측하지 못한 에러 발생 */
    await connection.release();
    logger.error(`존재유무 검사중  예측하지 못한 에러: ${err}`);
    return next(customizedError(err, 500));
  }

  try {
    await connection.query(queryOfDeletingVisitedPost, [userId, postId]);
    /* 가본 리스트에서 삭제: Success */
    return res.sendStatus(200);
  } catch (err) {
    /* 가본 리스트에서 삭제: Fail -> 예측하지 못한 에러 */
    logger.error(`가본 리스트에서 삭제: Fail -> 예측하지 못한 에러: ${err}`);
    return next(customizedError(err, 400));
  } finally {
    await connection.release();
  }
};

module.exports = {
  addVisitedPosts,
  deleteVisitedPosts,
};
