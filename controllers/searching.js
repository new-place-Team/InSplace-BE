const logger = require('../config/logger');
const { pool } = require('../models/index');
require('dotenv').config;
const {
  queryOfResultPageOfCondition,
  queryOfDetailPageOfInOutDoors,
  queryOfResultPageOfTotal,
  queryOfGettingTotalPageNum,
  queryOfResultPageOfConditionAndCurrentLoc,
  queryOfDetailPageOfInOutDoorsAndCurrentLoc,
  queryOfGettingTotalPageNumAndCurrentLoc,
} = require('../query/searching');
const customizedError = require('./error');
const {
  schemasOfDetailPageOfInOutDoors,
  schemasOfResultPageofCondition,
  schemasOfResultPageofTotal,
} = require('../middlewares/validationSearching');

const { getMainImage } = require('./utils/image');

/*
 * 로그인한 유저가 아니면 0
 * 로그인한 유저라면 userId
 */
const checkLoginUser = (target) => {
  let userId = target;
  if (!userId) {
    userId = 0;
  }
  return userId;
};

/* 토탈 결과 페이지 조회 */
const getResultPageOfTotal = async (req, res, next) => {
  logger.info('토탈 결과 페이지 조회');
  const userId = Number(checkLoginUser(req.user));
  const pageNum = (Number(req.params.number) - 1) * 12; // Pages Number
  const result = req.query.result; // Searching Result
  const lang = req.header('language');
  /* 유효성 검사 */
  try {
    await schemasOfResultPageofTotal.validateAsync({
      userId,
      result,
      pageNum,
    });
  } catch (err) {
    return next(customizedError(err, 400));
  }

  const params = [userId, userId, result, result, pageNum];
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const data = await connection.query(queryOfResultPageOfTotal(userId, result, pageNum, lang));

    let posts = data[0];
    // 메인 이미지만 가져오기
    for (let i = 0; i < posts.length; i++) {
      posts[i].postImage = getMainImage(
        posts[i].postImage,
        process.env.POST_BASE_URL
      );
    }
    return res.status(200).json({
      posts,
    });
  } catch (err) {
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

/* 조건 결과 페이지 조회  */
const getResultPageOfCondition = async (req, res, next) => {
  const userId = checkLoginUser(req.user);
  const { weather, category, num, gender, x, y } = req.query;
  const lang = req.header('language');
  /* 현재 위치가 설정 되어 있을 경우 없을 경우 */
  const params =
    x === undefined || y === undefined
      ? [userId, userId, weather, category, num, gender]
      : [userId, x, y, x, userId, weather, category, num, gender];

  /* 유효성 검사 */
  try {
    await schemasOfResultPageofCondition.validateAsync({
      userId,
      weather,
      category,
      num,
      gender,
    });
  } catch (err) {
    return next(customizedError(err, 400));
  }

  const connection = await pool.getConnection(async (conn) => conn);
  try {
    /* 현재 위치가 설정 되어있을 경우 없을 경우 */
    const result =
      x === undefined || y === undefined
        ? await connection.query(queryOfResultPageOfCondition(userId, weather, category, num, gender))
        : await connection.query(
            queryOfResultPageOfConditionAndCurrentLoc(
            userId, x, y, weather, category, num, gender, lang
            )
          );
    const insidePlaces = [];
    const outSidePlaces = [];
    // 실내 실외 포스트 구분(최대 9개씩 받기)
    for (let i = 0; i < result[0].length; i++) {
      const insideSize = insidePlaces.length;
      const outsideSize = outSidePlaces.length;
      if (insideSize > 9 && outsideSize > 9) {
        break;
      }
      result[0][i].postImage = getMainImage(
        result[0][i].postImage,
        process.env.POST_BASE_URL
      );
      if (result[0][i].insideYN === 1 && insideSize < 9) {
        insidePlaces.push(result[0][i]);
      } else if (result[0][i].insideYN === 0 && outsideSize < 9) {
        outSidePlaces.push(result[0][i]);
      }
    }
    return res.status(200).json({
      insidePlaces,
      outSidePlaces,
    });
  } catch (err) {
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

/* 조건 결과 상세 페이지 조회(실내외 중 한개) */
const getDetailPageOfInOutDoors = async (req, res, next) => {
  const userId = checkLoginUser(req.user);
  const lang = req.headers['language'];
  const { weather, category, num, gender, inside, x, y } = req.query;
  const page = req.params.number;
  const pageNum = (Number(req.params.number) - 1) * 12;
  const params =
    x === undefined || y === undefined
      ? [userId, userId, weather, category, num, gender, inside, pageNum]
      : [
          userId,
          x,
          y,
          x,
          userId,
          weather,
          category,
          num,
          gender,
          inside,
          pageNum,
        ];

  /* 유효성 검사 */
  try {
    await schemasOfDetailPageOfInOutDoors.validateAsync({
      userId,
      weather,
      category,
      num,
      gender,
      inside,
      pageNum,
    });
  } catch (err) {
    return next(customizedError(err, 400));
  }
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const result =
      x === undefined || y === undefined
        ? /* 현재 위치가 설정 안된 경우 */
          await connection.query(queryOfDetailPageOfInOutDoors(userId, weather, category, num, gender, inside, pageNum))
        : /* 현재 위치가 설정 된 경우 */
          await connection.query(
            queryOfDetailPageOfInOutDoorsAndCurrentLoc(userId, x, y, weather, category, num, gender, inside, pageNum)
          );
    let posts = result[0];
    // 메인 이미지만 가져오기
    for (let i = 0; i < posts.length; i++) {
      posts[i].postImage = getMainImage(
        posts[i].postImage,
        process.env.POST_BASE_URL
      );
    }

    /* 마지막 페이지 수를 구하기 위함 */
    let [lastPage] =
      x === undefined || y === undefined
        ? await connection.query(queryOfGettingTotalPageNum, params)
        : await connection.query(
            queryOfGettingTotalPageNumAndCurrentLoc(
              userId,
              x,
              y,
              weather,
              category,
              num,
              gender,
              inside
            )
          );
    lastPage = Math.ceil(lastPage[0].pageNum / 12);

    return res.status(200).json({
      page: Number(page),
      lastPage,
      posts,
    });
  } catch (err) {
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

module.exports = {
  getResultPageOfCondition,
  getDetailPageOfInOutDoors,
  getResultPageOfTotal,
};
