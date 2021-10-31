const { pool } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { customizedError } = require('../controllers/error');
const {
  getUsers,
  checkMBTI,
  insertNewUser,
  getUserInformation,
} = require('../query/user');
const registUser = async (req, res, next) => {
  const { email, nickname, password } = req.user;
  const { male_yn, mbti_id } = req.body;

  // Email 중복 검사 함수 선언
  const checkDuplicateOfEmail = async (email) => {
    try {
      const [result] = await pool.query(getUsers(email, ''));
      return result[0];
    } catch (err) {
      next(customizedError(err, 400));
    }
  };

  // Nickname 중복 검사 함수 선언
  const checkDuplicateOfNickname = async (nickname) => {
    try {
      const [result] = await pool.query(getUsers('', nickname));
      return result[0];
    } catch (err) {
      next(customizedError(err, 400));
    }
  };

  //Email 중복검사
  if (await checkDuplicateOfEmail(email)) {
    return customizedError('이메일이 이미 존재합니다', 400);
  }
  //Nickname 중복검사
  if (await checkDuplicateOfNickname(nickname)) {
    return customizedError('닉네임이 이미 존재합니다 중복검사 에러', 400);
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
        return res.sendStatus(201);
      })
      .catch((err) => {
        next(customizedError(err, 400));
      });
  } catch (err) {
    next(customizedError(err, 400));
  }
};

const authUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //유저가 입력한 이메일로 해쉬된 비밀번호 가져오기
    const [userPasswordAndId] = await pool.query(getUserInformation(email));

    //해쉬된 비밀번호가 없는경우는 이메일이 없는경우이므로 로그인 실패
    if (userPasswordAndId.length == 0) {
      return customizedError('Email 혹은 Password가 틀렸습니다', 400);
    }

    const { user_id, nickname, description, user_image } = userPasswordAndId[0];
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

      return res
        .status(201)
        .json({ token, nickname, mbti: description, userImage: user_image });
    }
    //비밀번호가 틀려서 로그인 실패

    next(customizedError('Email 혹은 Password가 틀렸습니다', 400));
  } catch (err) {
    console.log('캐치에러 케치애러', err);
    next(customizedError(err, 400));
  }
};
module.exports = { registUser, authUser };
