const logger = require('../config/logger');
const { pool } = require('../models/index');
require('dotenv').config;
const {
  queryOfResultPageOfCondition,
  queryOfDetailPageOfInOutDoors,
  queryOfResultPageOfTotal,
  queryOfGettingInOutDoorsPageNum,
  queryOfResultPageOfConditionAndCurrentLoc,
  queryOfDetailPageOfInOutDoorsAndCurrentLoc,
  queryOfGettingInOutDoorsPageNumAndCurrentLoc,
  queryOfGettingTotalPageNum,
  queryOfResultPageOfConditionAndArea,
  queryOfDetailPageOfInOutDoorsAndArea,
  queryOfGettingInOutDoorsPageNumAndArea,
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
  const lang = req.headers['language'];
  let errMsg;
  /* 유효성 검사 */
  try {
    await schemasOfResultPageofTotal.validateAsync({
      userId,
      result,
      pageNum,
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
      queryOfResultPageOfTotal(userId, result, pageNum, lang)
    );

    let posts = data[0];
    // 메인 이미지만 가져오기
    for (let i = 0; i < posts.length; i++) {
      posts[i].postImage = getMainImage(
        posts[i].postImage,
        process.env.POST_BASE_URL
      );
    }

    /* 마지막 페이지 수를 구하기 위함 */
    let [lastPage] = await connection.query(
      queryOfGettingTotalPageNum(userId, result, lang)
    );

    lastPage = Math.ceil(lastPage[0].pageNum / 12);
    return res.status(200).json({
      page: Number(req.params.number),
      lastPage,
      posts,
    });
  } catch (err) {
    logger.error(`토탈 검색 페이지에서 서버측 에러가 발생했습니다 : ${err}`);
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

/* 조건 결과 페이지 조회  */
const getResultPageOfCondition = async (req, res, next) => {
  const userId = checkLoginUser(req.user);
  const { weather, category, num, gender, x, y, area } = req.query;
  const lang = req.headers['language'];
  let errMsg;
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
      /* 전국 검색인 경우 */
      result = await connection.query(
        queryOfResultPageOfCondition(
          userId,
          weather,
          category,
          num,
          gender,
          lang
        )
      );
    } else if (x === undefined && y === undefined && area !== undefined) {
      /* 지역 검색인 경우 */
      result = await connection.query(
        queryOfResultPageOfConditionAndArea(
          userId,
          weather,
          category,
          num,
          gender,
          area,
          lang
        )
      );
    } else {
      /* 현재 위치 검색인 경우 */
      result = await connection.query(
        queryOfResultPageOfConditionAndCurrentLoc(
          userId,
          x,
          y,
          weather,
          category,
          num,
          gender,
          lang
        )
      );
    }
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
    logger.error(
      `조건 결과 페이지 조회에서 서버측 에러가 발생했습니다 : ${err}`
    );
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

/* 조건 결과 상세 페이지 조회(실내외 중 한개) */
const getDetailPageOfInOutDoors = async (req, res, next) => {
  const userId = checkLoginUser(req.user);
  const lang = req.headers['language'];
  let errMsg;
  const { weather, category, num, gender, inside, x, y, area } = req.query;
  const page = req.params.number;
  const pageNum = (Number(req.params.number) - 1) * 12;

  console.log(`x: ${x}, y: ${y}, area: ${area}`);
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
          pageNum,
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
          pageNum,
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
          pageNum,
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

    /* 마지막 페이지 수를 구하기 위함 */
    let lastPage;
    if (x === undefined && y === undefined && area === undefined) {
      /* 전역 검색인 경우 */
      [lastPage] = await connection.query(
        queryOfGettingInOutDoorsPageNum(
          userId,
          weather,
          category,
          num,
          gender,
          inside
        )
      );
    } else if (x === undefined && y === undefined && area !== undefined) {
      /* 지역 검색인 경우 */
      [lastPage] = await connection.query(
        queryOfGettingInOutDoorsPageNumAndArea(
          userId,
          weather,
          category,
          num,
          gender,
          inside,
          area
        )
      );
    } else {
      /* 현재 위치 검색인 경우 */
      [lastPage] = await connection.query(
        queryOfGettingInOutDoorsPageNumAndCurrentLoc(
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
    }

    lastPage = Math.ceil(lastPage[0].pageNum / 12);
    return res.status(200).json({
      page: Number(page),
      lastPage,
      posts,
    });
  } catch (err) {
    logger.error(
      `조건 결과 상세 페이지 조회(실내외중 한개)에서 서버측 에러가 발생했습니다: ${err}`
    );
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
