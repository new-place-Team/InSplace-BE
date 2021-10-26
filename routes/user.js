const express = require('express');
const router = express.Router();
const validationUser = require('../middlewares/validationUser');
const { registUser, authUser } = require('../controllers/user');
/* GET users listing. */
router.post('/register', validationUser, registUser);
router.post('/auth', validationUser, authUser);

module.exports = router;
