// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

const OPENWEATHER_API_KEY = '23ef1f01fd95be46920c398e46fe61b0';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Function to fetch current weather data
const fetchCurrentWeather = async (city) => {
  try {
    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw new Error('Failed to fetch current weather data');
  }
};

// Function to fetch weather forecast data
const fetchWeatherForecast = async (city) => {
  try {
    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw new Error('Failed to fetch weather forecast data');
  }
};

// API endpoint to get current weather
app.get('/api/weather/:city', async (req, res) => {
  const { city } = req.params;
  try {
    const weatherData = await fetchCurrentWeather(city);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API endpoint to get weather forecast
app.get('/api/forecast/:city', async (req, res) => {
  const { city } = req.params;
  try {
    const forecastData = await fetchWeatherForecast(city);
    res.json(forecastData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});