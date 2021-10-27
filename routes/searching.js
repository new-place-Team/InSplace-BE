const express = require('express');
const router = express.Router({ mergeParams: true });

const { justCheckAuth } = require('../middlewares/auth');
const {
  searchMain,
  getResultPageOfCondition,
} = require('../controllers/searching');

/* 메인 페이지 조회. */
router.get('/', justCheckAuth, searchMain);

/* 조건 결과 페이지 조회 라우터 */
router.get('/condition', justCheckAuth, getResultPageOfCondition);

module.exports = router;
