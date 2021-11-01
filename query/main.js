const searchMainQuery = (weatherCondition) => {
  return `
  SELECT post_id, title, address, address_short, contact_number, category_id, post_images, post_desc, post_loc_x, post_loc_y, like_cnt, weather_id, inside_yn, gender_id, member_id
  FROM Posts 
  WHERE weather_id IN(${weatherCondition}, 7)
  AND post_id NOT IN(
    SELECT post_id
    FROM(
      SELECT post_id
      FROM Posts
      ORDER BY like_cnt DESC limit 14
    ) as tempPosts 
  )
  ORDER BY rand() limit 14
  `;
}

const likeQuery = `
SELECT post_id, title, address, address_short, contact_number, category_id, post_images, post_desc, post_loc_x, post_loc_y, like_cnt, weather_id, inside_yn, gender_id, member_id
FROM Posts 
ORDER BY like_cnt DESC limit 14
`;

const mdQuery = `
SELECT post_id, title, address, address_short, contact_number, category_id, post_images, post_desc, post_loc_x, post_loc_y, like_cnt, weather_id, inside_yn, gender_id, member_id
FROM Posts 
ORDER BY like_cnt DESC limit 14
`; // 해당쿼리는 수정 예정

const weatherQuery = `
SELECT *
FROM CurrentWeather
WHERE cur_weather_id = 0
`; //데이터베이스에 저장된 날씨 가져오기

module.exports = { searchMainQuery, likeQuery, mdQuery, weatherQuery};
