import axios from 'axios';
import { config } from '../../config/env.js';

export const getOpenWeather = async (latitude, longitude, locationName = 'Selected Farm') => {
  if (!config.weatherApiKey) {
    throw new Error('OpenWeather API key not configured.');
  }

  try {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    const url = 'https://api.openweathermap.org/data/2.5/forecast';
    const params = {
      lat,
      lon,
      appid: config.weatherApiKey,
      units: 'metric',
    };

    const res = await axios.get(url, { params, timeout: 8000 });
    const data = res.data;

    const first = data.list[0];
    const current = {
      temperature: Math.round(first.main.temp),
      feelsLike: Math.round(first.main.feels_like),
      humidity: first.main.humidity,
      precipitation: first.rain ? (first.rain['3h'] || 0) : 0,
      windSpeed: Math.round(first.wind.speed * 3.6), // convert m/s to km/h
      weatherCode: first.weather[0].id,
      description: first.weather[0].description,
      icon: 'cloud-sun',
      timestamp: first.dt_txt,
    };

    // Aggregate by day for 5-day forecast
    const dailyMap = new Map();
    data.list.forEach((item) => {
      const day = item.dt_txt.split(' ')[0];
      if (!dailyMap.has(day)) {
        dailyMap.set(day, {
          date: day,
          temps: [item.main.temp],
          descriptions: [item.weather[0].description],
          rainProb: item.pop ? Math.round(item.pop * 100) : 0,
        });
      } else {
        const existing = dailyMap.get(day);
        existing.temps.push(item.main.temp);
      }
    });

    const forecast = Array.from(dailyMap.values()).slice(0, 7).map((d) => ({
      date: d.date,
      tempMax: Math.round(Math.max(...d.temps)),
      tempMin: Math.round(Math.min(...d.temps)),
      precipitationProbability: d.rainProb,
      precipitationSum: 0,
      windSpeedMax: 15,
      weatherCode: 800,
      description: d.descriptions[0] || 'Clear sky',
      icon: 'sun',
    }));

    return {
      provider: 'OpenWeatherMap API',
      location: {
        name: locationName || data.city.name,
        latitude: lat,
        longitude: lon,
      },
      current,
      forecast,
    };
  } catch (err) {
    console.error('[OpenWeather] API request failed:', err.message);
    throw new Error(`OpenWeather API error: ${err.message}`);
  }
};
