const searchMainQuery = (weatherCondition, user) => {
  return `
  SELECT DISTINCT Posts.post_id, Posts.title, Posts.address, Posts.address_short, Posts.contact_number, Posts.category_id, Posts.post_images, Posts.post_desc, Posts.post_loc_x, Posts.post_loc_y, Posts.favorite_cnt, Posts.weather_id, Posts.inside_yn, Posts.gender_id, Posts.member_id, 
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
SELECT DISTINCT Posts.post_id, Posts.title, Posts.address, Posts.address_short, Posts.contact_number, Posts.category_id, Posts.post_images, Posts.post_desc, Posts.post_loc_x, Posts.post_loc_y, Posts.favorite_cnt, Posts.weather_id, Posts.inside_yn, Posts.gender_id, Posts.member_id, 
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

const mdQuery = `
SELECT DISTINCT Posts.post_id, Posts.title, Posts.address, Posts.address_short, Posts.contact_number, Posts.category_id, Posts.post_images, Posts.post_desc, Posts.post_loc_x, Posts.post_loc_y, Posts.favorite_cnt, Posts.weather_id, Posts.inside_yn, Posts.gender_id, Posts.member_id, 
	CASE 
		WHEN Favorites.user_Id = ? THEN true 
		ELSE false 
    END as 'favoriteState'
FROM Posts 
LEFT JOIN Favorites
ON Posts.post_id = Favorites.post_id
WHERE Posts.md_pick = 1
`; // 해당쿼리는 수정 예정

const weatherQuery = `
SELECT *
FROM CurrentWeather
WHERE cur_weather_id = 0
`; //데이터베이스에 저장된 날씨 가져오기


module.exports = { searchMainQuery, likeQuery, mdQuery, weatherQuery };
