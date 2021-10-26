const logger = require('../config/logger');
const { pool } = require('../models/index');
const bcrypt = require('bcrypt');

const registUser = async (req, res) => {
  const { email, nickname, password } = req.user;
  const { male_yn, mbti_id } = req.body;

  //Email 중복 검사 함수 선언
  const duplicateEmailCheck = async (email) => {
    const [result] = await pool.query(`SELECT * FROM Users WHERE email = ?`, [
      email,
    ]);
    return result[0];
  };

  //Nickname 중복 검사 함수 선언
  const duplicateNicknameCheck = async (nickname) => {
    const [result] = await pool.query(
      `SELECT * FROM Users WHERE nickname = ?`,
      [nickname]
    );
    return result[0];
  };
  //Email Nickname 중복검사
  if (await duplicateEmailCheck(email)) {
    return res
      .status(200)
      .json({ success: true, msg: '이메일이 중복되었습니다' });
  }
  if (await duplicateNicknameCheck(nickname)) {
    return res
      .status(200)
      .json({ success: true, msg: '닉네임이 중복되었습니다' });
  }

  //중복검사 통과
  try {
    //mbti id검사
    const [data] = await pool.query(
      `SELECT mbti_id 
       FROM Mbti 
       WHERE description = ?`,
      [mbti_id]
    );
    //비밀번호 암호화
    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.HASH_SALT)
    );
    //유저 정보 저장
    pool
      .query(
        `INSERT INTO Users 
      (email, nickname, password, male_yn, mbti_id) 
      VALUES(?,?,?,?,?)`,
        [email, nickname, hashPassword, male_yn, data[0].mbti_id]
      )
      .then((data) => {
        return res.status(201).json({ success: true });
      })
      .catch((err) => {
        logger.error(`유저 회원가입부분에서 에러 발생 : ${err}`);
        return res.status(400).json({
          success: false,
          errMSG: '유저정보 등록과정에서 에러 발생',
          err,
        });
      });
  } catch (err) {
    logger.error(`mbti, 비밀번호 Hash과정에서 에러 발생: ${err}`);
    return res.status(400).json({
      success: false,
      errMSG: 'mbti, 비밀번호 Hash과정에서 에러 발생',
      err,
    });
  }
};

module.exports = registUser;
