const logger = require('../config/logger');
const {db} = require('../models/index');
const axios = require('axios');

const searchingMain = async(req, res) => {
  try{
    let weatherCondition = 0;
    let weatherTemp = 0;

    const {data} = await axios.get('http://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=86a911705bccf5bb797d3d1ba9430709');
    weatherTemp = (data.main.temp -272).toString().substr(0,3); //현재 온도입니다.
    weatherCondition = data.weather[0].id; //현재 어떤 날씨 상태코드인지 가져옵니다.
    console.log(weatherCondition)

    const searchMainQuery = `
    SELECT *
    FROM Posts
    where weater = 3 
    AND 삭제여부속성 = 0;
    `
  } catch(err) {

  }
}
searchingMain();
//module.exports = router;