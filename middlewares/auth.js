const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();
const db = require('../models/index');

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
    const userNickname = decoded.userNickname;
    const userEmail = decoded.userEmail;

    const data = await getUserInfo(userEmail, userNickname);

    if (!data.success) {
      return res
        .status(401)
        .json({ success: false, msg: '존재하지 않는 회원입니다.' });
    }
    req.user = data.rows;
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

    if (!data.success) {
      return next();
    }
    req.user = data.rows;
    next();
  });
};

function getUserInfo(userEmail, userNickname) {
  return new Promise((resolve, reject) => {
    const query = 'select * from user where userEmail = ? and userNickname = ?';
    const params = [userEmail, userNickname];
    db.query(query, params, (error, rows, fields) => {
      if (error) {
        console.log(`유저 정보를 가져오는 DB에서 에러 발생: ${error}`);
        return resolve({
          success: false,
        });
      }

      if (rows.length == 0) {
        return resolve({ success: false });
      }

      return resolve({
        success: true,
        rows: rows[0],
      });
    });
  });
}

module.exports = {
  isAuth,
  justCheckAuth,
};
