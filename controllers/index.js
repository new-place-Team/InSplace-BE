const logger = require('../config/logger');
const axios = require('axios');
const { pool } = require('../models/index');
const {
  searchMainQuery,
  likeQuery,
  mdQuery,
  weatherQuery,
} = require('../query/main');
const customizedError = require('./error');

const searchMain = async (req, res) => {
  let weatherResult;
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const adjImg = (result) => {
      let resultImg = result[0];
      for (let i = 0; i < resultImg.length; i++) {
        resultImg[i].post_images = result[0][i].post_images
          .split('&&')
          .slice(1)[0];
      }
      return resultImg;
    };
    weatherResult = await connection.query(weatherQuery);
    const weatherInfo = weatherResult[0]; //날씨 조회
    const weatherCondition = weatherInfo[0].weather_status; //날씨 상태 ID
    const weatherTemp = weatherInfo[0].weather_temp; //현재 온도
    const weatherDiff = weatherInfo[0].temp_diff; // 어제와 오늘 온도의 차이

    const result = await connection.query(searchMainQuery(weatherCondition)); //날씨
    const likeResult = await connection.query(likeQuery); //좋아요
    const mdResult = await connection.query(mdQuery); // 관리자 추천
    const adjResult = adjImg(result);
    const adjLike = adjImg(likeResult);
    const adjMd = adjImg(mdResult);

    return res.status(200).json({
      weather: {
        status: weatherCondition,
        temperature: weatherTemp,
        diff: weatherDiff,
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

module.exports = {
  searchMain,
};
