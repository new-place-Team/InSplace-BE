const express = require('express');
const router = express.Router({ mergeParams: true });

const { justCheckAuth } = require('../middlewares/auth');
const {
  getResultPageOfCondition,
  getDetailPageOfInOutDoors,
} = require('../controllers/searching');

/* 조건 결과 페이지 조회 라우터 */

<<<<<<< HEAD
router.get('/condition', justCheckAuth, getResultPageOfCondition);
router.get('/page/:pageNumber/condition', (req, res) => {
  console.log('hi');
});
=======
/* 조건 결과 상세 페이지 조회(실내외 구분) */
router.get('/page/:number/condition', getDetailPageOfInOutDoors);

>>>>>>> 31f16955e804f6468e0cd31c491bafa0e4bbea45
module.exports = router;
