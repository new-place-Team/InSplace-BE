const logger = require('../config/logger');
const axios = require('axios');
const { pool } = require('../models/index');
const { searchMainQuery, likeQuery, mdQuery } = require('../query/main');
require('dotenv').config();

const searchMain = async (req, res) => {
  let weatherCondition;
  let weatherTemp = 0;
  const { data } = await axios.get(
    `http://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${process.env.WEATHER_API}`
  );
  weatherTemp = (data.main.temp - 272).toString().substr(0, 2); //현재 온도입니다.
  weatherCondition = data.weather[0].id; //현재 어떤 날씨 상태코드인지 가져옵니다.
  waetherString = weatherCondition.toString();
  // console.log(data);
  // const date1 = new Date(1635307200000)
  // console.log('datetest', date1)

  if (
    waetherString.charAt(0) === 5 ||
    waetherString.charAt(0) === 3 ||
    waetherString.charAt(0) === 2
  ) {
    weatherCondition = 2; //rain, drizzle, storm일경우 비 상태로 보내줍니다
  } else if (waetherString.charAt(0) === 6) {
    weatherCondition = 3; // snow상태일경우 눈 상태로 보내줍니다
  } else {
    weatherCondition = 1; //그 외의 모든 날씨는 맑음으로 처리합니다
  }
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
