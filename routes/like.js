const express = require('express');
const router = express.Router({ mergeParams: true });
const { addLike, cancelLike } = require('../controllers/like');
const { isAuth, justCheckAuth } = require('../middlewares/auth');

/* Add Like API */
router.post('/', isAuth, addLike);

/* cancel Like API */
router.delete('/', isAuth, cancelLike);

module.exports = router;
