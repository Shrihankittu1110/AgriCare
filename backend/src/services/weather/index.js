import { config } from '../../config/env.js';
import { getOpenMeteoWeather, searchOpenMeteoLocations } from './openMeteoProvider.js';
import { getOpenWeather } from './openWeatherProvider.js';
import { evaluateWeatherAgronomy } from '../recommendations/weatherAgronomyEngine.js';

// In-memory cache for weather to protect rate limits and enhance performance
const weatherCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export const getWeatherData = async (latitude, longitude, locationName = 'Selected Location') => {
  const cacheKey = `${parseFloat(latitude).toFixed(2)}_${parseFloat(longitude).toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  let weatherResult = null;

  // Use OpenWeather if configured and preferred, otherwise Open-Meteo
  if (config.weatherProvider === 'openweather' && config.weatherApiKey) {
    try {
      weatherResult = await getOpenWeather(latitude, longitude, locationName);
    } catch (err) {
      console.warn(`[Weather] OpenWeather failed, falling back to Open-Meteo: ${err.message}`);
      weatherResult = await getOpenMeteoWeather(latitude, longitude, locationName);
    }
  } else {
    weatherResult = await getOpenMeteoWeather(latitude, longitude, locationName);
  }

  // Attach weather agronomy alerts
  const agronomyAlerts = evaluateWeatherAgronomy(weatherResult.current, weatherResult.forecast);
  weatherResult.agronomyAlerts = agronomyAlerts;

  // Store in cache
  weatherCache.set(cacheKey, {
    timestamp: Date.now(),
    data: weatherResult,
  });

  return weatherResult;
};

export const searchLocations = async (query) => {
  return searchOpenMeteoLocations(query);
};
