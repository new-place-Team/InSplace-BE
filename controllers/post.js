const logger = require('../config/logger');
const { pool } = require('../models/index');
/* 가본 장소 리스트에 추가 */
const addVisitedList = (req, res) => {
  try {
    const query = `
    INSERT INTO VisitedPosts()
    `;
  } catch (err) {
    logger.error(`가본 장소 리스트 추가 API에서 발생한 오류: ${err}`);
    return res.status(400).json({
      success: false,
      errMsg: `가본 장소 리스트 추가 API에서 발생한 오류: ${err}`,
    });
  }
};

const showDetailPost = async (req, res) => {
  const { postId } = req.params;
  //상세페이지 찾는 쿼리
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
};
module.exports = {
  addVisitedList,
  showDetailPost,
};
