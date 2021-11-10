const express = require('express');
const router = express.Router();
const {
  getAdminPage,
  modifyPost,
  deletePost,
  getEmptyPage
} = require('../controllers/admin');
const postUpload = require('../middlewares/postImageUpload');

/* admin Page 불러오기 */
router.get('/', getAdminPage);
router.patch('/posts/:postId', modifyPost);
router.delete('/posts/:postId', deletePost);
router.post('/posts', postUpload.array('postImages', 10), getEmptyPage);

module.exports = router;
