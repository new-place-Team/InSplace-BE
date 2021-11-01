const updateWeatherQuery = (weather_status, weather_temp, temp_diff) => {
  return `
  UPDATE CurrentWeather
  SET 
  weather_status = ${weather_status},
  weather_temp = ${weather_temp},
  temp_diff = ${temp_diff}
  WHERE cur_weather_id = 0
  `;
}

module.exports = { updateWeatherQuery }
