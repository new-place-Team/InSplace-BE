const express = require('express');
const router = express.Router({ mergeParams: true });
const { isAuth } = require('../middlewares/auth');
const { addFavorite, deleteFavorite } = require('../controllers/favorite');
const { addVisitedList } = require('../controllers/post');

//포스트 찜하기 추가
router.post('/favorites', isAuth, addFavorite);
//포스트 찜하기 삭제
router.delete('/favorites', isAuth, deleteFavorite);

//가본 장소 리스트에 추가
router.post('/visitedPosts', isAuth, addVisitedList);
//가본 장소 리스트에서 삭제
// router.delete('/visitedPosts');

module.exports = router;
