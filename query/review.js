const updateReviewDeleteYn = (postId, reviewId) => {
  return `
UPDATE Reviews SET delete_yn = 1 WHERE review_id="${reviewId}" AND post_id="${postId}"
`;
};
module.exports = { updateReviewDeleteYn };
