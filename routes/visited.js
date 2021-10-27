const express = require('express');
const router = express.Router({ mergeParams: true });
const { isAuth } = require('../middlewares/auth');
const { addVisitedList } = require('../controllers/post');

router.post('/', isAuth, addVisitedList);

module.exports = router;
