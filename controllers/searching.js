const logger = require('../config/logger');
const { pool } = require('../models/index');
const {
  queryOfResultPageOfCondition,
  queryOfDetailPageOfInOutDoors,
} = require('../query/searching');
const customizedError = require('./error');
const {
  schemaOfDetailPageOfInOutDoors,
  schemaOfResultPageofCondition,
} = require('../middlewares/validationSearching');

/* image Text를 Array로 변환시키는 함수 */
const convertImageToArray = (imgText) => {
  const imgArr = imgText.split('&&');
  return imgArr.slice(1);
};

/* 메인 이미지 한개만 가져오는 함수 */
const getMainImage = (imgText) => {
  const imgArr = imgText.split('&&');
  let res = '';
  if (imgArr.length >= 2) {
    res = imgArr[1];
  }
  return res;
};

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

/* 조건 결과 페이지 조회  */
const getResultPageOfCondition = async (req, res, next) => {
  const userId = checkLoginUser(req.user);
  const { weather, category, num, gender } = req.query;
  const params = [userId, weather, category, num, gender];

  /* 유효성 검사 */
  try {
    await schemaOfResultPageofCondition.validateAsync({
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
    // 실내 실외 포스트 구분(최대 14개씩 받기)
    for (let i = 0; i < result[0].length; i++) {
      const insideSize = insidePlaces.length;
      const outsideSize = outSidePlaces.length;
      if (insideSize > 16 && outsideSize > 16) {
        break;
      }
      result[0][i].postImage = getMainImage(result[0][i].postImage);
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
  const pageNum = req.params.number * 16;
  const params = [userId, weather, category, num, gender, inside, pageNum];

  /* 유효성 검사 */
  try {
    await schemaOfDetailPageOfInOutDoors.validateAsync({
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
      posts[i].postImage = getMainImage(posts[i].postImage);
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
};
