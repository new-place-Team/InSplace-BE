const logger = require('../config/logger');
const { pool } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  getUsers,
  checkMBTI,
  insertNewUser,
  getUserInformation,
} = require('../query/user');
const registUser = async (req, res) => {
  const { email, nickname, password } = req.user;
  const { male_yn, mbti_id } = req.body;

  // Email 중복 검사 함수 선언
  const checkDuplicateOfEmail = async (email) => {
    try {
      const [result] = await pool.query(getUsers(email, ''));
      return result[0];
    } catch (err) {
      logger.error(`Email 중복검사 에러 :${err}`);
      res
        .status(400)
        .json({ success: false, errMsg: `Email 중복검사 에러 :${err}` });
    }
  };

  // Nickname 중복 검사 함수 선언
  const checkDuplicateOfNickname = async (nickname) => {
    try {
      const [result] = await pool.query(getUsers('', nickname));
      return result[0];
    } catch (err) {
      logger.error(`Nickname 중복검사 에러 : ${err}`);
      res
        .status(400)
        .json({ success: false, errMsg: `Nickname 중복검사 에러 :${err}` });
    }
  };
  //기본 payload
  let payload = {
    success: true,
  };

  //Email 중복검사
  if (await checkDuplicateOfEmail(email)) {
    //함수를 불러와서 결과를 payload에 담아주기
    payload.success = false;
    payload.errMsg = '이메일이 이미 존재합니다';

    return res.status(200).json({ payload });
  }
  //Nickname 중복검사
  if (await checkDuplicateOfNickname(nickname)) {
    //함수를 불러와서 결과를 payload에 담아주기
    payload.success = false;
    payload.errMsg = '닉네임이 이미 존재합니다';
    return res.status(200).json({ payload });
  }
  //중복검사 통과
  try {
    //mbti id검사
    const [data] = await pool.query(checkMBTI(mbti_id));

    //비밀번호 암호화
    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.HASH_SALT)
    );
    //유저 정보 저장
    pool
      .query(
        insertNewUser(email, nickname, hashPassword, male_yn, data[0].mbti_id)
      )
      .then((data) => {
        return res.status(201).json({ payload });
      })
      .catch((err) => {
        logger.error(`유저 회원가입부분에서 에러 발생 :${err}`);
        return res.status(400).json({
          success: false,
          errMsg: `유저정보 등록과정에서 에러 발생 :${err}`,
        });
      });
  } catch (err) {
    logger.error(`mbti, 비밀번호 Hash과정에서 에러 발생 :${err}`);
    return res.status(400).json({
      success: false,
      errMsg: `mbti, 비밀번호 Hash과정에서 에러 발생 :${err}`,
    });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  //기본 payload
  let payload = {
    success: true,
  };
  try {
    //유저가 입력한 이메일로 해쉬된 비밀번호 가져오기
    const [userPasswordAndId] = await pool.query(getUserInformation(email));
    //해쉬된 비밀번호가 없는경우는 이메일이 없는경우이므로 로그인 실패
    if (userPasswordAndId.length == 0) {
      payload.success = false;
      payload.msg = '이메일 혹은 패스워드가 틀렸습니다.';

      return res.status(200).json({ payload });
    }

    const { user_id, nickname } = userPasswordAndId[0];
    const dbUserEmail = userPasswordAndId[0].email;
    // 해쉬된 비밀번호와 유저가 입력한 비밀번호를 비교
    const comparePassword = await bcrypt.compare(
      password,
      userPasswordAndId[0].password
    );
    //true면 로그인 성공
    if (comparePassword == true) {
      //jsontoken만들기
      const token = jwt.sign(
        { user_id, nickname, email: dbUserEmail },
        process.env.SECRET_KEY,
        {
          expiresIn: '60m',
        }
      );
      payload.token = token;
      payload.nickname = nickname;

      return res.status(201).json({ payload });
    }
    //비밀번호가 틀려서 로그인 실패
    payload.success = false;
    payload.msg = '이메일 혹은 패스워드가 틀렸습니다.';
    return res.status(200).json({ payload });
  } catch (err) {
    logger.error(`해쉬된 비밀번호 가지고오는 과정에서 에러 :${err}`);
    return res.status(400).json({
      success: false,
      errMsg: `해쉬된 비밀번호 가지고 오는 과정에서 에러 :${err}`,
    });
  }
};
module.exports = { registUser, authUser };
