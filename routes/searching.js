const express = require('express');
const router = express.Router({ mergeParams: true });

const { justCheckAuth } = require('../middlewares/auth');
const { getResultPageOfCondition } = require('../controllers/searching');

/* 조건 결과 페이지 조회 라우터 */
router.get('/condition', justCheckAuth, getResultPageOfCondition);

module.exports = router;
