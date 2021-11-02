const updateReviewDeleteYn = (postId, reviewId, userId) => {
  return `
UPDATE Reviews SET delete_yn = 1 WHERE review_id = ${reviewId} AND post_id = ${postId} AND user_id = ${userId}
`;
};
module.exports = { updateReviewDeleteYn };
