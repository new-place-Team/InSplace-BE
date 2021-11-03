const express = require('express');
const router = express.Router({ mergeParams: true });
const { isAuth } = require('../middlewares/auth');
const {
  addVisitedPosts,
  deleteVisitedPosts,
} = require('../controllers/visited');

/* 가본 장소 리스트에 추가 */
router.post('/', isAuth, addVisitedPosts);

/* 가본 장소 리스트에서 삭제  */
router.delete('/', isAuth, deleteVisitedPosts);

module.exports = router;
