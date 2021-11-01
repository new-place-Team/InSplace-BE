const logger = require('../config/logger');
const axios = require('axios');
const { pool } = require('../models/index');
const { searchMainQuery, likeQuery, mdQuery, weatherQuery } = require('../query/main');
require('dotenv').config();

const searchMain = async (req, res) => {
  let weatherCondition;
  let weatherTemp;
  let weatherDiff;
  let weatherInfo;
  let weatherResult;
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    let user = {};

    if (req.user) {
      user = req.user;
    }

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
    weatherInfo = weatherResult[0]
    console.log(weatherInfo);
    weatherCondition = weatherInfo[0].weather_status;
    weatherTemp = weatherInfo[0].weather_temp;
    weatherDiff = weatherInfo[0].temp_diff;
    console.log(weatherCondition)
    const result = await connection.query(searchMainQuery(weatherCondition)); //날씨
    const likeResult = await connection.query(likeQuery); //좋아요
    const mdResult = await connection.query(mdQuery); // 관리자 추천
    const adjResult = adjImg(result);
    const adjLike = adjImg(likeResult);
    const adjMd = adjImg(mdResult);

    let payload = {
      weather: {
        status: weatherCondition,
        temperature: weatherTemp,
        diff: weatherDiff,
      },
      weatherPlace: adjResult,
      likePlace: adjLike,
      pickPlace: adjMd,
      user,
      success: true,
    };

    return res.status(200).json({ payload });
  } catch (err) {
    logger.error(`쿼리문을 실행할 때 오류가 발생했습니다 :`, err);
    payload = {
      success: false,
      errMsg: `쿼리문을 실행할 때 오류가 발생했습니다: ${err}`,
    };
    return res.status(400).json(payload);
  } finally {
    await connection.release();
  }
};

module.exports = {
  searchMain,
};
