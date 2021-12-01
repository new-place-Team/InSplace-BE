const express = require('express');
const router = express.Router({ mergeParams: true });
const { isAuth } = require('../middlewares/auth');
const { addReport } = require('../controllers/report');

/* report 라우터 */
router.post('/', isAuth, addReport);

module.exports = router;
