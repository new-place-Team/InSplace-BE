const logger = require('../config/logger');
const { pool } = require('../models/index');
const { queryOfResultPageOfCondition } = require('../query/searching');
const axios = require('axios');

const searchMain = async (req, res) => {
  let weatherCondition;
  let weatherTemp = 0;

  const { data } = await axios.get(
    'http://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=86a911705bccf5bb797d3d1ba9430709'
  );
  weatherTemp = (data.main.temp - 272).toString().substr(0, 2); //현재 온도입니다.
  weatherCondition = data.weather[0].id; //현재 어떤 날씨 상태코드인지 가져옵니다.
  waetherString = weatherCondition.toString();
  // console.log(data);
  // const date1 = new Date(1635307200000)
  // console.log('datetest', date1)
  
  if (waetherString.charAt(0) === 5 || waetherString.charAt(0) === 3 || waetherString.charAt(0) === 2 ){
    weatherCondition = 2; //rain, drizzle, storm일경우 비 상태로 보내줍니다
  } else if (waetherString.charAt(0) === 6) {
    weatherCondition = 3; // snow상태일경우 눈 상태로 보내줍니다
  } else {
    weatherCondition = 1; //그 외의 모든 날씨는 맑음으로 처리합니다
  }
  const connection = await pool.getConnection(async (conn) => conn);

  try {
    const searchMainQuery = `
    SELECT *
    FROM Posts 
    WHERE weather_id IN(${weatherCondition}, 7)
    AND post_id NOT IN(
      SELECT post_id
      FROM(
        SELECT post_id
        FROM Posts
        ORDER BY like_cnt DESC limit 6
      ) as tempPosts 
    )
    ORDER BY rand() limit 6 
    `;
    //좋아요에 존재하는 카드들은 보여주지 않음

    const likeQuery = `
    SELECT *
    FROM Posts 
    ORDER BY like_cnt DESC limit 6
    `;

    const mdQuery = `
    SELECT *
    FROM Posts 
    ORDER BY like_cnt DESC limit 6
    `
    //해당 쿼리문은 posts에 State 추가 후 수정 예정입니다

    let user ={};

     if(req.user){
       user = req.user
     }

    const result = await connection.query(searchMainQuery);
    const likeResult = await connection.query(likeQuery);
    const mdResult = await connection.query(mdQuery);

    let payload = {
      weather: {
        status: weatherCondition,
        temperature: weatherTemp,
      },
      weatherPlace: result[0],
      likePlace: likeResult[0],
      pickPlace: mdResult[0],
      user,
      success: true,
    }

    return res.status(200).json({payload});
    
  } catch(err) {
    logger.error(`쿼리문을 실행할 때 오류가 발생했습니다 :`, err)
    payload = {
      success: false,
      errMsg: `쿼리문을 실행할 때 오류가 발생했습니다: ${err}`,
    }
    return res.status(400).json(payload);
  } finally {
    await connection.release();
  }
};

/* 조건 결과 페이지 조회  */
const getResultPageOfCondition = async (req, res) => {
  console.log('user: ', req.user);
  const { weather, category, num, gender } = req.query;
  logger.info(queryOfResultPageOfCondition);
  const params = [weather, category, num, gender];
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const result = await connection.query(queryOfResultPageOfCondition, params);
    let payload = {
      success: true,
      posts: result[0],
    };
    return res.status(200).json({
      payload,
    });
  } catch (err) {
    logger.error('조건 결과 페이지 조회 기능에서 발생한 에러', err);
    payload = {
      success: false,
      errMsg: `조건 결과 페이지 조회 기능에서 발생한 에러', ${err}`,
      posts: [],
    };
    return res.status(400).json({ payload });
  } finally {
    await connection.release();
  }
};

module.exports = {
  getResultPageOfCondition,
  searchMain,
};
