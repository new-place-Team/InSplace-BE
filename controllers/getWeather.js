const { pool } = require('../models/index');
const customizedError = require('./error');
const { weatherQuery } = require('../query/showWeather');

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

    switch(true){
      case(pm25 < 15):
        pm25 = 1; // 초미세먼지 좋음
        break;
      case(pm25 < 30):
        pm25 = 2 // 초미세먼지 보통
        break;
      case(pm25 < 55):
        pm25 = 3; // 초미세먼지 나쁨
        break;
      case(pm25 < 110):
        pm25 = 4; // 초미세먼지 매우나쁨
        break;
      case(pm25 > 110):
        pm25 = 5; // 초미세먼지 위험
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
    return next(customizedError(err, 400));
  }
};

module.exports = {
  getWeatherInfo,
};
