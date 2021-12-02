const { pool } = require('../models/index');
const {
  searchMainQuery,
  likeQuery,
  mdQuery,
  weatherQuery,
  queryOfGettingMainMap,
} = require('../query/main');
const { getUserVisitedQuery, getUserFavoriteQuery } = require('../query/index');
const customizedError = require('./error');
const { getMainImage } = require('./utils/image');
const logger = require('../config/logger');
const schemasOfMainMap = require('../middlewares/validationMainMap');
require('dotenv').config();
const searchMain = async (req, res, next) => {
  const lang = req.headers['language'];
  let errMsg;
  let weatherResult;
  let user = 0;
  const connection = await pool.getConnection(async (conn) => conn);

  const adjImg = (result) => {
    let resultImg = result[0];
    for (let i = 0; i < resultImg.length; i++) {
      resultImg[i].postImage = `${process.env.POST_THUMB_URL}${
        result[0][i].postImage.split('&&')[0]
      }`;
    }
    return resultImg;
  };

  if (req.user) {
    user = req.user;
  }

  try {
    weatherResult = await connection.query(weatherQuery);
    const weatherInfo = weatherResult[0]; //날씨 조회
    const weatherCondition = weatherInfo[0].weather_status; //날씨 상태 ID
    const weatherTemp = weatherInfo[0].weather_temp; //현재 온도
    const weatherDiff = weatherInfo[0].temp_diff; // 어제와 오늘 온도의 차이
    const weatherFe = weatherInfo[0].weather_status_fe; //프론트로 보내줄 날씨 상태 ID입니다
    const humidity = weatherInfo[0].humidity; // 현재 습도입니다.
    let pm25 = weatherInfo[0].pm25; // 현재 미세먼지입니다. 1시간 단위로 변화합니다.
    let pm10 = weatherInfo[0].pm10; // 현재 초미세먼지입니다. 1시간 단위로 변화합니다.

    switch (true) {
      case pm10 < 25:
        pm10 = 1; // 미세먼지 좋음
        break;
      case pm10 < 50:
        pm10 = 2; // 미세먼지 보통
        break;
      case pm10 < 90:
        pm10 = 3; // 미세먼지 나쁨
        break;
      case pm10 < 180:
        pm10 = 4; //미세먼지 매우 나쁨
        break;
      case pm10 > 180:
        pm10 = 5; //미세먼지 위험
        break;
    }

    const result = await connection.query(
      searchMainQuery(weatherCondition, user, lang)
    ); //날씨
    const likeResult = await connection.query(likeQuery(user, lang)); //좋아요
    const mdResult = await connection.query(mdQuery(user, lang)); // 관리자 추천
    const adjResult = adjImg(result);
    const adjLike = adjImg(likeResult);
    const adjMd = adjImg(mdResult);

    return res.status(200).json({
      weather: {
        status: weatherCondition,
        temperature: weatherTemp,
        diff: weatherDiff,
        frontWeather: weatherFe,
        humidity: humidity,
        pm10: pm10,
        pm25: pm25,
      },
      weatherPlace: adjResult,
      likePlace: adjLike,
      pickPlace: adjMd,
    });
  } catch (err) {
    errMsg =
      lang === 'ko' || lang === undefined
        ? `잘못된 요청입니다 : ${err}`
        : `Invalid Request : ${err}`;
    logger.error(
      `스케쥴러에서 에러가 발생했습니다. SQL 컬럼과 API요청을 확인해주세요 : ${err}`
    );
    return next(customizedError(errMsg, 400));
  } finally {
    await connection.release();
  }
};

/* 가본 리스트 조회  */
const getVisitedPosts = async (req, res, next) => {
  const userId = req.user;
  const lang = req.headers['language'];
  try {
    const [visitedPosts] = await pool.query(getUserVisitedQuery(userId, lang));
    for (let i = 0; i < visitedPosts.length; i++) {
      visitedPosts[i].postImage = getMainImage(
        visitedPosts[i].postImage,
        process.env.POST_THUMB_URL
      );
    }

    return res.status(200).json({
      visitedPosts,
    });
  } catch (err) {
    logger.error(
      `가본 리스트를 조회하던 도중 서버에러가 발생했습니다 : ${err}`
    );
    return next(customizedError(err, 500));
  }
};

/* 찜 목록 조회 */
const getFavoritesPosts = async (req, res, next) => {
  const userId = req.user;
  const lang = req.headers['language'];

  try {
    const [favoritePosts] = await pool.query(
      getUserFavoriteQuery(userId, lang)
    );
    for (let i = 0; i < favoritePosts.length; i++) {
      favoritePosts[i].postImage = getMainImage(
        favoritePosts[i].postImage,
        process.env.POST_THUMB_URL
      );
    }

    return res.status(200).json({
      favoritePosts,
    });
  } catch (err) {
    logger.error(`찜 목록을 조회하던 도중 서버 에러가 발생했습니다: ${err}`);
    return next(customizedError(err, 500));
  }
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

/* nav map 조회 */
const getMainMap = async (req, res, next) => {
  const { x, y } = req.query;
  const lang = req.headers['language'];
  const userId = Number(checkLoginUser(req.user));
  console.log(`userId:${userId}, x: ${x}, y: ${y}`);
  let errMsg = '';
  /* 유효성 검사 */
  try {
    await schemasOfMainMap.validateAsync({
      userId,
      x,
      y,
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
    /* 현재 위치 검색인 경우 */
    const result = await connection.query(
      queryOfGettingMainMap(userId, x, y, lang)
    );
    let posts = result[0];
    // 메인 이미지만 가져오기
    for (let i = 0; i < posts.length; i++) {
      posts[i].postImage = getMainImage(
        posts[i].postImage,
        process.env.POST_THUMB_URL
      );
    }

    return res.status(200).json({
      posts,
    });
  } catch (err) {
    logger.error(`nav안에 map을 조회하면서 서버측 에러가 발생했습니다: ${err}`);
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};
module.exports = {
  searchMain,
  getVisitedPosts,
  getFavoritesPosts,
  getMainMap,
};
