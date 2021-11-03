const weatherQuery = `
SELECT 
  weather_status AS status,
  weather_temp AS temperature,
  temp_diff AS diif,
  weather_status_fe AS frontWeather
FROM CurrentWeather
WHERE cur_weather_id = 0
`
module.exports = {
  weatherQuery
};