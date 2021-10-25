const express = require('express');
const router = express.Router({ mergeParams: true });
const { addLike, cancelLike } = require('../controllers/like');

/* Add Like API */
router.post('/', addLike);

/* cancel Like API */
router.delete('/', cancelLike);

module.exports = router;
