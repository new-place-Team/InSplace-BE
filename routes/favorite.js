const express = require('express');
const router = express.Router({ mergeParams: true });
const { isAuth } = require('../middlewares/auth');
const { addFavorite, deleteFavorite } = require('../controllers/favorite');

/* 포스트 찜하기 추가 */
router.post('/', isAuth, addFavorite);

/* 포스트 찜하기 삭제*/
router.delete('/', isAuth, deleteFavorite);

module.exports = router;
