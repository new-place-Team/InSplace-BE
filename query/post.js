const addVisited = (userID, postID) => {
  return `INSERT INTO VisitedPosts
    (user_id, post_id)
    VALUES("${userID}","${postID}")`;
};
const findDetailPosts = (postID, userID) => {
  return `
  SELECT 
  Posts.post_id AS postId,
  post_images AS postImages, contact_number AS contactNumber,
  post_loc_x AS postLocationX, post_loc_y AS postLocationY ,Posts.category_id AS categoryId, address, title,
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
  Reviews.user_Id AS userId, 
  Reviews.review_id AS reviewId,
  Users.user_image AS userImage,
  nickname,
  CASE
  WHEN Users.male_yn = 1
  THEN '남자'
  ELSE '여자'
  END AS 'gender',
  Mbti.description AS mbti,
  review_images AS reviewImages, 
  review_desc AS reviewDesc, 
  ReviewWeathers.description AS weather,
  weekday_yn AS weekdayYN,
  revisit_yn AS revisitYN,
  like_cnt AS likeCnt,
  CASE 
  WHEN ReviewLikes.user_id = "${userID}"
  THEN 1
  ELSE 0
  END AS likeState,
  created_at AS createdAt
  FROM Reviews
  LEFT JOIN ReviewLikes ON
  Reviews.review_id = ReviewLikes.review_id AND ReviewLikes.user_id = "${userID}"
  INNER JOIN ReviewWeathers ON
  Reviews.r_weather_id = ReviewWeathers.r_weather_id
  INNER JOIN Users ON
  Reviews.user_id = Users.user_id 
  INNER JOIN Mbti ON
  Mbti.mbti_id = Users.mbti_id
  WHERE post_id ="${postID}" AND Reviews.delete_yn = "0"
  ORDER BY created_at DESC 
  LIMIT 6
`;
};
const findLastPage = (postId) => {
  return `
  SELECT COUNT(post_id) AS lastPage FROM Reviews WHERE Reviews.post_id = ${postId} AND Reviews.delete_yn = 0
  `;
};
module.exports = {
  addVisited,
  findDetailPosts,
  findDetailReviews,
  checkVisitedUser,
  findLastPage,
};
