import { config } from '../../config/env.js';
import { analyzeCropWithGemini } from './geminiVisionProvider.js';
import { analyzeCropDemo } from './demoCropProvider.js';
import { getWeatherData } from '../weather/index.js';

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

  // Correlate with live weather if location coordinates are provided
  if (latitude && longitude) {
    try {
      const weather = await getWeatherData(latitude, longitude, locationName || 'Farm Location');
      const temp = weather.current.temperature;
      const humidity = weather.current.humidity;

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
        rainfallProbability: weather.forecast[0]?.precipitationProbability || 0,
        weatherAssessment: assessment,
      };
    } catch (weatherErr) {
      console.warn('[CropDetection] Weather correlation unavailable:', weatherErr.message);
    }
  }

  return result;
};
