const weatherQuery = `SELECT description FROM Weathers WHERE weather_id=?`;
const categoryQuery = `SELECT description FROM Categories WHERE category_id=?`;
const memberQuery = `SELECT description FROM MemberCnt WHERE member_id=?`;
const genderQuery = `SELECT description FROM Genders WHERE gender_id=?`;

/* const queryOfResultPageOfCondition = `
  SELECT *
  FROM Posts 
  INNER JOIN Genders 
  ON Posts.gender_id = Genders.gender_id 
  INNER JOIN Weathers
  ON Posts.weather_id = Weathers.weather_id
  INNER JOIN MemberCnt
  ON Posts.member_id = MemberCnt.member_id
  INNER JOIN Categories ON Posts.category_id = Categories.category_id
  WHERE Genders.description 
  LIKE CONCAT('%', (${genderQuery}), '%') 
  AND Weathers.description
  LIKE CONCAT('%', (${weatherQuery}), '%')
  AND MemberCnt.description
  LIKE CONCAT('%', (${memberQuery}), '%')
  AND Categories.description
  LIKE CONCAT('%', (${categoryQuery}), '%');
  `; */

const queryOfResultPageOfCondition = `
  SELECT post_id, title, Weathers.description as weather, Categories.description as category, MemberCnt.description as memberCnt, Genders.description as gender
  FROM Posts 
  INNER JOIN Genders 
  ON Posts.gender_id = Genders.gender_id 
  INNER JOIN Weathers
  ON Posts.weather_id = Weathers.weather_id
  INNER JOIN MemberCnt
  ON Posts.member_id = MemberCnt.member_id
  INNER JOIN Categories ON Posts.category_id = Categories.category_id
  WHERE  Weathers.description
  LIKE CONCAT('%', (${weatherQuery}), '%')
  AND Categories.description
  LIKE CONCAT('%', (${categoryQuery}), '%')
  AND MemberCnt.description
  LIKE CONCAT('%', (${memberQuery}), '%')
  AND Genders.description 
  LIKE CONCAT('%', (${genderQuery}), '%');
  `;

module.exports = {
  queryOfResultPageOfCondition,
};