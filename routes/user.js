const express = require('express');
const router = express.Router();
const validationUser = require('../middlewares/validationUser');
const registUser = require('../controllers/user');
/* GET users listing. */
router.post('/register', validationUser, registUser);

module.exports = router;
