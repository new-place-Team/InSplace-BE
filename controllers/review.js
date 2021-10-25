const logger = require('../config/logger');
const {db} = require('../models/index');

/* 리뷰 등록 함수 */ 

const postingReview = async(req, res) => {
  const postId = req.params.postId;
  const review_images = req.file.transforms[0].location;
  const {review_desc, revisit_yn} = req.body
  try{
    const ReviewQuery = `
    INSERT INTO 
    Reviews(post_id, review_images, review_desc, revisit_yn, review_delete_yn)
    VALUES(?, ?, ?, ?, ?)
    `;
    await db.query(ReviewQuery, [postId, review_images, review_desc, revisit_yn, 0], (err, rows, fields) => {});
    return res.status(201).json({
      success: true,
    });
  } catch(err) {
    logger.error('리뷰 등록에서 예상치 못한 에러가 발생했습니다:', err);
    return res.status(400).json({
      success: false,
      errMsg: `리뷰 등록에서 예상치 못한 에러가 발생했습니다: ${err}`,
    });
  } finally {
    db.release(); // db 회수
  }
}

module.exports = {
  postingReview,
}