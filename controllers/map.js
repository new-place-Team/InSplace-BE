const logger = require('../config/logger');
const { pool } = require('../models/index');
require('dotenv').config;
const {
  queryOfDetailPageOfInOutDoors,
  queryOfResultPageOfTotal,
  queryOfDetailPageOfInOutDoorsAndCurrentLoc,
  queryOfDetailPageOfInOutDoorsAndArea,
} = require('../query/map');
const customizedError = require('./error');
const {
  schemasOfDetailPageOfInOutDoors,
  schemasOfResultPageofTotal,
} = require('../middlewares/validationMap');

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
const getMapDataOfResultPageOfTotal = async (req, res, next) => {
  logger.info('토탈 결과 페이지 조회');
  const userId = Number(checkLoginUser(req.user));
  const result = req.query.result; // Searching Result
  const lang = req.headers['language'];
  let errMsg;
  /* 유효성 검사 */
  try {
    await schemasOfResultPageofTotal.validateAsync({
      userId,
      result,
    });
  } catch (err) {
    errMsg =
      lang === 'ko' || lang === undefined
        ? `유효하지 않은 요청입니다. 다시 확인해주세요`
        : `Invalid Request. Please check your request`;
    return next(customizedError(errMsg, 400));
  }

  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const data = await connection.query(
      queryOfResultPageOfTotal(userId, result, lang)
    );

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
    logger.error(`토탈 검색 페이지에서 서버측 에러가 발생했습니다 : ${err}`);
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

/* 조건 결과 상세 페이지 조회(실내외 중 한개) */
const getMapDataOfResultPageOfInOutDoors = async (req, res, next) => {
  const userId = checkLoginUser(req.user);
  const lang = req.headers['language'];
  let errMsg;
  const { weather, category, num, gender, inside, x, y, area } = req.query;
  /* 유효성 검사 */
  try {
    await schemasOfDetailPageOfInOutDoors.validateAsync({
      userId,
      weather,
      category,
      num,
      gender,
      inside,
    });
  } catch (err) {
    errMsg =
      lang === 'ko' || lang === undefined
        ? `유효하지 않은 요청입니다. 다시 확인해주세요`
        : `Invalid Request. Please check your request`;
    return next(customizedError(errMsg, 400));
  }
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    let result;
    if (x === undefined && y === undefined && area === undefined) {
      /* 전국 검색인 경우*/
      result = await connection.query(
        queryOfDetailPageOfInOutDoors(
          userId,
          weather,
          category,
          num,
          gender,
          inside,
          lang
        )
      );
    } else if (x === undefined && y === undefined && area !== undefined) {
      /* 지역 검색인 경우 */
      result = await connection.query(
        queryOfDetailPageOfInOutDoorsAndArea(
          userId,
          weather,
          category,
          num,
          gender,
          inside,
          area,
          lang
        )
      );
    } else {
      /* 현재 위치 검색인 경우 */
      result = await connection.query(
        queryOfDetailPageOfInOutDoorsAndCurrentLoc(
          userId,
          x,
          y,
          weather,
          category,
          num,
          gender,
          inside,
          lang
        )
      );
    }

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
    logger.error(
      `조건 결과 상세 페이지 조회(실내외중 한개)에서 서버축 에러가 발생했습니다: ${err}`
    );
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

module.exports = {
  getMapDataOfResultPageOfInOutDoors,
  getMapDataOfResultPageOfTotal,
};
