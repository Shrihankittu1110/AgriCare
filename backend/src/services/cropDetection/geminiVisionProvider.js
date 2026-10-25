import axios from 'axios';
import fs from 'fs';
import { config } from '../../config/env.js';

export const fetchSupportedModels = async (apiKey) => {
  for (const version of ['v1beta', 'v1']) {
    try {
      const url = `https://generativelanguage.googleapis.com/${version}/models`;
      const res = await axios.get(url, {
        headers: { 'X-goog-api-key': apiKey },
        timeout: 10000,
      });
      const models = (res.data?.models || [])
        .filter((m) => {
          const name = (m.name || '').toLowerCase();
          const isGenContent = m.supportedGenerationMethods?.includes('generateContent');
          const isNotSpecialized = !name.includes('tts') && !name.includes('audio') && !name.includes('embed') && !name.includes('imagen');
          
          let supportsImage = true;
          if (Array.isArray(m.supportedInputModalities)) {
            supportsImage = m.supportedInputModalities.some((mod) => mod.toUpperCase().includes('IMAGE'));
          }
          return isGenContent && isNotSpecialized && supportsImage;
        })
        .map((m) => ({
          version,
          name: m.name.replace(/^models\//, ''),
        }));
      if (models.length > 0) {
        console.log(`[GeminiVision] Discovered ${models.length} active vision models via ${version}:`, models.map((s) => s.name));
        return models;
      }
    } catch (err) {
      console.warn(`[GeminiVision] ListModels (${version}) error:`, err.response?.data?.error?.message || err.message);
    }
  }
  return [];
};

export const analyzeCropWithGemini = async (imagePath, mimeType = 'image/jpeg', targetLanguage = 'en') => {
  if (!config.aiProviderApiKey) {
    throw new Error('AI Provider API Key (Gemini) is not configured.');
  }

  try {
    const imageBytes = fs.readFileSync(imagePath);
    const base64Image = imageBytes.toString('base64');

    const prompt = `You are a certified senior agricultural pathologist and crop diagnostic specialist.
Analyze this crop image (leaf, fruit, boll, flower, stem, or canopy) carefully and provide a rigorous, objective diagnostic assessment in valid JSON format.
Accurately identify the crop species (e.g. Cotton, Tomato, Rice, Chilli, Maize, Wheat, etc.).
If the image shows a healthy crop or normal harvest-ready stage (such as mature opened cotton bolls), classify healthStatus as "Healthy" with disease name as "None / Healthy Crop".
If signs of foliar blight, leaf curl virus, boll rot, bacterial spot, pest infestation, or deficiency are visible, identify the specific pathogen or condition.
If the image does not depict an agricultural plant or is completely unreadable, set healthStatus to "Inconclusive".
Target language for text explanations: ${targetLanguage === 'te' ? 'Telugu (తెలుగు)' : targetLanguage === 'hi' ? 'Hindi (हिन्दी)' : 'English'}.

Respond ONLY with a valid JSON object matching this exact schema:
{
  "crop": {
    "name": "Common crop name (e.g. Tomato, Cotton, Rice, Wheat)",
    "scientificName": "Latin binomial if determinable (e.g. Solanum lycopersicum)",
    "confidence": 88
  },
  "disease": {
    "name": "Common disease name or 'None / Healthy Leaf'",
    "scientificName": "Pathogen name (fungus, bacterium, virus) if applicable",
    "confidence": 84
  },
  "healthStatus": "Healthy" | "Suspected Disease" | "Pest Damage" | "Nutrient Deficiency" | "Inconclusive",
  "confidenceScore": 85,
  "severityEstimate": "None" | "Low" | "Moderate" | "High" | "Severe" | "Inconclusive",
  "visibleSymptoms": [
    "Symptom 1 describing lesion appearance, chlorosis, or spot pattern",
    "Symptom 2"
  ],
  "likelyCauses": [
    "Fungal spore transmission via rain splash",
    "High humidity and poor air circulation"
  ],
  "recommendations": {
    "cultural": [
      "Prune affected lower leaves to improve aeration",
      "Avoid overhead sprinkler irrigation"
    ],
    "organic": [
      "Apply certified neem oil (Azadirachtin 0.03%) during early evening",
      "Bio-fungicide application such as Trichoderma viride"
    ],
    "preventive": [
      "Practice crop rotation with non-solanaceous crops",
      "Maintain wide spacing between rows"
    ],
    "cautiousChemicalNotes": [
      "Any synthetic fungicide must strictly adhere to local government CIBRC approval and product label dilution rates."
    ]
  },
  "expertConsultationNote": "Contact your local Krishi Vigyan Kendra (KVK) or district agricultural officer if symptoms spread to more than 20% of your crop canopy.",
  "disclaimer": "AI-generated results are preliminary guidance, not a certified laboratory diagnosis. Consult a qualified agricultural expert when symptoms are unclear or the crop is seriously affected."
}`;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        temperature: 0.2,
      },
    };

    // Dynamically discover what models Google supports for this API key
    const discovered = await fetchSupportedModels(config.aiProviderApiKey);

    let candidates = [];
    // User configured model (e.g. gemini-flash-latest) has #1 priority
    if (config.aiModel) {
      candidates.push({ version: 'v1beta', name: config.aiModel });
      candidates.push({ version: 'v1', name: config.aiModel });
    }

    if (discovered.length > 0) {
      const flashModels = discovered.filter((m) => m.name.toLowerCase().includes('flash'));
      const otherModels = discovered.filter((m) => !m.name.toLowerCase().includes('flash'));
      candidates.push(...flashModels, ...otherModels);
    }

    // Default backup models
    candidates.push(
      { version: 'v1beta', name: 'gemini-flash-latest' },
      { version: 'v1beta', name: 'gemini-2.5-flash' },
      { version: 'v1beta', name: 'gemini-2.0-flash' },
      { version: 'v1beta', name: 'gemini-2.5-pro' },
      { version: 'v1', name: 'gemini-flash-latest' }
    );

    // Deduplicate by version + name
    const seen = new Set();
    const uniqueCandidates = candidates.filter((c) => {
      const key = `${c.version}/${c.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    let lastError = null;
    let successfulResult = null;

    for (const item of uniqueCandidates) {
      const { version = 'v1beta', name: currentModel } = item;
      try {
        const endpoint = `https://generativelanguage.googleapis.com/${version}/models/${currentModel}:generateContent`;

        const res = await axios.post(endpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': config.aiProviderApiKey,
          },
          timeout: 30000,
        });

        const candidate = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidate) {
          throw new Error(`No diagnostic content returned from Gemini Vision (${currentModel}).`);
        }

        let cleanJson = candidate.trim();
        if (cleanJson.startsWith('```')) {
          cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
        }
        const parsed = JSON.parse(cleanJson);
        parsed.providerMetadata = {
          provider: 'Google Gemini Vision AI',
          model: currentModel,
          isDemoMode: false,
        };

        successfulResult = parsed;
        console.log(`[GeminiVision] Successfully diagnosed using model: ${currentModel} (${version})`);
        break;
      } catch (modelErr) {
        lastError = modelErr;
        const msg = modelErr.response?.data?.error?.message || modelErr.message || '';
        const status = modelErr.response?.status;

        const isTemporary =
          status === 503 ||
          status === 429 ||
          msg.includes('high demand') ||
          msg.includes('overloaded') ||
          msg.includes('Resource has been exhausted');

        const isUnsupported =
          status === 404 ||
          msg.includes('Image input modality is not enabled') ||
          msg.includes('is not supported');

        if (isTemporary || isUnsupported) {
          console.warn(`[GeminiVision] Model '${currentModel}' on ${version} skipped: ${msg}`);
          if (isTemporary) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
          continue;
        }
        throw modelErr;
      }
    }

    if (!successfulResult) {
      throw lastError || new Error('All candidate Gemini vision models failed.');
    }

    return successfulResult;
  } catch (err) {
    console.error('[GeminiVision] Error in crop analysis:', err.response?.data || err.message);
    throw err;
  }
};
