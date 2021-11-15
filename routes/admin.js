const express = require('express');
const router = express.Router();
const {
  getAdminPage,
  modifyPost,
  deletePost,
} = require('../controllers/admin');

/* admin Page 불러오기 */
router.get('/', getAdminPage);
router.patch('/posts/:postId', modifyPost);
router.delete('/posts/:postId', deletePost);

module.exports = router;
