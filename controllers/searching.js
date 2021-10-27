const logger = require('../config/logger');
const { pool } = require('../models/index');
const axios = require('axios');

 const searchingMain = async(req, res) => {
  let weatherCondition;
  let weatherTemp = 0;

  const {data} = await axios.get('http://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=86a911705bccf5bb797d3d1ba9430709');
  weatherTemp = (data.main.temp -272).toString().substr(0,2); //현재 온도입니다.
  weatherCondition = data.weather[0].id; //현재 어떤 날씨 상태코드인지 가져옵니다.
  waetherString = weatherCondition.toString();
  const date1 = new Date(1635307200000)
  console.log('datetest', date1)
  


  if (waetherString.charAt(0) === 5 || waetherString.charAt(0) === 3 || waetherString.charAt(0) === 2 ){
    weatherCondition = 2; //rain, drizzle, storm일경우 비 상태로 보내줍니다

  } else if(waetherString.charAt(0) === 6){
    weatherCondition = 3; // snow상태일경우 눈 상태로 보내줍니다

  } else {
    weatherCondition = 1; //그 외의 모든 날씨는 맑음으로 처리합니다
  }
  console.log('///////////')
  console.log(weatherCondition);
  
  try{
    let randomWeather = [];
    const searchMainQuery = `
    SELECT *
    FROM Posts 
    WHERE weather_id IN(${weatherCondition}, 7)
    ORDER BY rand() limit 6
    `
    const result = await pool.query(searchMainQuery);

    return res.status(201).json({
      payload: {
        weather: {
          status: weatherCondition,
          temperature: weatherTemp,
        },
        weatherPlace: result[0],
        test : {

        },
        success: true,
      }
    });
    
  } catch(err) {
    console.log(err);
  }
}
module.exports = {searchingMain};
