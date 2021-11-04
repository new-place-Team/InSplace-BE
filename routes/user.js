const express = require('express');
const router = express.Router({ mergeParams: true });
const favoriteRouter = require('./favorite');
const visitedRouter = require('./visited');
const validationUser = require('../middlewares/validationUser');
const validationModifyUser = require('../middlewares/validationModifyUser');
const {
  getFavoritesPosts,
  getVisitedPosts,
  registUser,
  authUser,
  checkUser,
  deleteUser,
  kakaoLogin,
  modifyUser,
} = require('../controllers/user');

const { isAuth } = require('../middlewares/auth');
const upload = require('../controllers/imgUpload');
const userUpload = require('../controllers/userImgUpload')

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

/* 찜한 포스트 조회 */
router.get('/:userId/favorites', isAuth, getFavoritesPosts);

/* 가본 리스트 조회 */
router.get('/:userId/visitedPosts', isAuth, getVisitedPosts);

/* 찜하기 API로 이동 (추가삭제기능) */
router.use('/:userId/posts/:postId/favorites', favoriteRouter);

/* visited Post API로 이동 (추가삭제기능) */
router.use('/:userId/posts/:postId/visitedPosts', visitedRouter);

/* 유저 정보 수정 */
router.put('/:userId', isAuth, userUpload.single('userImage'), validationModifyUser, modifyUser);

module.exports = router;
