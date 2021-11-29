const express = require('express');
const router = express.Router({ mergeParams: true });

const { justCheckAuth } = require('../middlewares/auth');
const {
  getMapDataOfResultPageOfInOutDoors,
  getMapDataOfResultPageOfTotal,
} = require('../controllers/map');

/* 토탈 결과 페이지 조회 */
router.get('/total', justCheckAuth, getMapDataOfResultPageOfTotal);
/* 조건 결과 상세 페이지 조회(실내외 구분) */
router.get('/condition', justCheckAuth, getMapDataOfResultPageOfInOutDoors);

module.exports = router;
