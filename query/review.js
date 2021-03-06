const updateReviewDeleteYn = (postId, reviewId, userId) => {
  return `
UPDATE Reviews SET delete_yn = 1 WHERE review_id = ${reviewId} AND post_id = ${postId} AND user_id = ${userId}
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

/* Review 한개를 가져오는 쿼리 */
const queryOfGettingReview = `
SELECT
post_id AS postId, 
Reviews.review_id AS reviewId, 
Users.user_image AS userImage,
nickname, 
CASE
  WHEN Users.male_yn = 1
  THEN '남자'
  WHEN Users.male_yn = 0
  THEN '여자'
  END AS gender,
Mbti.description AS mbti,
review_images AS reviewImages, review_desc AS reviewDesc,
r_weather_id AS weather, 
weekday_yn AS weekdayYN, 
revisit_yn AS revisitYN,
like_cnt AS likeCnt,
CASE WHEN b.user_id= ? THEN 1 
ELSE 0 
END AS likeState,
created_at AS createdAt
FROM Reviews
LEFT JOIN Users
ON Reviews.user_id = Users.user_id
LEFT JOIN (
	SELECT review_id, user_id
    FROM ReviewLikes
    where user_id = ?
) b 
ON Reviews.review_id = b.review_id 
INNER JOIN Mbti
ON Users.mbti_id = Mbti.mbti_id
WHERE Reviews.user_id= ?
AND Reviews.review_id= ?
AND post_id= ?;
`;

const quertOfGettingReviewLastPage = (postId) => {
  return `SELECT COUNT(*) AS lastPage FROM Reviews WHERE post_id=${postId} and delete_yn=0`;
};

const queryOfGettingReviewsByOrder = (postId, userId, pageNum, orderBy) => {
  return `
SELECT 
Reviews.user_Id AS userId, 
Reviews.review_id AS reviewId,
Users.user_image AS userImage,
nickname,
CASE
  WHEN Users.male_yn = 1
  THEN '남자'
  WHEN Users.male_yn = 0
  THEN '여자'
  END AS gender,
Mbti.description AS mbti,
review_images AS reviewImages, 
review_desc AS reviewDesc, 
ReviewWeathers.description AS weather,
weekday_yn AS weekdayYN,
revisit_yn AS revisitYN,
like_cnt AS likeCnt,
CASE 
WHEN b.user_id = ${userId}
THEN 1
ELSE 0
END AS likeState,
created_at AS createdAt
FROM Reviews
LEFT JOIN (
	SELECT review_id, user_id
    FROM ReviewLikes
    where user_id = ${userId}
) b 
ON Reviews.review_id = b.review_id 
INNER JOIN ReviewWeathers ON
  Reviews.r_weather_id = ReviewWeathers.r_weather_id
INNER JOIN Users ON
  Reviews.user_id = Users.user_id 
INNER JOIN Mbti ON
Mbti.mbti_id = Users.mbti_id
WHERE post_id =${postId} 
AND Reviews.delete_yn =0
ORDER BY ${orderBy} DESC 
LIMIT ${(pageNum - 1) * 6} , 6
`;
};

const queryOfGettingWritingPageOfReview = `
  SELECT post_id AS postId, post_images AS postImage, Categories.description AS category,
  title 
  FROM Posts
  INNER JOIN Categories ON Posts.category_id = Categories.category_id
  WHERE post_id = ?
`;

const queryOfGettingEditingPageOfReview = `
  SELECT post_id AS postId, review_id AS reviewId, review_images AS reviewImages,
  review_desc AS reviewDesc, r_weather_id AS weather, weekday_yn AS weekdayYN, revisit_yn AS revisitYN
  FROM Reviews 
  WHERE review_id=?
`;

module.exports = {
  updateReviewDeleteYn,
  queryOfRegistingReview,
  queryOfModifyingReview,
  queryOfGettingReview,
  queryOfGettingReviewsByOrder,
  queryOfGettingWritingPageOfReview,
  queryOfGettingEditingPageOfReview,
  quertOfGettingReviewLastPage,
};
