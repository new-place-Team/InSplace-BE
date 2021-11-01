const express = require('express');
const router = express.Router();
const validationUser = require('../middlewares/validationUser');

const { registUser, authUser, checkUser } = require('../controllers/user');
/* GET users listing. */
router.post('/register', validationUser, registUser);
router.post('/auth', authUser);
router.post('/check/auth', checkUser);

module.exports = router;
