const updateWeatherQuery = (weather_status, weather_temp, temp_diff, weatherFe, humidity, pmTen, pmTwoFive) => {
  return `
  UPDATE CurrentWeather
  SET 
  weather_status_fe = ${weatherFe},
  weather_status = ${weather_status},
  weather_temp = ${weather_temp},
  humidity = ${humidity},
  pm10 = ${pmTen},
  pm25 = ${pmTwoFive},
  temp_diff = ${temp_diff}
  WHERE cur_weather_id = 0
  `;
}

module.exports = { updateWeatherQuery }
