const { pool } = require('../models/index');
const customizedError = require('./error');
const { weatherQuery } = require('../query/showWeather');

const getWeatherInfo = async (req, res, next) => {
  try {
    const result = await pool.query(weatherQuery);
    const weahterInfo = result[0]
    console.log(weahterInfo)
    return res.status(200).json({
      weahterInfo
    })
  } catch (err) {
    return next(customizedError(err, 400));
  } 
}

module.exports = {
  getWeatherInfo
};