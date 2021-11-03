const searchMainQuery = (weatherCondition, user) => {
  return `
SELECT DISTINCT
  Posts.post_id AS postId, 
  Posts.title, 
  Posts.address, 
  Posts.address_short AS addressShort, 
  Posts.contact_number AS contactNumber, 
  Posts.category_id AS categoryId, 
  Posts.post_images AS postImages,
  Posts.post_desc AS PostDesc,
  Posts.post_loc_x AS postLocationX, 
  Posts.post_loc_y AS postLocationY, 
  Posts.favorite_cnt AS favoriteCnt, 
  Posts.weather_id AS weatherId, 
  Posts.inside_yn AS insideYN, 
  Posts.gender_id AS genderId, 
  Posts.member_id AS MemberId, 
	CASE 
		WHEN Favorites.user_Id = ${user} THEN true 
		ELSE false 
    END as 'favoriteState'
FROM Posts 
LEFT JOIN Favorites
ON Posts.post_id = Favorites.post_id
LEFT JOIN VisitedPosts
ON Posts.post_id = VisitedPosts.post_id
WHERE weather_id IN(${weatherCondition}, 7)
  AND Posts.post_id NOT IN(
    SELECT post_id
    FROM(
      SELECT post_id
      FROM Posts
      ORDER BY favorite_cnt DESC limit 14
    ) as tempPosts 
  )
  AND Posts.post_id NOT IN (
    SELECT post_id
      FROM VisitedPosts
      WHERE VisitedPosts.user_id = ${user}
    )
  ORDER BY rand() limit 14

  `;
};

const likeQuery = (user) => {
  return `
SELECT DISTINCT
  Posts.post_id AS postId, 
	Posts.title, 
	Posts.address, 
  Posts.address_short AS addressShort, 
  Posts.contact_number AS contactNumber, 
  Posts.category_id AS categoryId, 
  Posts.post_images AS postImages,
  Posts.post_desc AS PostDesc,
  Posts.post_loc_x AS postLocationX, 
  Posts.post_loc_y AS postLocationY, 
  Posts.favorite_cnt AS favoriteCnt, 
  Posts.weather_id AS weatherId, 
  Posts.inside_yn AS insideYN, 
  Posts.gender_id AS genderId, 
  Posts.member_id AS MemberId, 
	CASE 
		WHEN Favorites.user_Id = ${user} THEN true 
		ELSE false 
    END as 'favoriteState'
FROM Posts 
LEFT JOIN Favorites
ON Posts.post_id = Favorites.post_id
WHERE Posts.post_id NOT IN (
	SELECT post_id
    FROM VisitedPosts
    WHERE VisitedPosts.user_id = ${user}
    )
ORDER BY favorite_cnt DESC limit 14
`;
}

const mdQuery = (user) => { 
  return `
SELECT DISTINCT
  Posts.post_id AS postId, 
	Posts.title, 
	Posts.address, 
  Posts.address_short AS addressShort, 
  Posts.contact_number AS contactNumber, 
  Posts.category_id AS categoryId, 
  Posts.post_images AS postImages,
  Posts.post_desc AS PostDesc,
  Posts.post_loc_x AS postLocationX, 
  Posts.post_loc_y AS postLocationY, 
  Posts.favorite_cnt AS favoriteCnt, 
  Posts.weather_id AS weatherId, 
  Posts.inside_yn AS insideYN, 
  Posts.gender_id AS genderId, 
  Posts.member_id AS MemberId, 
    CASE 
      WHEN Favorites.user_Id = ${user} THEN true 
      ELSE false 
      END as 'favoriteState'
FROM Posts 
LEFT JOIN Favorites
ON Posts.post_id = Favorites.post_id
WHERE Posts.md_pick = 1
`; 
}// 해당쿼리는 수정 예정

const weatherQuery = `
SELECT *
FROM CurrentWeather
WHERE cur_weather_id = 0
`; //데이터베이스에 저장된 날씨 가져오기


module.exports = { searchMainQuery, likeQuery, mdQuery, weatherQuery };
