const addVisited = (userID, postID) => {
  return `INSERT INTO VisitedPosts
    (user_id, post_id)
    VALUES("${userID}","${postID}")`;
};
const findDetailPosts = (postID, userID) => {
  return `
  SELECT 
  post_images AS postImages, contact_number AS contactNumber,
   post_loc_x, post_loc_y, description, address, title,
   address_short AS addressShort, post_desc AS postDesc, favorite_cnt AS favoriteCnt,
   CASE WHEN Favorites.user_id = "${userID}"
   THEN 1
   ELSE 0
   END AS favoriteState ,
   CASE WHEN VisitedPosts.user_id = "${userID}"
   THEN 1
   ELSE 0
   END AS visitedStatus
   FROM Posts 
   INNER JOIN Categories 
   ON Posts.category_id = Categories.category_id   
   LEFT JOIN Favorites
   ON Posts.post_id = Favorites.post_id AND Favorites.user_id="${userID}"
   LEFT JOIN VisitedPosts
   ON Posts.post_id = VisitedPosts.post_id AND VisitedPosts.user_id="${userID}"
   WHERE Posts.post_id = "${postID}"

`;
};

const checkVisitedUser = (userID, postID) => {
  return `SELECT * FROM VisitedPosts WHERE user_id = "${userID}" AND post_id = "${postID}"`;
};

const findDetailReviews = (postID, userID) => {
  return `
  SELECT 
  Reviews.user_Id AS userId, review_images AS reviewImages, 
  review_desc AS reviewDesc, created_at AS createdAt,
  like_cnt AS likeCnt,
  description,
  CASE 
  WHEN ReviewLikes.user_id = "${userID}"
  THEN 1
  ELSE 0
  END AS likeStatus,
  CASE
  WHEN weekday_yn = 1
  THEN '주말'
  ELSE '평일'
  END AS '주말여부'
  FROM Reviews
  LEFT JOIN ReviewLikes ON
  Reviews.review_id = ReviewLikes.review_id AND ReviewLikes.user_id = "${userID}"
  INNER JOIN ReviewWeathers ON
  Reviews.r_weather_id = ReviewWeathers.r_weather_id
  WHERE post_id ="${postID}" AND delete_yn = "0"
  ORDER BY created_at DESC 
  LIMIT 8
`;
};
module.exports = {
  addVisited,
  findDetailPosts,
  findDetailReviews,
  checkVisitedUser,
};
