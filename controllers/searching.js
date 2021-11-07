const logger = require('../config/logger');
const { pool } = require('../models/index');
require('dotenv').config;
const {
  queryOfResultPageOfCondition,
  queryOfDetailPageOfInOutDoors,
  queryOfResultPageOfTotal,
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
  const pageNum = (Number(req.params.number) - 1) * 16; // Pages Number
  const result = req.query.result; // Searching Result

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

  const params = [userId, result, result, pageNum];
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const data = await connection.query(queryOfResultPageOfTotal, params);

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
  const { weather, category, num, gender } = req.query;
  const params = [userId, weather, category, num, gender];

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
    const result = await connection.query(queryOfResultPageOfCondition, params);
    const insidePlaces = [];
    const outSidePlaces = [];
    // 실내 실외 포스트 구분(최대 16개씩 받기)
    for (let i = 0; i < result[0].length; i++) {
      const insideSize = insidePlaces.length;
      const outsideSize = outSidePlaces.length;
      if (insideSize > 16 && outsideSize > 16) {
        break;
      }
      result[0][i].postImage = getMainImage(
        result[0][i].postImage,
        process.env.POST_BASE_URL
      );
      if (result[0][i].insideYN === 1 && insideSize <= 14) {
        insidePlaces.push(result[0][i]);
      } else if (result[0][i].insideYN === 0 && outsideSize <= 14) {
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
  const { weather, category, num, gender, inside } = req.query;
  const pageNum = (Number(req.params.number) - 1) * 16;
  const params = [userId, weather, category, num, gender, inside, pageNum];

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
    const result = await connection.query(
      queryOfDetailPageOfInOutDoors,
      params
    );

    let posts = result[0];
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

module.exports = {
  getResultPageOfCondition,
  getDetailPageOfInOutDoors,
  getResultPageOfTotal,
};
