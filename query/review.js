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
  post_id AS postId, Reviews.review_id AS reviewId, Users.user_image AS userImage,
  nickname, 
  CASE WHEN Users.male_yn=1  THEN '남자' ELSE '여자' END AS gender,
  Mbti.description AS mbti,
  review_images AS reviewImages, review_desc AS reviewDesc,
  ReviewWeathers.description AS weather, weekday_yn AS weekdayYN, revisit_yn AS revisitYN,
  like_cnt AS likeCnt,
  CASE WHEN ReviewLikes.user_id=? THEN 1 ELSE 0 END AS likeState,
  created_at AS createdAt
  FROM Reviews
  LEFT JOIN Users
  ON Reviews.user_id = Users.user_id
  LEFT JOIN ReviewLikes 
  ON Reviews.review_id = ReviewLikes.review_id 
  LEFT JOIN ReviewWeathers 
  ON Reviews.r_weather_id = ReviewWeathers.r_weather_id
  INNER JOIN Mbti
  ON Users.mbti_id = Mbti.mbti_id
  WHERE Reviews.user_id=? and Reviews.review_id=? and post_id=?;
`;

module.exports = {
  updateReviewDeleteYn,
  queryOfRegistingReview,
  queryOfModifyingReview,
  queryOfGettingReview,
};
