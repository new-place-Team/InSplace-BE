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

module.exports = {
  checkDuplicateOfEmail,
  checkDuplicateOfNickname,
  getuserPasswordAndId,
};
