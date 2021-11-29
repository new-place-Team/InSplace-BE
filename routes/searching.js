const express = require('express');
const router = express.Router({ mergeParams: true });

const { justCheckAuth } = require('../middlewares/auth');
const {
  getResultPageOfCondition,
  getDetailPageOfInOutDoors,
  getResultPageOfTotal,
} = require('../controllers/searching');

const mapRouter = require('./map');
/* maps Router */
router.use('/maps', mapRouter);
/* 토탈 결과 페이지 조회 */
router.get('/pages/:number/total', justCheckAuth, getResultPageOfTotal);

/* 조건 결과 페이지 조회 라우터 */
router.get('/condition', justCheckAuth, getResultPageOfCondition);
/* 조건 결과 상세 페이지 조회(실내외 구분) */
router.get(
  '/pages/:number/condition',
  justCheckAuth,
  getDetailPageOfInOutDoors
);

module.exports = router;
