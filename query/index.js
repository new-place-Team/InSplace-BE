const getUserFavoriteQuery = (userId, lang) => {
  if(lang === 'ko' || lang === undefined){
    return `
      SELECT DISTINCT Posts.post_id AS postId, 
      Posts.title, 
      Posts.category_id AS categoryId, 
      Posts.post_images AS postImage
      FROM Posts 
        LEFT JOIN Favorites
        ON Posts.post_id = Favorites.post_id
      WHERE Favorites.user_id = ${userId}
      `;
  } else {
    return `
    SELECT DISTINCT Posts.post_id AS postId, 
      Posts.title_en AS title, 
      Posts.category_id AS categoryId, 
      Posts.post_images AS postImage
      FROM Posts 
        LEFT JOIN Favorites
        ON Posts.post_id = Favorites.post_id
      WHERE Favorites.user_id = ${userId}
    `
  }
};

const getUserVisitedQuery = (userId, lang) => {
  if(lang === 'ko' || lang === undefined){
    return `
    SELECT DISTINCT Posts.post_id AS postId, 
    Posts.title, 
    Posts.category_id AS categoryId, 
    Posts.post_images AS postImage
    FROM Posts 
    LEFT JOIN VisitedPosts
    ON Posts.post_id = VisitedPosts.post_id
    WHERE VisitedPosts.user_id = ${userId}
    `;
  } else {
    return `
    SELECT DISTINCT Posts.post_id AS postId, 
    Posts.title_en AS title, 
    Posts.category_id AS categoryId, 
    Posts.post_images AS postImage
    FROM Posts 
    LEFT JOIN VisitedPosts
    ON Posts.post_id = VisitedPosts.post_id
    WHERE VisitedPosts.user_id = ${userId}
    `;
  }
 
};
module.exports = {
  getUserFavoriteQuery,
  getUserVisitedQuery,
};
