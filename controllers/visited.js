const schemas = require('../middlewares/validation');
const {
  queryOfDeletingVisitedPost,
  queryOfGettingVisitedData,
} = require('../query/visited');

const { checkVisitedUser, addVisited } = require('../query/post');
const customizedError = require('./error');
const { pool } = require('../models/index');

/* 로그인한 유저인지 검사 */
const isMatchingUserIds = (userId, targetUserId) => {
  if (userId === targetUserId) {
    return true;
  }
  return false;
};

/* 가본 장소 리스트에 추가 */
const addVisitedPosts = async (req, res, next) => {
  //유저가 가본 리스트에 추가했는지 확인
  const resultCheckVisitedUser = async (user, postID) => {
    const result = await pool.query(checkVisitedUser(user, postID));
    if (result[0].length !== 0) {
      return next(
        customizedError('이미 가본 리스트에 추가되어 있습니다.', 400)
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

  /* 로그인 한 유저와 입력 받은 userId가 다른 경우 */
  if (!isMatchingUserIds(userId, Number(req.params.userId))) {
    return next(customizedError('잘못된 접근 입니다.', 400));
  }

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
      return next(customizedError('삭제할 데이터가 없습니다.', 400));
    }
  } catch (err) {
    /* 존재 유무 검사 중 예측하지 못한 에러 발생 */
    return next(customizedError(err, 500));
  }

  try {
    await connection.query(queryOfDeletingVisitedPost, [userId, postId]);
    /* 가본 리스트에서 삭제: Success */
    return res.sendStatus(200);
  } catch (err) {
    /* 가본 리스트에서 삭제: Fail -> 예측하지 못한 에러 */
    return next(customizedError(err, 400));
  } finally {
    await connection.release();
  }
};

module.exports = {
  addVisitedPosts,
  deleteVisitedPosts,
};
