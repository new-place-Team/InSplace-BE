const express = require('express');
const router = express.Router({ mergeParams: true });

const { justCheckAuth } = require('../middlewares/auth');
const {
  getResultPageOfCondition,
  getDetailPageOfInOutDoors,
} = require('../controllers/searching');

/* 조건 결과 페이지 조회 라우터 */

/* 조건 결과 상세 페이지 조회(실내외 구분) */
router.get('/page/:number/condition', getDetailPageOfInOutDoors);

module.exports = router;
