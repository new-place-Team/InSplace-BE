const addReviewLikes = (reviewId, userId) => {
  return `
    INSERT INTO ReviewLikes (user_id, review_id) VALUES (${userId}, ${reviewId})
    `;
};

const updateReviewLikeCnt = (reviewId) => {
  return `
    UPDATE Reviews SET like_cnt = like_cnt + 1
    WHERE review_id = ${reviewId};
    `;
};

const queryOfGettingReviewLikes = (userId, reviewId) => {
  return `
    SELECT * FROM ReviewLikes
    WHERE review_id=${reviewId} 
    AND user_id=${userId}
  `;
};

const queryOfDecreasingReviewLikeCnt = `
  UPDATE Reviews SET 
  like_cnt = CASE WHEN like_cnt <= 0
  THEN 0 ELSE like_cnt - 1 END
  WHERE review_id = ?
  `;

const queryOfDeletingReviewLikes = `
  DELETE FROM ReviewLikes WHERE user_id=? AND review_id=?
`;

module.exports = {
  addReviewLikes,
  updateReviewLikeCnt,
  queryOfGettingReviewLikes,
  queryOfDecreasingReviewLikeCnt,
  queryOfDeletingReviewLikes,
};
