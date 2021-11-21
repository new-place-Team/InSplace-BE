const { pool } = require('../models/index');
const {
  searchMainQuery,
  likeQuery,
  mdQuery,
  weatherQuery,
} = require('../query/main');
const {
  getUserVisitedQuery,
  getUserFavoriteQuery,
  queryOfAddingFeedback,
} = require('../query/index');
const customizedError = require('./error');
const { getMainImage } = require('./utils/image');

const searchMain = async (req, res, next) => {
  let weatherResult;
  let user = 0;
  const connection = await pool.getConnection(async (conn) => conn);

  const adjImg = (result) => {
    let resultImg = result[0];
    for (let i = 0; i < resultImg.length; i++) {
      resultImg[i].postImage = `${process.env.POST_BASE_URL}${
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
      searchMainQuery(weatherCondition, user)
    ); //날씨
    const likeResult = await connection.query(likeQuery(user)); //좋아요
    const mdResult = await connection.query(mdQuery(user)); // 관리자 추천
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
    return next(customizedError(err, 400));
  } finally {
    await connection.release();
  }
};

/* 가본 리스트 조회  */
const getVisitedPosts = async (req, res, next) => {
  const userId = req.user;
  try {
    const [visitedPosts] = await pool.query(getUserVisitedQuery(userId));
    for (let i = 0; i < visitedPosts.length; i++) {
      visitedPosts[i].postImage = getMainImage(
        visitedPosts[i].postImage,
        process.env.POST_BASE_URL
      );
    }

    return res.status(200).json({
      visitedPosts,
    });
  } catch (err) {
    return next(customizedError(err, 500));
  }
};

/* 찜 목록 조회 */
const getFavoritesPosts = async (req, res, next) => {
  const userId = req.user;

  try {
    const [favoritePosts] = await pool.query(getUserFavoriteQuery(userId));
    for (let i = 0; i < favoritePosts.length; i++) {
      favoritePosts[i].postImage = getMainImage(
        favoritePosts[i].postImage,
        process.env.POST_BASE_URL
      );
    }

    return res.status(200).json({
      favoritePosts,
    });
  } catch (err) {
    return next(customizedError(err, 500));
  }
};

/* 피드백 추가 */
const addFeedback = async (req, res, next) => {
  console.log('user Feedback middleware');
  const userId = req.user;
  const description = req.body.description;

  /* 유효성 검사  */

  // try {
  //   await schemasOfFeedback.validateAsync({
  //     userId,
  //     description,
  //   });
  // } catch (err) {
  //   return next(customizedError(err, 400));
  // }
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const [result] = await connection.query(
      queryOfAddingFeedback(userId, description)
    );
    /* 추가 되지 않은 경우 */
    if (result.affectedRows === 0) {
      return next(customizedError('유저 피드백이 추가 되지 않았습니다.', 400));
    }
    return res.sendStatus(201);
  } catch (err) {
    /* 신고 등록: Fail */
    /* Internal Server Error(예상 못한 에러 발생) */
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};
module.exports = {
  searchMain,
  getVisitedPosts,
  getFavoritesPosts,
  addFeedback,
};
