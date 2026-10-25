import { getWeatherData, searchLocations } from '../services/weather/index.js';

export const getWeather = async (req, res, next) => {
  try {
    const { lat, lon, locationName } = req.query;

    let latitude = lat ? parseFloat(lat) : req.user?.location?.latitude || 16.3067;
    let longitude = lon ? parseFloat(lon) : req.user?.location?.longitude || 80.4365;
    let name = locationName || req.user?.location?.name || 'Guntur, Andhra Pradesh';

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude coordinates.',
      });
    }

    const weatherData = await getWeatherData(latitude, longitude, name);

    res.json({
      success: true,
      weather: weatherData,
    });
  } catch (err) {
    next(err);
  }
};

export const searchLocationsHandler = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long.',
      });
    }

    const locations = await searchLocations(q.trim());

    res.json({
      success: true,
      count: locations.length,
      locations,
    });
  } catch (err) {
    next(err);
  }
};
