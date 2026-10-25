import axios from 'axios';

// Helper to translate WMO weather codes
const getWmoDescription = (code) => {
  const codes = {
    0: { desc: 'Clear sky', icon: 'sun' },
    1: { desc: 'Mainly clear', icon: 'sun' },
    2: { desc: 'Partly cloudy', icon: 'cloud-sun' },
    3: { desc: 'Overcast', icon: 'cloud' },
    45: { desc: 'Foggy', icon: 'cloud-fog' },
    48: { desc: 'Depositing rime fog', icon: 'cloud-fog' },
    51: { desc: 'Light drizzle', icon: 'cloud-drizzle' },
    53: { desc: 'Moderate drizzle', icon: 'cloud-drizzle' },
    55: { desc: 'Dense drizzle', icon: 'cloud-drizzle' },
    61: { desc: 'Slight rain', icon: 'cloud-rain' },
    63: { desc: 'Moderate rain', icon: 'cloud-rain' },
    65: { desc: 'Heavy rain', icon: 'cloud-rain' },
    71: { desc: 'Slight snowfall', icon: 'snowflake' },
    80: { desc: 'Slight rain showers', icon: 'cloud-rain' },
    81: { desc: 'Moderate rain showers', icon: 'cloud-rain' },
    82: { desc: 'Violent rain showers', icon: 'cloud-lightning' },
    95: { desc: 'Thunderstorm', icon: 'cloud-lightning' },
    96: { desc: 'Thunderstorm with slight hail', icon: 'cloud-lightning' },
    99: { desc: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' },
  };

  return codes[code] || { desc: 'Scattered clouds', icon: 'cloud' };
};

export const getOpenMeteoWeather = async (latitude, longitude, locationName = 'Selected Farm') => {
  try {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    const url = 'https://api.open-meteo.com/v1/forecast';
    const params = {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max',
      timezone: 'auto',
    };

    const res = await axios.get(url, { params, timeout: 8000 });
    const data = res.data;

    const currentWmo = getWmoDescription(data.current.weather_code);

    const current = {
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation || 0,
      windSpeed: Math.round(data.current.wind_speed_10m),
      weatherCode: data.current.weather_code,
      description: currentWmo.desc,
      icon: currentWmo.icon,
      timestamp: data.current.time,
    };

    const forecast = data.daily.time.map((timeStr, idx) => {
      const dailyWmo = getWmoDescription(data.daily.weather_code[idx]);
      return {
        date: timeStr,
        tempMax: Math.round(data.daily.temperature_2m_max[idx]),
        tempMin: Math.round(data.daily.temperature_2m_min[idx]),
        precipitationProbability: data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[idx] : 0,
        precipitationSum: data.daily.precipitation_sum ? data.daily.precipitation_sum[idx] : 0,
        windSpeedMax: data.daily.wind_speed_10m_max ? Math.round(data.daily.wind_speed_10m_max[idx]) : 0,
        weatherCode: data.daily.weather_code[idx],
        description: dailyWmo.desc,
        icon: dailyWmo.icon,
      };
    });

    return {
      provider: 'Open-Meteo Free Meteorological Service',
      location: {
        name: locationName,
        latitude: lat,
        longitude: lon,
      },
      current,
      forecast,
    };
  } catch (err) {
    console.error('[OpenMeteo] Error fetching weather:', err.message);
    throw new Error(`Weather service error: ${err.message}`);
  }
};

export const searchOpenMeteoLocations = async (query) => {
  try {
    const url = 'https://geocoding-api.open-meteo.com/v1/search';
    const res = await axios.get(url, {
      params: {
        name: query,
        count: 5,
        language: 'en',
        format: 'json',
      },
      timeout: 6000,
    });

    if (!res.data.results || res.data.results.length === 0) {
      return [];
    }

    return res.data.results.map((loc) => ({
      name: `${loc.name}${loc.admin1 ? `, ${loc.admin1}` : ''}${loc.country ? `, ${loc.country}` : ''}`,
      latitude: loc.latitude,
      longitude: loc.longitude,
      country: loc.country,
      region: loc.admin1,
    }));
  } catch (err) {
    console.error('[OpenMeteo] Geocoding search error:', err.message);
    return [];
  }
};
