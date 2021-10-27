const logger = require('../config/logger');
const { pool } = require('../models/index');
/* 가본 장소 리스트에 추가 */
const addVisitedList = async (req, res) => {
  try {
    await pool.query(
      `INSERT INTO VisitedPosts
       (user_id, post_id)
       VALUES(?,?)`,
      [req.user, req.params.postId]
    );
    const payload = {
      success: true,
    };
    res.status(200).json({ payload });
  } catch (err) {
    logger.error(`가본 장소 리스트 추가부분에서 에러:${err}`);
    res.status(400).json({
      success: false,
      errMsg: '가본 장소 리스트 추가부분에서 에러',
      err: err,
    });
  }
};

const showDetailPost = async (req, res) => {
  const { postId } = req.params;
  //상세페이지 찾는 쿼리
  try {
    const [result] = await pool.query(
      `SELECT title, post_images, post_loc_x, post_loc_y, description, address, address_short, post_desc, like_cnt FROM Posts 
     INNER JOIN Categories 
     ON Posts.category_id = Categories.category_id  
     WHERE post_id = ? `,
      [postId]
    );
    //payload
    const payload = { success: true, ...result[0] };
    res.status(200).json({ payload });
  } catch (err) {
    logger.error(`상세페이지 찾는쿼리에서 에러 : ${err}`);
    res.status(400).json({
      success: false,
      errMsg: '상세페이지 찾는 쿼리에서 에러',
      err: err,
    });
  }
};
module.exports = {
  addVisitedList,
  showDetailPost,
};
