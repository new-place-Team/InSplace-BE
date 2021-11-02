const axios = require('axios');
const { pool } = require('../models/index');
const customizedError = require('./error');
const { updateWeatherQuery } = require('../query/weatherSchedule');
require('dotenv').config();

const schedulingWeather = async (req, res) => {
  let weatherCondition;
  let weatherString;
  let date = new Date();
  let yesterday = new Date(date.setDate(date.getDate() - 1)).getTime() / 1000;
  let yesterdayTime = Math.floor(yesterday);

  const { data } = await axios.get(
    `http://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${process.env.WEATHER_API}`
  );
  const { data: prevData } = await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=37.5683&lon=126.9778&dt=${yesterdayTime}&appid=${process.env.WEATHER_API}`
  );
  weatherCondition = data.weather[0].id; // 현재 날씨에 대한 상태를 가져옵니다
  weatherString = weatherCondition.toString(); // 날씨 코드를 변환시키기 위해 String 형태로 변환합니다.
  const weatherTemp = (data.main.temp - 272).toString().substr(0, 2); //현재 기온을 가져옵니다
  const prevTemp = (prevData.current.temp - 272).toString().substr(0, 2); // 현 시간 기준 어제 기온을 가져옵니다.
  const weatherComparision = weatherTemp - prevTemp; // 화씨온도를 섭씨로 변환 한 후 소수점이하 자리를 잘라냅니다.

  if (
    weatherString.charAt(0) === 5 ||
    weatherString.charAt(0) === 3 ||
    weatherString.charAt(0) === 2
  ) {
    weatherCondition = 2; //rain, drizzle, storm일경우 비 상태로 보내줍니다
  } else if (weatherString.charAt(0) === 6) {
    weatherCondition = 3; // snow상태일경우 눈 상태로 보내줍니다
  } else {
    weatherCondition = 1; //그 외의 모든 날씨는 맑음으로 처리합니다
  }

  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.query(
      updateWeatherQuery(weatherCondition, weatherTemp, weatherComparision)
    );
  } catch (err) {
    return next(customizedError(err, 400));
  } finally {
    await connection.release();
  }
};
module.exports = { schedulingWeather };
