const { pool } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const customizedError = require('../controllers/error');
const {
  getKakaoToken,
  getKakaoUserInformation,
} = require('../KakaoCall/kakaoLoginApi');
const {
  checkDuplicateOfNickname,
  checkKakaoUserAndLogin,
} = require('../KakaoCall/kakaoFunction');
const {
  insertNewUserforKakao,
  getUsers,
  checkMBTI,
  insertNewUser,
  getUserInformation,
  getUserInformationById,
  updateUserDeleteYn,
  getUserFavoriteQuery,
  getUserVisitedQuery,
  getKakaoUser,
} = require('../query/user');
const registUser = async (req, res, next) => {
  const { email, nickname, password, maleYN, mbtiId } = req.user;

  // Email 중복 검사 함수 선언
  const checkDuplicateOfEmail = async (email) => {
    try {
      const [result] = await pool.query(getUsers(email, ''));
      return result[0];
    } catch (err) {
      return next(customizedError(err, 400));
    }
  };

  // Nickname 중복 검사 함수 선언
  const checkDuplicateOfNickname = async (nickname) => {
    try {
      const [result] = await pool.query(getUsers('', nickname));
      return result[0];
    } catch (err) {
      return next(customizedError(err, 400));
    }
  };

  //Email 중복검사
  if (await checkDuplicateOfEmail(email)) {
    return next(customizedError('이메일이 이미 존재합니다', 400));
  }
  //Nickname 중복검사
  if (await checkDuplicateOfNickname(nickname)) {
    return next(customizedError('닉네임이 이미 존재합니다 중복검사 에러', 400));
  }
  //중복검사 통과
  try {
    //mbti id검사
    const [data] = await pool.query(checkMBTI(mbtiId));
    //비밀번호 암호화
    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.HASH_SALT)
    );
    //유저 정보 저장
    pool
      .query(
        insertNewUser(email, nickname, hashPassword, maleYN, data[0].mbti_id)
      )
      .then((data) => {
        return res.sendStatus(201);
      })
      .catch((err) => {
        return next(customizedError(err, 400));
      });
  } catch (err) {
    return next(customizedError(err, 400));
  }
};

const authUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //유저가 입력한 이메일로 해쉬된 비밀번호 가져오기
    const [userPasswordAndId] = await pool.query(getUserInformation(email));

    //해쉬된 비밀번호가 없는경우는 이메일이 없는경우이므로 로그인 실패
    if (userPasswordAndId.length == 0) {
      return next(customizedError('Email 혹은 Password가 틀렸습니다', 400));
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
      const token = jwt.sign({ user_id }, process.env.SECRET_KEY, {
        expiresIn: '60m',
      });

      return res.status(201).json({
        userId: user_id,
        token,
        nickname,
        mbti: description,
        userImage: user_image,
        email: dbUserEmail,
      });
    }
    //비밀번호가 틀려서 로그인 실패

    return next(customizedError('Email 혹은 Password가 틀렸습니다', 400));
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
  try {
    const result = await pool.query(updateUserDeleteYn(req.params.userId));
    if (result[0].changedRows == 0) {
      return next(customizedError('이미 탈퇴된 회원입니다.', 400));
    }
    return res.sendStatus(200);
  } catch (err) {
    return next(customizedError(err.message, 500));
  }
};

const getFavoritesPosts = async (req, res, next) => {
  const userId = parseInt(req.params.userId);

  const adjImg = (result) => {
    let resultImg = result[0];
    for (let i = 0; i < resultImg.length; i++) {
      resultImg[i].post_images = result[0][i].post_images
        .split('&&')
        .slice(1)[0];
    }
    return resultImg;
  };

  try {
    if (!req.user !== userId) {
      return next(customizedError('잘못된 접근입니다', 400)); //현재 로그인 한 사람의 아이디와 파라미터 값이 틀릴때
    }
    const result = await pool.query(getUserFavoriteQuery(req.params.userId));
    const favoriteList = adjImg(result);
    return res.status(200).json({
      favoriteList,
    });
  } catch (err) {
    return next(customizedError(err.message, 500));
  }
};

const getVisitedPosts = async (req, res, next) => {
  const userId = parseInt(req.params.userId);

  const adjImg = (result) => {
    let resultImg = result[0];
    for (let i = 0; i < resultImg.length; i++) {
      resultImg[i].post_images = result[0][i].post_images
        .split('&&')
        .slice(1)[0];
    }
    return resultImg;
  };

  try {
    if (!req.user !== userId) {
      return next(customizedError('잘못된 접근입니다', 400)); //현재 로그인 한 사람의 아이디와 파라미터 값이 틀릴때
    }
    const result = await pool.query(getUserVisitedQuery(req.params.userId));
    const visitedList = adjImg(result);
    return res.status(200).json({
      visitedList,
    });
  } catch (err) {
    return next(customizedError(err.message, 500));
  }
};

const kakaoLogin = async (req, res, next) => {
  try {
    const success = await getKakaoToken(req.body.code);

    const getKakaoUserResult = await getKakaoUserInformation(
      success.data.access_token
    );

    const {
      id: kakaoUserId,
      properties: { nickname, profile_image },
    } = getKakaoUserResult.data;

    //kakao user가 있으면 로그인 시켜주는 함수
    if ((await checkKakaoUserAndLogin(kakaoUserId, next, res)) == true) {
      return;
    }

    //Nickname 중복검사
    if (await checkDuplicateOfNickname(nickname, next)) {
      return next(
        customizedError('닉네임이 이미 존재합니다 중복검사 에러', 400)
      );
    }

    //중복검사 통과
    try {
      //유저 정보 저장
      await pool.query(
        insertNewUserforKakao(kakaoUserId, profile_image, nickname)
      );
      return await checkKakaoUserAndLogin(kakaoUserId, next, res);
    } catch (err) {
      return next(customizedError(err, 400));
    }
  } catch (err) {
    return next(customizedError(err, 500));
  }
};

module.exports = {
  registUser,
  authUser,
  checkUser,
  deleteUser,
  getFavoritesPosts,
  getVisitedPosts,
  kakaoLogin,
};
