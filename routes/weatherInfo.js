const express = require('express');
const router = express.Router();
const { getWeatherInfo } = require('../controllers/getWeather');

router.get('/info', getWeatherInfo);

module.exports = router;
