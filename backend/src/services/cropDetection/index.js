import { config } from '../../config/env.js';
import { analyzeCropWithGemini } from './geminiVisionProvider.js';
import { analyzeCropDemo } from './demoCropProvider.js';
import { getWeatherData } from '../weather/index.js';
import { generateClimateActionPlan } from '../recommendations/weatherAgronomyEngine.js';

export const detectCropDisease = async ({
  imagePath,
  mimeType,
  targetLanguage = 'en',
  latitude = null,
  longitude = null,
  locationName = null,
}) => {
  let result = null;

  const shouldUseLiveAi =
    config.cropDetectionProvider !== 'demo' &&
    Boolean(config.aiProviderApiKey) &&
    config.aiProviderApiKey.trim().length > 0;

  if (shouldUseLiveAi) {
    try {
      console.log(`[CropDetection] Invoking Gemini Vision model: ${config.aiModel}...`);
      result = await analyzeCropWithGemini(imagePath, mimeType, targetLanguage);
    } catch (err) {
      console.warn(`[CropDetection] Gemini Vision failed (${err.message}), falling back to demo mode`);
      result = await analyzeCropDemo(imagePath, targetLanguage);
      result.providerMetadata.fallbackReason = err.message;
    }
  } else {
    console.log('[CropDetection] Running in configured demo/development mode');
    result = await analyzeCropDemo(imagePath, targetLanguage);
  }

  // Correlate with live weather and generate actionable 7-day future climate action plan
  const lat = latitude || 16.3067;
  const lon = longitude || 80.4365;

  try {
    const weather = await getWeatherData(lat, lon, locationName || 'Farm Location');
    const temp = weather.current?.temperature ?? 28;
    const humidity = weather.current?.humidity ?? 75;

    let assessment = '';
    if (humidity > 75) {
      assessment = `High ambient humidity (${humidity}%) significantly elevates spore transmission risk for foliar pathogens.`;
    } else if (temp > 35) {
      assessment = `High thermal conditions (${temp}°C) may accelerate plant water stress and exacerbate leaf curling.`;
    } else {
      assessment = `Moderate environmental conditions (${temp}°C, ${humidity}% humidity) present standard seasonal baseline.`;
    }

    result.weatherContext = {
      temperature: temp,
      humidity: humidity,
      rainfallProbability: weather.forecast?.[0]?.precipitationProbability || 0,
      weatherAssessment: assessment,
    };

    result.climateActionPlan = generateClimateActionPlan({
      cropName: result.crop?.name || 'Crop',
      diseaseName: result.disease?.name || 'Foliar Symptom',
      currentWeather: weather.current || {},
      forecastDays: weather.forecast || [],
      targetLanguage,
    });
  } catch (weatherErr) {
    console.warn('[CropDetection] Weather correlation unavailable, using standard agronomic baseline:', weatherErr.message);
    result.weatherContext = {
      temperature: 28,
      humidity: 75,
      rainfallProbability: 30,
      weatherAssessment: 'Seasonal baseline conditions (~28°C, 75% RH). Monitor foliage closely during humid spells.',
    };
    result.climateActionPlan = generateClimateActionPlan({
      cropName: result.crop?.name || 'Crop',
      diseaseName: result.disease?.name || 'Foliar Symptom',
      currentWeather: { temperature: 28, humidity: 75, windSpeed: 10 },
      forecastDays: [{ precipitationProbability: 45, precipitationSum: 3 }],
      targetLanguage,
    });
  }

  return result;
};
