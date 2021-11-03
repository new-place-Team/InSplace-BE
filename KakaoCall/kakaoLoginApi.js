const axios = require('axios');
const qs = require('qs');

const getKakaoToken = async () => {
  const result = await axios({
    method: 'POST',
    url: 'https://kauth.kakao.com/oauth/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    data: qs.stringify({
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/users/kakao/auth',
      client_id: 'b4112f96ef8a195cd7961a3676d0d674',
      code: '40pQMUI52xpp0OiE1sqdHO_3l6dSXxTDasmW0oJ7n-slVsVGLZTiaiFrlQNP5z6Cq3xfMwopcNEAAAF85V2LIg',
    }),
  });
  return result;
};

const getKakaoUserInformation = async () => {
  const result = await axios({
    method: 'GET',
    url: 'https://kapi.kakao.com/v2/user/me',
    headers: {
      Authorization:
        'Bearer a9ZdTWdwvpLse0KcuNxvsThYwg9xGLsjCioEkgopyWAAAAF85V4TIg',
    },
  });
  return result;
};

module.exports = { getKakaoToken, getKakaoUserInformation };
