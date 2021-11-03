const express = require('express');
const router = express.Router();
const validationUser = require('../middlewares/validationUser');

const {
  registUser,
  authUser,
  checkUser,
  deleteUser,
  showFavorite,
  showVisited
} = require('../controllers/user');

const { isAuth } = require('../middlewares/auth')
/* GET users listing. */
router.post('/register', validationUser, registUser);
router.post('/auth', authUser);
router.post('/check/auth', checkUser);
router.delete('/:userId', deleteUser);
router.get('/:userId/favorites', showFavorite);
router.get('/:userId/visitedPosts', showVisited);

module.exports = router;
