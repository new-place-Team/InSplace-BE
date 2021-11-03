const weatherQuery = `SELECT description FROM Weathers WHERE weather_id=?`;
const categoryQuery = `SELECT description FROM Categories WHERE category_id=?`;
const memberQuery = `SELECT description FROM MemberCnt WHERE member_id=?`;
const genderQuery = `SELECT description FROM Genders WHERE gender_id=?`;

const queryOfResultPageOfCondition = `
  SELECT Posts.post_id AS postId, title, address_short AS addressShort, favorite_cnt AS favoriteCnt, post_images AS postImage, inside_yn AS insideYN,
  Categories.description AS category, permission_state AS permissionState, 
  CASE WHEN Favorites.user_id = ? THEN 1 ELSE 0 END AS favoriteState 
  FROM Posts 
  INNER JOIN Genders 
  ON Posts.gender_id = Genders.gender_id
  INNER JOIN Weathers
  ON Posts.weather_id = Weathers.weather_id
  INNER JOIN MemberCnt
  ON Posts.member_id = MemberCnt.member_id
  INNER JOIN Categories ON Posts.category_id = Categories.category_id
  LEFT JOIN Favorites ON Posts.post_id = Favorites.post_id
  WHERE  Weathers.description
  LIKE CONCAT('%', (${weatherQuery}), '%')
  AND Categories.description
  LIKE CONCAT('%', (${categoryQuery}), '%')
  AND MemberCnt.description
  LIKE CONCAT('%', (${memberQuery}), '%')
  AND Genders.description 
  LIKE CONCAT('%', (${genderQuery}), '%')
  `;

/* 조건 결과 상세 페이지 조회 쿼리(실내외 구분) */

const queryOfDetailPageOfInOutDoors = `
  SELECT Posts.post_id AS postId, title, address_short AS addressShort, favorite_cnt AS favoriteCnt, post_images AS postImage,
  Categories.description AS category, permission_state AS permissionState,
  CASE WHEN Favorites.user_id = ? THEN 1 ELSE 0 END AS favoriteState 
  FROM Posts 
  INNER JOIN Genders 
  ON Posts.gender_id = Genders.gender_id 
  INNER JOIN Weathers
  ON Posts.weather_id = Weathers.weather_id
  INNER JOIN MemberCnt
  ON Posts.member_id = MemberCnt.member_id
  INNER JOIN Categories ON Posts.category_id = Categories.category_id
  LEFT JOIN Favorites ON Posts.post_id = Favorites.post_id
  WHERE  Weathers.description
  LIKE CONCAT('%', (${weatherQuery}), '%')
  AND Categories.description
  LIKE CONCAT('%', (${categoryQuery}), '%')
  AND MemberCnt.description
  LIKE CONCAT('%', (${memberQuery}), '%')
  AND Genders.description 
  LIKE CONCAT('%', (${genderQuery}), '%')
  AND inside_yn=?
  LIMIT 1, ?;
`;

const queryOfResultPageOfTotal = `
  SELECT Posts.post_id AS postId, title, address_short AS addressShort, favorite_cnt AS favoriteCnt, post_images AS postImage,
  Categories.description AS category, permission_state AS permissionState,
  CASE WHEN Favorites.user_id =? THEN 1 ELSE 0 END AS favoriteState
  FROM Posts
  LEFT JOIN Categories ON Posts.category_id = Categories.category_id
  LEFT JOIN Favorites ON Posts.post_id = Favorites.post_id
  WHERE title LIKE CONCAT('%', ?, '%')
  OR post_desc LIKE CONCAT('%', ?, '%')
  LIMIT 1, ?;
`;
module.exports = {
  queryOfResultPageOfCondition,
  queryOfDetailPageOfInOutDoors,
  queryOfResultPageOfTotal,
};
