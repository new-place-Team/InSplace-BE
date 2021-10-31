const { pool } = require('../models/index');
const {
  queryOfAddingFavorite,
  queryOfDeletingFavorite,
} = require('../query/favorite');
const { customizedError } = require('./error');
const schemas = require('../middlewares/validation');
/* 포스트 찜하기 추가 */
const addFavorite = async (req, res, next) => {
  const userId = req.user;
  const postId = req.params.postId;

  /* validation check */
  try {
    await schemas.validateAsync({ userId, postId });
  } catch (err) {
    return next(customizedError(err, 400));
  }
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const params = [userId, postId];
    await connection.query(queryOfAddingFavorite, params);
    return res.sendStatus(201);
  } catch (err) {
    /* Bad Request */
    return next(customizedError(err, 400));
  } finally {
    await connection.release();
  }
};
/* 포스트 찜하기 삭제*/
const deleteFavorite = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user;

  /* validation check */
  try {
    await schemas.validateAsync({ userId, postId });
  } catch (err) {
    return next(customizedError(err, 400));
  }

  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const params = [userId, postId];
    await connection.query(queryOfDeletingFavorite, params);
    return res.sendStatus(200);
  } catch (err) {
    /* Bad Request */
    return next(customizedError(err, 400));
  } finally {
    await connection.release();
  }
};

module.exports = {
  addFavorite,
  deleteFavorite,
};
