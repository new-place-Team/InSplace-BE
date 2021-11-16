// Email 중복 검사 함수
const { pool } = require('../../models/index');
const { getUsers, getUserInformation } = require('../../query/user');
const customizedError = require('../error');
const checkDuplicateOfEmail = async (email, next) => {
  try {
    const [result] = await pool.query(getUsers(email, ''));
    return result[0];
  } catch (err) {
    return next(customizedError(err, 400));
  }
};

// Nickname 중복 검사 함수
const checkDuplicateOfNickname = async (nickname, next) => {
  try {
    const [result] = await pool.query(getUsers('', nickname));
    return result[0];
  } catch (err) {
    return next(customizedError(err, 400));
  }
};
//로그인 이메일로 유저정보 가져오기
const getuserPasswordAndId = async (email) => {
  const [userPasswordAndId] = await pool.query(getUserInformation(email));
  return userPasswordAndId;
};

const randomRegistImage = (maleYN) => {
  const defaultMaleImages = [
    `${process.env.USER_BASE_URL}1-1.png`,
    `${process.env.USER_BASE_URL}1-2.png`,
    `${process.env.USER_BASE_URL}1-3.png`,
  ];
  const defaultFemaileImages = [
    `${process.env.USER_BASE_URL}0-1.png`,
    `${process.env.USER_BASE_URL}0-2.png`,
    `${process.env.USER_BASE_URL}0-3.png`,
  ];
  const defaultNonImages = [
    `${process.env.USER_BASE_URL}null-1.png`,
    `${process.env.USER_BASE_URL}null-2.png`,
    `${process.env.USER_BASE_URL}null-3.png`,
  ];

  if (maleYN == 1) {
    return defaultMaleImages[Math.round(Math.random())];
  }
  if (maleYN == 0) {
    return defaultFemaileImages[Math.round(Math.random())];
  } else {
    return defaultNonImages[Math.round(Math.random())];
  }
};

module.exports = {
  checkDuplicateOfEmail,
  checkDuplicateOfNickname,
  getuserPasswordAndId,
  randomRegistImage,
};
