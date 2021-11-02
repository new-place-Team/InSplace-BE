const express = require('express');
const router = express.Router();
const validationUser = require('../middlewares/validationUser');

const {
  registUser,
  authUser,
  checkUser,
  deleteUser,
} = require('../controllers/user');
/* GET users listing. */
router.post('/register', validationUser, registUser);
router.post('/auth', authUser);
router.post('/check/auth', checkUser);
router.delete('/:userId', deleteUser);

module.exports = router;
