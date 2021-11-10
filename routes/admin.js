const express = require('express');
const router = express.Router();
const {
  getAdminPage,
  modifyPost,
  deletePost,
  getEmptyPage,
} = require('../controllers/admin');
const postUpload = require('../middlewares/postImageUpload');
const multipart = require('connect-multiparty')();
const heicToJpeg = require('heic-to-jpeg-middleware')();

/* admin Page 불러오기 */
router.get('/', getAdminPage);
router.patch('/posts/:postId', modifyPost);
router.delete('/posts/:postId', deletePost);
router.post('/posts', multipart, heicToJpeg, getEmptyPage);

module.exports = router;
