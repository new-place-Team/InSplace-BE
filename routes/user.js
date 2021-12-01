const express = require('express');
const router = express.Router({ mergeParams: true });
const validationUser = require('../middlewares/validationUser');
const validationModifyUser = require('../middlewares/validationModifyUser');
const {
  registUser,
  authUser,
  checkUser,
  deleteUser,
  kakaoLogin,
  checkUserNickname,
  modifyUser,
} = require('../controllers/user');

const { isAuth } = require('../middlewares/auth');
const upload = require('../controllers/imgUpload');
const userUpload = require('../controllers/userImgUpload');
const { addUserReport } = require('../controllers/report');

/* 회원 가입 */

router.post('/register', validationUser, registUser);
/* 로그인  */
router.post('/auth', authUser);

//카카오 로그인
router.get('/kakao/auth', kakaoLogin);

/* 로그인 체크 */
router.post('/check/auth', checkUser);

/* 회원 탈퇴 */
router.delete('/:userId', isAuth, deleteUser);

/* 유저 닉네임 체크*/
router.post('/check/nickname', checkUserNickname);

//유저 리폿 라우터
router.post('/report', isAuth, addUserReport);

/* 유저 정보 수정 */
router.put(
  '/:userId/info',
  isAuth,
  userUpload.single('userImage'),
  validationModifyUser,
  modifyUser
);

module.exports = router;
