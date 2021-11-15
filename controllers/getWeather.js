const { pool } = require('../models/index');
const customizedError = require('./error');
const { weatherQuery } = require('../query/showWeather');

const getWeatherInfo = async (req, res, next) => {
  try {
    const [[weatherInfo]] = await pool.query(weatherQuery);
    return res.status(200).json({
      status: weatherInfo.status,
      temperature: weatherInfo.temperature,
      diff: weatherInfo.diff,
      frontWeather: weatherInfo.frontWeather,
    });
  } catch (err) {
    return next(customizedError(err, 400));
  }
};

module.exports = {
  getWeatherInfo,
};
