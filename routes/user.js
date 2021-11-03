const express = require('express');
const router = express.Router({ mergeParams: true });
const addPostRouter = require('./favorite');
const validationUser = require('../middlewares/validationUser');
const {
  registUser,
  authUser,
  checkUser,
  deleteUser,
} = require('../controllers/user');

/* GET users listing. */
router.post('/register', validationUser, registUser);
router.post('/auth', authUser);
router.post('/check/auth', checkUser);
router.delete('/:userId', deleteUser);
//찜한 포스트 조회
// router.get('/:userId/favorites');
//가본 리스트 조회
// router.get('/:userId/visitedPosts');

router.use('/:userId/posts/:postId', addPostRouter);

module.exports = router;
