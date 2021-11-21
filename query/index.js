const getUserFavoriteQuery = (userId) => {
  return `
    SELECT DISTINCT Posts.post_id AS postId, Posts.title, Posts.category_id AS categoryId, Posts.post_images AS postImage
    FROM Posts 
    LEFT JOIN Favorites
    ON Posts.post_id = Favorites.post_id
    WHERE Favorites.user_id = ${userId}
    `;
};

const getUserVisitedQuery = (userId) => {
  return `
    SELECT DISTINCT Posts.post_id AS postId, Posts.title, Posts.category_id AS categoryId, Posts.post_images AS postImage
    FROM Posts 
    LEFT JOIN VisitedPosts
    ON Posts.post_id = VisitedPosts.post_id
    WHERE VisitedPosts.user_id = ${userId}
    `;
};

/* Feedback 추가하는 쿼리문 */
const queryOfAddingFeedback = (userId, description) => {
  return `
      INSERT INTO
      Feedbacks(user_id, description) 
      VALUES(${userId}, '${description}');    
      `;
};

module.exports = {
  getUserFavoriteQuery,
  getUserVisitedQuery,
  queryOfAddingFeedback,
};
