const logger = require('../config/logger');
const {db} = require('../models/index');

/* 리뷰 등록 함수 */ 

const postingReview = async(req, res) => {
  const postId = req.params.postId;
  const reviewImages = req.file.transforms[0].location;
  const {review_desc, revisit_yn} = req.body;
  const params = [
    postId,
    reviewImages,
    reviewImages,
    review_desc,
    revisit_yn
  ]
  try{
    const reviewQuery = `
    INSERT INTO 
    Reviews(post_id, review_images, review_desc, revisit_yn, review_delete_yn)
    VALUES(?, ?, ?, ?, ?)
    `;
    await db.query(reviewQuery, params);
    return res.status(201).json({
      success: true,
    });
  } catch(err) {
    logger.error('리뷰 등록에서 예상치 못한 에러가 발생했습니다:', err);
    return res.status(400).json({
      success: false,
      errMsg: `리뷰 등록에서 예상치 못한 에러가 발생했습니다: ${err}`,
    });
  } 
}

module.exports = {
  postingReview,
}