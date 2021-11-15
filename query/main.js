const searchMainQuery = (weatherCondition, user) => {
  return `
  SELECT DISTINCT
  a.post_id AS postId, 
  a.title, 
  a.address, 
  a.address_short AS addressShort, 
  a.contact_number AS contactNumber, 
  a.category_id AS category, 
  a.post_images AS postImage,
  a.post_desc AS PostDesc,
  a.post_loc_x AS postLocationX, 
  a.post_loc_y AS postLocationY, 
  a.favorite_cnt AS favoriteCnt, 
  a.weather_id AS weatherId, 
  a.inside_yn AS insideYN, 
  a.gender_id AS genderId, 
  a.member_id AS MemberId, 
	CASE 
		WHEN b.user_Id = ${user} THEN true 
		ELSE false 
    END as 'favoriteState'
FROM Posts a
LEFT JOIN
(
	SELECT post_id, user_id
    FROM Favorites
    where user_id = ${user}
) b ON a.post_id = b.post_id
LEFT JOIN VisitedPosts
ON a.post_id = VisitedPosts.post_id
WHERE weather_id IN(${weatherCondition}, 7)
  AND a.post_id NOT IN(
    SELECT post_id
    FROM(
      SELECT post_id
      FROM Posts
      ORDER BY favorite_cnt DESC limit 9
    ) as tempPosts 
  )
  AND a.post_id NOT IN (
    SELECT post_id
      FROM VisitedPosts
      WHERE VisitedPosts.user_id = ${user}
    )
  ORDER BY rand() limit 9
  `;
};

const likeQuery = (user) => {
  return `
  SELECT DISTINCT
  a.post_id AS postId, 
	a.title, 
	a.address, 
  a.address_short AS addressShort, 
  a.contact_number AS contactNumber, 
  a.category_id AS category, 
  a.post_images AS postImage,
  a.post_desc AS PostDesc,
  a.post_loc_x AS postLocationX, 
  a.post_loc_y AS postLocationY, 
  a.favorite_cnt AS favoriteCnt, 
  a.weather_id AS weatherId, 
  a.inside_yn AS insideYN, 
  a.gender_id AS genderId, 
  a.member_id AS MemberId, 
	CASE 
		WHEN b.user_Id = ${user} THEN true 
		ELSE false 
    END as 'favoriteState'
FROM Posts a
LEFT JOIN
(
	SELECT post_id, user_id
    FROM Favorites
    where user_id = ${user}
) b ON a.post_id = b.post_id
WHERE a.post_id NOT IN (
	SELECT post_id
    FROM VisitedPosts
    WHERE VisitedPosts.user_id = ${user}
    )
ORDER BY favorite_cnt DESC limit 9
`;
}

const mdQuery = (user) => { 
  return `
  SELECT DISTINCT
  a.post_id AS postId, 
	a.title, 
	a.address, 
  a.address_short AS addressShort, 
  a.contact_number AS contactNumber, 
  a.category_id AS category, 
  a.post_images AS postImage,
  a.post_desc AS PostDesc,
  a.post_loc_x AS postLocationX, 
  a.post_loc_y AS postLocationY, 
  a.favorite_cnt AS favoriteCnt, 
  a.weather_id AS weatherId, 
  a.inside_yn AS insideYN, 
  a.gender_id AS genderId, 
  a.member_id AS MemberId, 
    CASE 
      WHEN b.user_id = ${user} THEN true 
      ELSE false 
      END as 'favoriteState' 
FROM Posts a
LEFT JOIN
(
	SELECT post_id, user_id
    FROM Favorites
    where user_id = 41
) b ON a.post_id = b.post_id
WHERE a.md_pick = 1
`; 
}// 해당쿼리는 수정 예정

const weatherQuery = `
SELECT *
FROM CurrentWeather
WHERE cur_weather_id = 0
`; //데이터베이스에 저장된 날씨 가져오기


module.exports = { searchMainQuery, likeQuery, mdQuery, weatherQuery };
