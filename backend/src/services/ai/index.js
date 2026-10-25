import { config } from '../../config/env.js';
import { askGeminiAssistant } from './geminiAssistantProvider.js';
import { askDemoAssistant } from './demoAssistantProvider.js';

export const askAssistant = async ({
  messages,
  targetLanguage = 'en',
  cropContext = null,
  weatherContext = null,
}) => {
  const shouldUseLiveAi = Boolean(config.aiProviderApiKey) && config.aiProviderApiKey.trim().length > 0;

  if (shouldUseLiveAi) {
    try {
      console.log(`[Assistant] Querying Gemini model: ${config.aiModel}...`);
      return await askGeminiAssistant({ messages, targetLanguage, cropContext, weatherContext });
    } catch (err) {
      console.warn(`[Assistant] Gemini request failed (${err.message}). Falling back to demo mode.`);
      const demoResult = await askDemoAssistant({ messages, targetLanguage, cropContext, weatherContext });
      demoResult.providerMetadata.fallbackReason = err.message;
      return demoResult;
    }
  }

  return askDemoAssistant({ messages, targetLanguage, cropContext, weatherContext });
};
