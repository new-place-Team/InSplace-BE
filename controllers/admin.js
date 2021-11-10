const { render } = require('ejs');
const logger = require('../config/logger');
const { pool } = require('../models/index');
const {
  adminPageQuery,
  editBtnQuery,
  deleteBtnQuery,
} = require('../query/admin');

/* columns 명들 가져오기 */
const getColumnNames = (post) => {
  const columns = [];
  for (key in post) {
    columns.push(key);
  }
  return columns;
};

/* Admin Page 불러오기 */
const getAdminPage = async (req, res) => {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    /* 포스트 조회 */
    const result = await connection.query(adminPageQuery);
    const posts = result[0];
    const columns = getColumnNames(posts[0]);
    res.render('admin', { posts, columns });
  } catch (err) {
    logger.error(`Admin Page 불러오기 API에서 발생한 에러 ${err}`);
    return res.status(400).render('admin', {
      success: false,
      errMsg: `Admin Page 불러오기 API에서 발생한 에러 ${err}`,
    });
  } finally {
    await connection.release();
  }
};

const modifyPost = async (req, res) => {
  const {
    title,
    address,
    address_short,
    contact_number,
    category_id,
    post_images,
    post_desc,
    post_loc_x,
    post_loc_y,
    favorite_cnt,
    weather_id,
    inside_yn,
    gender_id,
    member_id,
  } = req.body;

  const post_id = req.params.postId;
  const params = [
    title,
    address,
    address_short,
    contact_number,
    Number(category_id),
    post_images,
    post_desc,
    post_loc_x,
    post_loc_y,
    Number(favorite_cnt),
    Number(weather_id),
    Number(inside_yn),
    Number(gender_id),
    Number(member_id),
    Number(post_id),
  ];

  const connection = await pool.getConnection(async (conn) => conn);
  try {
    /* transaction 시작 */
    await connection.beginTransaction();
    /* 해당 포스트 수정 쿼리 */
    await connection.query(editBtnQuery, params);
    /* 전체 포스트 조회 쿼리 */
    const result = await connection.query(adminPageQuery);
    await connection.commit();
    const posts = result[0];
    const columns = getColumnNames(posts[0]);
    res.render('admin', { posts, columns });
  } catch (err) {
    logger.error(`admin:post수정 기능 중 발생한 에러: ${err}`);
    await connection.rollback();
    res.json({
      succcess: false,
      errMsg: `admin:post수정 기능 중 발생한 에러: ${err}`,
    });
  } finally {
    await connection.release();
  }
};

const deletePost = async (req, res) => {
  const params = [req.params.postId];
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    /* transaction 시작 */
    await connection.beginTransaction();
    /* 해당 포스트 수정 쿼리 */
    await connection.query(deleteBtnQuery, params);
    /* 전체 포스트 조회 쿼리 */
    const result = await connection.query(adminPageQuery);
    await connection.commit();
    const posts = result[0];
    const columns = getColumnNames(posts[0]);
    res.render('admin', { posts, columns });
  } catch (err) {
    logger.error(`admin:post수정 기능 중 발생한 에러: ${err}`);
    await connection.rollback();
    res.json({
      succcess: false,
      errMsg: `admin:post수정 기능 중 발생한 에러: ${err}`,
    });
  } finally {
    await connection.release();
  }
};

const getEmptyPage = (req, res, next) => {
  console.log('getEmptyPage');
  return res.json({ success: true });
};

module.exports = {
  getAdminPage,
  modifyPost,
  deletePost,
  getEmptyPage,
};
