const express = require('express');
const router = express.Router({ mergeParams: true });
const { showDetailPost } = require('../controllers/post');

router.get('/', showDetailPost);

module.exports = router;
