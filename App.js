// src/App.js
import React, { useState } from 'react';
import './App.css';
import WeatherDisplay from './components/WeatherDisplay';
import ForecastDisplay from './components/ForecastDisplay';
import FavoriteCities from './components/FavoriteCities';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api'; // Adjust if your backend runs on a different port

  const handleSearch = async () => {
    setError('');
    setWeatherData(null);
    setForecastData(null);

    try {
      const currentWeatherResponse = await fetch(`${API_BASE_URL}/weather/${city}`);
      if (!currentWeatherResponse.ok) {
        const errorData = await currentWeatherResponse.json();
        throw new Error(errorData.message || 'Failed to fetch current weather');
      }
      const currentWeatherData = await currentWeatherResponse.json();
      setWeatherData(currentWeatherData);

      const forecastResponse = await fetch(`${API_BASE_URL}/forecast/${city}`);
      if (!forecastResponse.ok) {
        const errorData = await forecastResponse.json();
        throw new Error(errorData.message || 'Failed to fetch forecast');
      }
      const forecastWeatherData = await forecastResponse.json();
      setForecastData(forecastWeatherData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveFavorite = () => {
    if (weatherData && !favoriteCities.includes(weatherData.name)) {
      setFavoriteCities([...favoriteCities, weatherData.name]);
    }
  };

  const handleRemoveFavorite = (cityName) => {
    setFavoriteCities(favoriteCities.filter((favCity) => favCity !== cityName));
  };

  const handleLoadFavorite = async (cityName) => {
    setCity(cityName);
    await handleSearch();
  };

  return (
    <div className="app">
      <h1>Weather Dashboard</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city or region"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {weatherData && (
        <WeatherDisplay weather={weatherData} onSaveFavorite={handleSaveFavorite} />
      )}

      {forecastData && <ForecastDisplay forecast={forecastData} />}

      <FavoriteCities
        cities={favoriteCities}
        onRemove={handleRemoveFavorite}
        onLoad={handleLoadFavorite}
      />
    </div>
  );
};

export default App;