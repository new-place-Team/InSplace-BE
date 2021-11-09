const axios = require('axios');
const qs = require('qs');
const customizedError = require('../controllers/error');

const getKakaoToken = async (code) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: qs.stringify({
        grant_type: 'authorization_code',
        redirect_uri: 'https://insplace-dev.web.app/users/kakao/auth',
        client_id: process.env.KAKAO_REST_KEY, //env파일로
        code,
      }),
    });
    return result;
  } catch (err) {
    customizedError(err, 400);
  }
};

const getKakaoUserInformation = async (token) => {
  try {
    const result = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result;
  } catch (err) {
    customizedError(err, 400);
  }
  console.log('토큰으로 유저정보 받는중');
};

module.exports = { getKakaoToken, getKakaoUserInformation };
