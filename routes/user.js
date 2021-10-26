const express = require('express');
const router = express.Router();
const valudationUser = require('../middlewares/valudationUser');
const { registUser, authUser } = require('../controllers/user');
/* GET users listing. */
router.post('/register', valudationUser, registUser);
router.post('/auth', authUser);

module.exports = router;
