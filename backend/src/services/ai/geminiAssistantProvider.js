import axios from 'axios';
import { config } from '../../config/env.js';

export const askGeminiAssistant = async ({
  messages,
  targetLanguage = 'en',
  cropContext = null,
  weatherContext = null,
}) => {
  if (!config.aiProviderApiKey) {
    throw new Error('AI Provider API Key (Gemini) is not configured.');
  }

  const langInstruction =
    targetLanguage === 'te'
      ? 'You MUST reply in natural, fluent Telugu (తెలుగు). Keep scientific names and standard agrochemical units in recognizable format.'
      : targetLanguage === 'hi'
      ? 'You MUST reply in natural, fluent Hindi (हिन्दी). Keep scientific names and standard agrochemical units in recognizable format.'
      : 'Reply in clear, professional English accessible to farmers.';

  let contextPrefix = `You are "AgriCare AI", a certified senior agronomist and practical farming consultant.
Guidelines:
1. Provide practical, cautious, scientifically sound agronomic advice.
2. Ground all advice in established agricultural science and good agronomic practices (GAP).
3. Do not invent chemical approvals or promote dangerous pesticide usage. Any chemical guidance must mention checking local label directions and consulting the local agricultural extension officer.
4. ${langInstruction}
`;

  if (cropContext) {
    contextPrefix += `\n[Active Crop Context]: Crop: ${cropContext.cropName || 'Unknown'}, Detected Condition: ${cropContext.diseaseName || 'None'}, Status: ${cropContext.healthStatus || 'N/A'}`;
  }

  if (weatherContext) {
    contextPrefix += `\n[Local Weather Context]: Temp: ${weatherContext.temperature}°C, Condition: ${weatherContext.condition}, Humidity: ${weatherContext.humidity}%`;
  }

  const formattedContents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  // Prepend system prompt to the first user message
  if (formattedContents.length > 0 && formattedContents[0].role === 'user') {
    formattedContents[0].parts[0].text = `${contextPrefix}\n\nUser Question:\n${formattedContents[0].parts[0].text}`;
  }

  const modelName = config.aiModel || 'gemini-1.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.aiProviderApiKey}`;

  const payload = {
    contents: formattedContents,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1000,
    },
  };

  const res = await axios.post(endpoint, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 25000,
  });

  const reply = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) {
    throw new Error('No answer returned from Gemini Assistant.');
  }

  return {
    content: reply,
    providerMetadata: {
      provider: 'Google Gemini Generative AI',
      model: modelName,
      isDemoMode: false,
    },
  };
};
