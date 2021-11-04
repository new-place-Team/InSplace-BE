const updateReviewDeleteYn = (postId, reviewId, userId) => {
  return `
UPDATE Reviews SET delete_yn = 1 WHERE review_id = ${reviewId} AND post_id = ${postId} AND user_id = ${userId}
`;
};
const addReviewLikes = (reviewId, userId) => {
  return `
  INSERT INTO ReviewLikes (user_id, review_id) VALUES (${userId}, ${reviewId})
  `;
};

const updateReviewsLikeCnt = (postId, reviewId, userId) => {
  return `
  UPDATE Reviews SET like_cnt = like_cnt + 1
  WHERE post_id = ${postId} AND review_id = ${reviewId} AND user_id = ${userId}
  `;
};

const queryOfRegistingReview = `
    INSERT INTO 
    Reviews(post_id, user_id, review_images, review_desc, weekday_yn, revisit_yn, r_weather_id)
    VALUES(?, ?, ?, ?, ?, ?, ?);
`;

const queryOfModifyingReview = `
  UPDATE Reviews 
  SET review_images=?, review_desc=?, weekday_yn=?, revisit_yn=?, r_weather_id=?
  WHERE review_id=? and user_id=? and post_id=?
`;

module.exports = {
  updateReviewDeleteYn,
  addReviewLikes,
  updateReviewsLikeCnt,
  queryOfRegistingReview,
  queryOfModifyingReview,
};
