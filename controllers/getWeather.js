const { pool } = require('../models/index');
const customizedError = require('./error');
const { weatherQuery } = require('../query/showWeather');
const logger = require('../config/logger');

const getWeatherInfo = async (req, res, next) => {
  try {
    const [[weatherInfo]] = await pool.query(weatherQuery);
    let pm10 = weatherInfo.pm10;
    let pm25 = weatherInfo.pm25;
    switch(true){
      case(pm10 < 25):
        pm10 = 1; // 미세먼지 좋음
        break;
      case(pm10 < 50):
        pm10 = 2 // 미세먼지 보통
        break;
      case(pm10 < 90):
        pm10 = 3; // 미세먼지 나쁨
        break;
      case(pm10 < 180):
        pm10 = 4; //미세먼지 매우 나쁨
        break;
      case(pm10 > 180):
        pm10 = 5; //미세먼지 위험
        break;
    }

    return res.status(200).json({
      status: weatherInfo.status,
      temperature: weatherInfo.temperature,
      diff: weatherInfo.diff,
      frontWeather: weatherInfo.frontWeather,
      humidity: weatherInfo.humidity,
      pm10: pm10,
      pm25: pm25
    });
  } catch (err) {
    logger.error(`데이터베이스의 날씨를 가져오던 도중 에러가 발생했습니다 : ${err}`)
    return next(customizedError(err, 400));
  }
};

module.exports = {
  getWeatherInfo,
};
