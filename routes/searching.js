const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  searchMain,
  getResultPageOfCondition,
} = require('../controllers/searching');

/* 메인 페이지 조회. */
router.get('/main', searchMain);

/* 조건 결과 페이지 조회 라우터 */
router.get('/condition', getResultPageOfCondition);

module.exports = router;
