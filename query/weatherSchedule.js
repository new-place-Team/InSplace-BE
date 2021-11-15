const updateWeatherQuery = (weather_status, weather_temp, temp_diff, weatherFe) => {
  return `
  UPDATE CurrentWeather
  SET 
  weather_status = ${weather_status},
  weather_temp = ${weather_temp},
  temp_diff = ${temp_diff},
  weather_status_fe = ${weatherFe}
  WHERE cur_weather_id = 0
  `;
}

module.exports = { updateWeatherQuery }
