/**
 * Generates grounded agronomic advisories based on meteorological metrics
 * Never claims that weather conditions alone prove disease presence.
 */
export const evaluateWeatherAgronomy = (currentWeather, forecastDays = [], cropContext = null) => {
  const alerts = [];
  const { temperature, humidity, windSpeed, precipitation } = currentWeather;

  // 1. Fungal and Bacterial Foliar Disease Risk
  if (humidity >= 80 && temperature >= 18 && temperature <= 30) {
    alerts.push({
      id: 'fungal-risk',
      type: 'warning',
      title: 'High Fungal Sporulation Risk',
      message:
        'Sustained high relative humidity (>80%) combined with moderate temperatures favors spore germination for common fungal pathogens (such as leaf spots and blights). Monitor leaf canopies closely and ensure good inter-row aeration.',
      actionableAdvice: 'Scout lower leaves for early lesions; ensure drainage channels are free of standing water.',
    });
  }

  // 2. Rainfall & Spray Planning
  const upcomingRain = forecastDays.slice(0, 2).some((f) => f.precipitationProbability >= 50 || f.precipitationSum >= 5);
  if (upcomingRain || precipitation > 2) {
    alerts.push({
      id: 'rain-spray-warning',
      type: 'caution',
      title: 'Rain Expected: Postpone Foliar Sprays',
      message:
        'Significant precipitation is forecast within 24-48 hours. Foliar sprays of micronutrients or protective treatments may be washed off, reducing efficacy and causing environmental runoff.',
      actionableAdvice: 'Delay foliar fertilizer or pest control applications until after rain passes and foliage dries.',
    });
  }

  // 3. Wind Drift Hazard
  if (windSpeed >= 20) {
    alerts.push({
      id: 'wind-drift-hazard',
      type: 'caution',
      title: 'High Wind Velocity: Spray Drift Hazard',
      message:
        `Current wind speeds (~${windSpeed} km/h) exceed recommended thresholds for spraying. Chemical spray droplets are prone to off-target drift, risking non-target vegetation and worker exposure.`,
      actionableAdvice: 'Avoid spraying until wind subsides below 15 km/h, preferably in the calm early morning.',
    });
  }

  // 4. Heat Stress Warning
  if (temperature >= 38) {
    alerts.push({
      id: 'heat-stress',
      type: 'info',
      title: 'High Temperature Stress Warning',
      message:
        `Extreme heat (~${temperature}°C) increases evapotranspiration and flower/fruit drop in sensitive crops.`,
      actionableAdvice: 'Provide light irrigation during cooler morning or late evening hours; consider organic mulch to retain soil moisture.',
    });
  }

  // 5. Default favorable condition notice if no risks
  if (alerts.length === 0) {
    alerts.push({
      id: 'favorable-weather',
      type: 'success',
      title: 'Favorable Farming Conditions',
      message:
        'Current temperature, humidity, and wind speeds are within normal agronomic ranges for field maintenance and cultural operations.',
      actionableAdvice: 'Maintain regular field weeding and scheduled irrigation according to crop stage.',
    });
  }

  return alerts;
};
