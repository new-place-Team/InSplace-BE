const weatherQuery = `
SELECT 
  weather_status AS status,
  weather_temp AS temperature,
  temp_diff AS diff,
  weather_status_fe AS frontWeather,
  humidity,
  pm10,
  pm25
FROM CurrentWeather
WHERE cur_weather_id = 0
`;
module.exports = {
  weatherQuery,
};
