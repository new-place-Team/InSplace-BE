const customizedError = require('../controllers/error');
const { pool } = require('../models/index');
const { getKakaoUser, getUsers } = require('../query/user');
const jwt = require('jsonwebtoken');
//등록된 회원이 있는지 확인 함수

// Nickname 중복 검사 함수
const checkDuplicateOfNickname = async (nickname, next) => {
  try {
    const [result] = await pool.query(getUsers('', nickname));
    return result[0];
  } catch (err) {
    return next(customizedError(err, 400));
  }
};

//로그인 시키는 함수
const startLogin = (user_id, nickname, description, user_image, email, res) => {
  console.log('카카오 로그인성공 후 이미지', user_image);
  const token = jwt.sign({ user_id }, process.env.SECRET_KEY);
  return res.status(200).json({
    userId: user_id,
    token,
    nickname,
    mbti: description,
    userImage: user_image,
    email,
  });
};

//카카오 계정이 있는지 확인하는 함수
const checkKakaoUserAndLogin = async (kakaoUserId, next, res) => {
  try {
    const [resultFindKakaoUser] = await pool.query(getKakaoUser(kakaoUserId));

    if (resultFindKakaoUser.length !== 0) {
      //로그인 시킴
      const {
        user_id,
        nickname: kakaoNickname,
        description,
        user_image,
        email,
      } = resultFindKakaoUser[0];

      startLogin(user_id, kakaoNickname, description, user_image, email, res);
      return true;
    }
  } catch (err) {
    return next(customizedError(err, 400));
  }
  return;
};

module.exports = {
  checkDuplicateOfNickname,
  checkKakaoUserAndLogin,
};
