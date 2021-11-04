const queryOfDeletingVisitedPost = `
  DELETE FROM VisitedPosts WHERE user_id=? AND post_id=?;
`;

const queryOfGettingVisitedData = `
  SELECT * FROM VisitedPosts WHERE user_id=? AND post_id=?
`;

module.exports = {
  queryOfDeletingVisitedPost,
  queryOfGettingVisitedData,
};
