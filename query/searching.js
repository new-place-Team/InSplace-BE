const weatherQuery = `SELECT description FROM Weathers WHERE weather_id=?`;
const categoryQuery = `SELECT description FROM Categories WHERE category_id=?`;
const memberQuery = `SELECT description FROM MemberCnt WHERE member_id=?`;
const genderQuery = `SELECT description FROM Genders WHERE gender_id=?`;

/* 조건 결과 페이지 조회 */
const queryOfResultPageOfCondition = `
SELECT 
Posts.post_id AS postId, 
title, address_short AS addressShort,
favorite_cnt AS favoriteCnt, 
post_images AS postImage, 
inside_yn AS insideYN,
Categories.description AS category, 
permission_state AS permissionState, 
	CASE WHEN b.user_id = ? THEN 1 
	ELSE 0 
	END AS favoriteState,
post_loc_x AS postLocationX, 
post_loc_y AS postLocationY
FROM Posts 
INNER JOIN Genders 
ON Posts.gender_id = Genders.gender_id
INNER JOIN Weathers
ON Posts.weather_id = Weathers.weather_id
INNER JOIN MemberCnt
ON Posts.member_id = MemberCnt.member_id
INNER JOIN Categories 
ON Posts.category_id = Categories.category_id
LEFT JOIN (
	SELECT post_id, user_id
    FROM Favorites
    where user_id = ?
) b 
ON Posts.post_id = b.post_id
WHERE  Weathers.description
LIKE CONCAT('%', (${weatherQuery}),'%')
AND Categories.description
LIKE CONCAT('%', (${categoryQuery}), '%')
AND MemberCnt.description
LIKE CONCAT('%', (${memberQuery}), '%')
AND Genders.description 
LIKE CONCAT('%', (${genderQuery}), '%')
  `;

const queryOfGettingTotalPageNum = `
SELECT 
count(Posts.post_id) AS pageNum, 
title, address_short AS addressShort,
favorite_cnt AS favoriteCnt, 
post_images AS postImage, 
inside_yn AS insideYN,
Categories.description AS category, 
permission_state AS permissionState, 
	CASE WHEN b.user_id = ? THEN 1 
	ELSE 0 
	END AS favoriteState,
post_loc_x AS postLocationX, 
post_loc_y AS postLocationY
FROM Posts 
INNER JOIN Genders 
ON Posts.gender_id = Genders.gender_id
INNER JOIN Weathers
ON Posts.weather_id = Weathers.weather_id
INNER JOIN MemberCnt
ON Posts.member_id = MemberCnt.member_id
INNER JOIN Categories ON Posts.category_id = Categories.category_id
LEFT JOIN (
	SELECT post_id, user_id
    FROM Favorites
    where user_id = ?
) b 
ON Posts.post_id = b.post_id
WHERE  Weathers.description
LIKE CONCAT('%', (${weatherQuery}),'%')
AND Categories.description
LIKE CONCAT('%', (${categoryQuery}), '%')
AND MemberCnt.description
LIKE CONCAT('%', (${memberQuery}), '%')
AND Genders.description 
LIKE CONCAT('%', (${genderQuery}), '%')
AND inside_yn = ?
`;
/* 조건 결과 상세 페이지 조회 쿼리(실내외 구분) */
const queryOfDetailPageOfInOutDoors = `
SELECT 
Posts.post_id AS postId, 
title, address_short AS addressShort,
favorite_cnt AS favoriteCnt, 
post_images AS postImage, 
inside_yn AS insideYN,
Categories.description AS category, 
permission_state AS permissionState, 
	CASE WHEN b.user_id = ? THEN 1 
	ELSE 0 
	END AS favoriteState,
post_loc_x AS postLocationX, 
post_loc_y AS postLocationY
FROM Posts 
INNER JOIN Genders 
ON Posts.gender_id = Genders.gender_id
INNER JOIN Weathers
ON Posts.weather_id = Weathers.weather_id
INNER JOIN MemberCnt
ON Posts.member_id = MemberCnt.member_id
INNER JOIN Categories ON Posts.category_id = Categories.category_id
LEFT JOIN (
	SELECT post_id, user_id
    FROM Favorites
    where user_id = ?
) b 
ON Posts.post_id = b.post_id
WHERE  Weathers.description
LIKE CONCAT('%', (${weatherQuery}),'%')
AND Categories.description
LIKE CONCAT('%', (${categoryQuery}), '%')
AND MemberCnt.description
LIKE CONCAT('%', (${memberQuery}), '%')
AND Genders.description 
LIKE CONCAT('%', (${genderQuery}), '%')
AND inside_yn = ?
LIMIT ?, 16;
`;

const queryOfResultPageOfTotal = `
SELECT 
Posts.post_id AS postId, 
title, 
address_short AS addressShort, 
favorite_cnt AS favoriteCnt, 
post_images AS postImage,
Categories.description AS category, 
permission_state AS permissionState,
	CASE WHEN b.user_id = ? THEN 1 
    ELSE 0 END AS favoriteState,
post_loc_x AS postLocationX, 
post_loc_y AS postLocationY
FROM Posts
LEFT JOIN Categories 
ON Posts.category_id = Categories.category_id
LEFT JOIN (
	SELECT post_id, user_id
    FROM Favorites
    where user_id = ?
) b 
ON Posts.post_id = b.post_id
WHERE title LIKE CONCAT('%', ?, '%')
OR post_desc LIKE CONCAT('%', ?, '%')
LIMIT ?, 16;
`;
module.exports = {
  queryOfResultPageOfCondition,
  queryOfDetailPageOfInOutDoors,
  queryOfResultPageOfTotal,
  queryOfGettingTotalPageNum,
};
