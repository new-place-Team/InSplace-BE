const express = require('express');
const router = express.Router();
const valudationUser = require('../middlewares/valudationUser');
const userRegist = require('../controllers/user');
/* GET users listing. */
router.post('/register', valudationUser, userRegist);

module.exports = router;
