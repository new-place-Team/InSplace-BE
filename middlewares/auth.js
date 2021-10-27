const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const { pool } = require('../models/index');

const isAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!(authHeader && authHeader.startsWith('Bearer'))) {
    // 로그인 안했을 경우 들어와 짐.
    return res
      .status(401)
      .json({ success: false, msg: '로그인이 필요합니다.' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
    // 해독하면서 에러가 발생한 경우
    // 유효기간이 끝났을 때 여기로
    if (error) {
      return res
        .status(401)
        .json({ success: false, msg: '로그인 기간이 만료되었습니다.' });
    }

    const userID = decoded.user_id;

    const data = await getUserInfo(req, res, userID);

    req.user = data.rows.user_id;
    next();
  });
};

// 토큰이 있는 여부만 파악하고 토큰이 존재할 경우 user정보를 받기 위한 미들웨어
const justCheckAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!(authHeader && authHeader.startsWith('Bearer'))) {
    // 로그인 안했을 경우 들어와 짐.
    return next();
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
    // 해독하면서 에러가 발생한 경우
    // 유효기간이 끝났을 때 여기로
    if (error) {
      return next();
    }

    // 존재하지 않는 회원인 경우
    const data = await getUserInfo(userEmail, userNickname);

    req.user = data.rows.user_id;
    next();
  });
};

async function getUserInfo(req, res, userID) {
  const query = `SELECT user_id FROM Users WHERE user_id = ?`;
  const params = [userID];
  try {
    const [rows] = await pool.query(query, params);
    if (rows[0]) {
      return {
        rows: rows[0],
      };
    } else {
      const payload = {
        success: true,
        msg: '존재하지 않는 회원입니다.',
      };
      return res.status(200).json({ payload });
    }
  } catch (err) {
    logger.error(`유저 정보를 가져오는 pool에서 에러 발생: ${err}`);
    res.status(400).json({
      success: false,
      errMsg: '유저 정보를 가져오는 pool에서 에러 발생',
      err: err,
    });
  }
}

module.exports = {
  isAuth,
  justCheckAuth,
};
