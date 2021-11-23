const { pool } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const customizedError = require('../controllers/error');
const {
  getKakaoToken,
  getKakaoUserInformation,
} = require('../KakaoCall/kakaoLoginApi');
const { checkKakaoUserAndLogin } = require('../KakaoCall/kakaoFunction');
const {
  insertNewUserforKakao,
  getUsers,
  checkMBTI,
  insertNewUser,
  getUserInformation,
  getUserInformationById,
  updateUserDeleteYn,
  getKakaoUser,
  modifyUserQuery,
} = require('../query/user');
const {
  checkDuplicateOfEmail,
  checkDuplicateOfNickname,
  getuserPasswordAndId,
  randomRegistImage,
} = require('../controllers/utils/user');

const registUser = async (req, res, next) => {
  const lang = req.headers['language'];
  let errMsg; 
  const { email, nickname, password, maleYN, mbtiId } = req.user;

  //Email 중복검사
  if (await checkDuplicateOfEmail(email, next)) {
    errMsg = 
    (lang === 'ko' || lang === undefined)
    ? '이메일이 이미 존재합니다'
    : 'Email is already exist.'
    return next(customizedError(errMsg, 400));
  }
  //Nickname 중복검사

  if (await checkDuplicateOfNickname(nickname, next)) {
    errMsg = 
    (lang === 'ko' || lang === undefined)
    ? '닉네임이 이미 존재합니다 중복검사 에러'
    : 'Nickname is already exist.'
    return next(customizedError(errMsg, 400));
  }
  //중복검사 통과
  try {
    const randomImageResult = randomRegistImage(maleYN);
    //mbti id검사
    const [data] = await pool.query(checkMBTI(mbtiId));
    //비밀번호 암호화
    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.HASH_SALT)
    );

    //유저 정보 저장
    await pool.query(
      insertNewUser(
        email,
        nickname,
        hashPassword,
        maleYN,
        data[0].mbti_id,
        randomImageResult
      )
    );
    return res.sendStatus(201);
  } catch (err) {
    return next(customizedError(err, 400));
  }
};

const authUser = async (req, res, next) => {
  const { email, password } = req.body;
  const lang = req.headers['language'];
  let errMsg;
  try {
    //해쉬된 비밀번호가 없는경우는 이메일이 없는경우이므로 로그인 실패
    const getUserResult = await getuserPasswordAndId(email);
    if ((await getUserResult.length) == 0) {
      errMsg = 
      (lang === 'ko' || lang === undefined)
      ? 'Email 혹은 Password가 틀렸습니다.'
      : 'Wrong Email or Password.'
      return next(customizedError(errMsg, 400));
    }
    const { user_id, nickname, description, user_image, maleYN, deleteYN } =
      getUserResult[0];
    if (deleteYN == 1) {
      errMsg = 
      (lang === 'ko' || lang === undefined)
      ? '탈퇴한 회원입니다.'
      : 'Already unsubscribed user.'
      return next(customizedError(errMsg, 400));
    }
    const dbUserEmail = getUserResult[0].email;
    // 해쉬된 비밀번호와 유저가 입력한 비밀번호를 비교
    const comparePassword = await bcrypt.compare(
      password,
      getUserResult[0].password
    );

    //true면 로그인 성공
    if (comparePassword == true) {
      //jsontoken만들기
      const token = jwt.sign({ user_id }, process.env.SECRET_KEY);
      return res.status(201).json({
        userId: user_id,
        token,
        nickname,
        mbti: description,
        userImage: user_image,
        email: dbUserEmail,
        maleYN,
      });
    }
    //비밀번호가 틀려서 로그인 실패
    errMsg = 
    (lang === 'ko' || lang === undefined)
    ? 'Email 혹은 Password가 틀렸습니다.'
    : 'Wrong Email or Password.'
    return next(customizedError(errMsg, 400));
  } catch (err) {
    return next(customizedError(err, 400));
  }
};

const checkUser = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  const token = authHeader.split(' ')[1];

  try {
    const result = jwt.verify(token, process.env.SECRET_KEY);

    const [userInformation] = await pool.query(
      getUserInformationById(result.user_id)
    );
    return res.status(200).json({ ...userInformation[0] });
  } catch (err) {
    if (err.message == 'jwt expired') {
      return next(customizedError(err.message, 400));
    }
    return next(customizedError(err.message, 400));
  }
};

const deleteUser = async (req, res, next) => {
  const lang = req.headers['language'];
  let errMsg;
  try {
    const result = await pool.query(updateUserDeleteYn(req.params.userId));
    if (result[0].changedRows == 0) {
      errMsg = 
      (lang === 'ko' || lang === undefined)
      ? '이미 탈퇴된 회원입니다.'
      : 'Already unsubscribed user.'
      return next(customizedError(errMsg, 400));
    }
    return res.sendStatus(200);
  } catch (err) {
    return next(customizedError(err.message, 500));
  }
};

const kakaoLogin = async (req, res, next) => {
  const lang = req.headers['language'];
  let errMsg;
  try {
    //사용자 정보를 데이터베이스에 넣어주는 함수
    const insertUser = async (genderNumber, profile_image_url) => {
      let stateProfile_image = profile_image_url;
      if (profile_image_url == undefined) {
        stateProfile_image == null;
      }
      await pool.query(
        insertNewUserforKakao(
          kakaoUserId,
          stateProfile_image,
          nickname,
          genderNumber
        )
      );
    };

    //인가코드로 토큰 받아오기
    const success = await getKakaoToken(req.query.code);

    //받아온 카카오 토큰으로 유저정보 가져오기
    const getKakaoUserResult = await getKakaoUserInformation(
      success.data.access_token
    );

    const {
      id: kakaoUserId,
      kakao_account: {
        gender,
        profile: { nickname, profile_image_url },
      },
    } = getKakaoUserResult.data;
    let genderNumber = '';
    if (gender == 'male') {
      genderNumber = 1;
    } else if (gender == 'female') {
      genderNumber = 0;
    }

    //기존 카카오 계정이 있으면 로그인 시켜주는 함수
    if ((await checkKakaoUserAndLogin(kakaoUserId, next, res)) == true) {
      return;
    }

    //Nickname 중복검사
    if (await checkDuplicateOfNickname(nickname, next)) {
      errMsg = 
      (lang === 'ko' || lang === undefined)
      ? '닉네임이 이미 존재합니다'
      : 'Nickname is already exist.'
      return next(
        customizedError(errMsg, 400)
      );
    }

    //중복검사 통과
    try {
      //유저 정보 저장
      //카카오 유저가 성별을 제공했을 경우
      if (genderNumber == 0 || 1) {
        await insertUser(genderNumber, profile_image_url);
        return await checkKakaoUserAndLogin(kakaoUserId, next, res);
      }
      //카카오 유저가 성별을 제공 안했을 경우
      await insertUser('', profile_image_url);
      return await checkKakaoUserAndLogin(kakaoUserId, next, res);
    } catch (err) {
      return next(customizedError(err, 400));
    }
  } catch (err) {
    return next(customizedError(err.message, 500));
  }
};

const checkUserNickname = async (req, res, next) => {
  const { nickname } = req.body;
  if (await checkDuplicateOfNickname(nickname, next)) {
    return res.status(200).json({
      Msg: true,
    });
  } else {
    return res.status(200).json({
      Msg: false,
    });
  }
};

const modifyUser = async (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const userInfo = req.user;
  const { nickname, mbtiId, maleYN } = req.body;
  const lang = req.headers['language'];
  let errMsg;

  if (userInfo !== userId) {
    errMsg = 
    (lang === 'ko' || lang === undefined)
    ? '잘못된 접근입니다'
    : 'Invalid Request'
    
    return next(customizedError(errMsg, 400));
  }

  const userImage =
    req.file === undefined ? 'null' : req.file.transforms[0].location;
  try {
    const result = await pool.query(
      modifyUserQuery(userId, nickname, mbtiId, maleYN, userImage)
    );
    const [userInformation] = await pool.query(
      getUserInformationById(userInfo)
    );
    return res.status(200).json({ ...userInformation[0] });
  } catch (err) {
    return next(customizedError(err, 500));
  }
};

module.exports = {
  registUser,
  authUser,
  checkUser,
  deleteUser,
  kakaoLogin,
  checkUserNickname,
  modifyUser,
};
