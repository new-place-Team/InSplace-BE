const logger = require('../config/logger');
const { pool } = require('../models/index');
const { queryOfResultPageOfCondition } = require('../query/searching');


/* 조건 결과 페이지 조회  */
const getResultPageOfCondition = async (req, res) => {
  console.log('user: ', req.user);
  const { weather, category, num, gender } = req.query;
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
};
