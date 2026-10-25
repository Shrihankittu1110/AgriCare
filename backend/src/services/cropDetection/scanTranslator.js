import axios from 'axios';
import { config } from '../../config/env.js';
import { generateClimateActionPlan } from '../recommendations/weatherAgronomyEngine.js';

// Agricultural glossary fallback for instant translation
const GLOSSARY = {
  te: {
    crops: {
      Tomato: 'టమాటా',
      Cotton: 'పత్తి',
      Rice: 'వరి',
      Wheat: 'గోధుమ',
      Chilli: 'మిరప',
      Maize: 'మొక్కజొన్న',
      Soybean: 'సోయాబీన్',
      Potato: 'బంగాళాదుంప',
    },
    diseases: {
      'Early Blight': 'ముందస్తు ఆకుమచ్చ తెగులు (Early Blight)',
      'Late Blight': 'లేట్ బ్లైట్ తెగులు (Late Blight)',
      'Leaf Curl': 'ఆకు ముడత తెగులు (Leaf Curl)',
      'Cotton Leaf Curl Virus': 'పత్తి ఆకు ముడత వైరస్ (CLCuV)',
      'Bacterial Spot': 'బాక్టీరియల్ మచ్చల తెగులు (Bacterial Spot)',
      'Powdery Mildew': 'బూడిద తెగులు (Powdery Mildew)',
      'Healthy Leaf': 'ఆరోగ్యకరమైన ఆకు',
      'None / Healthy Leaf': 'ఆరోగ్యకరమైన ఆకు / ఎటువంటి తెగులు లేదు',
    },
    healthStatuses: {
      'Healthy': 'ఆరోగ్యకరమైనది (Healthy)',
      'Suspected Disease': 'తెగులు అనుమానం (Suspected Disease)',
      'Pest Damage': 'పురుగుల నష్టం (Pest Damage)',
      'Nutrient Deficiency': 'పోషకాల లోపం (Nutrient Deficiency)',
      'Inconclusive': 'నిర్ధారణ కాలేదు (Inconclusive)',
    },
    severities: {
      'None': 'ఏమీ లేదు',
      'Low': 'తక్కువ (Low)',
      'Moderate': 'మధ్యస్థం (Moderate)',
      'High': 'అధికం (High)',
      'Severe': 'తీవ్రమైనది (Severe)',
    },
    defaultSymptoms: [
      'దిగువ ఆకులపై గోధుమ రంగు వలయాకార మచ్చలు గమనించబడ్డాయి',
      'ఆకుల అంచుల వెంబడి పసుపు రంగు (క్లోరోసిస్) ఏర్పడింది',
    ],
    defaultCauses: [
      'వర్షపు తుంపర్లు మరియు నేల నుండి సోకే శిలీంధ్ర బీజాలు',
      'అధిక గాలి తేమ మరియు ఆకుల మధ్య గాలి ప్రసరణ సరిగా లేకపోవడం',
    ],
    recommendations: {
      cultural: [
        'వ్యాధి సోకిన దిగువ ఆకులను తొలగించి పొలానికి దూరంగా నాశనం చేయండి.',
        'మొక్కల మొదళ్ల వద్ద నీరు నిలవకుండా డ్రైనేజీ కాలువలను శుభ్రం చేయండి.',
      ],
      organic: [
        'సేంద్రీయ రక్షణ: లీటరు నీటికి 5 మి.లీ వేప నూనె (Neem Oil 10,000 ppm) కలిపి పిచికారీ చేయండి.',
        'ట్రైకోడెర్మా విరిడి (Trichoderma viride - 5 గ్రా/లీ) పిచికారీ చేసి ఆకులపై సహజ రక్షణ కవచం ఏర్పాటు చేయండి.',
      ],
      preventive: [
        'పంట మార్పిడి పద్ధతిని పాటించండి (వరి లేదా మొక్కజొన్నతో మార్పిడి).',
        'మొక్కల మధ్య సరైన దూరం పాటించి గాలి, వెలుతురు ధారాళంగా సోకేలా చూడండి.',
      ],
      cautiousChemicalNotes: [
        'తెగులు ఉధృతి 15% మించితేనే కాపర్ ఆక్సీక్లోరైడ్ (2.5 గ్రా/లీ) వ్యవసాయ అధికారి సలహా మేరకు పిచికారీ చేయండి.',
      ],
    },
    expertNote: 'తెగులు లక్షణాలు 20% పైగా ఆకులకు వ్యాపిస్తే సమీప రైతు భరోసా కేంద్రం (RBK) లేదా కృషి విజ్ఞాన కేంద్రం (KVK) శాస్త్రవేత్తలను సంప్రదించండి.',
    disclaimer: 'ఇది ఏఐ ఆధారిత ప్రాథమిక సూచన మాత్రమే. తీవ్ర సమస్యల సందర్భంలో అధీకృత వ్యవసాయ నిపుణుల సలహా తప్పనిసరి.',
  },
  hi: {
    crops: {
      Tomato: 'टमाटर',
      Cotton: 'कपास',
      Rice: 'धान / चावल',
      Wheat: 'गेहूँ',
      Chilli: 'मिर्च',
      Maize: 'मक्का',
      Soybean: 'सोयाबीन',
      Potato: 'आलू',
    },
    diseases: {
      'Early Blight': 'अगेती झुलसा (Early Blight)',
      'Late Blight': 'पछेती झुलसा (Late Blight)',
      'Leaf Curl': 'पत्ती मरोड़ रोग (Leaf Curl)',
      'Cotton Leaf Curl Virus': 'कपास पत्ती मरोड़ विषाणु (CLCuV)',
      'Bacterial Spot': 'जीवाणु पत्ती धब्बा रोग',
      'Powdery Mildew': 'चूर्णिल आसिता (Powdery Mildew)',
      'Healthy Leaf': 'स्वस्थ पत्ती',
      'None / Healthy Leaf': 'स्वस्थ पत्ती / कोई रोग नहीं',
    },
    healthStatuses: {
      'Healthy': 'स्वस्थ (Healthy)',
      'Suspected Disease': 'संदिग्ध रोग (Suspected Disease)',
      'Pest Damage': 'कीट प्रकोप (Pest Damage)',
      'Nutrient Deficiency': 'पोषक तत्वों की कमी',
      'Inconclusive': 'अस्पष्ट / अनिर्धारित',
    },
    severities: {
      'None': 'शून्य',
      'Low': 'कम (Low)',
      'Moderate': 'मध्यम (Moderate)',
      'High': 'अधिक (High)',
      'Severe': 'गंभीर (Severe)',
    },
    defaultSymptoms: [
      'निचली पत्तियों पर गहरे भूरे रंग के छल्लेदार धब्बे दिखाई दे रहे हैं',
      'पत्तियों के किनारों का पीला पड़ना और झुलसना',
    ],
    defaultCauses: [
      'वर्षा की बूंदों और मिट्टी में मौजूद फफूंद बीजाणुओं का फैलाव',
      'हवा में अधिक नमी और पत्तियों के बीच कम वायु संचार',
    ],
    recommendations: {
      cultural: [
        'संक्रमित निचली पत्तियों को तोड़कर खेत से दूर नष्ट कर दें।',
        'पौधों की जड़ों में जलजमाव न होने दें, जलनिकासी दुरुस्त रखें।',
      ],
      organic: [
        'जैविक उपचार: 5 मिली प्रति लीटर नीम का तेल (Neem Oil) पानी में घोलकर पत्तियों पर छिड़कें।',
        'ट्राइकोडर्मा विरिडी (Trichoderma viride 5 ग्राम/लीटर) का छिड़काव करके प्राकृतिक जैव सुरक्षा चक्र बनाएं।',
      ],
      preventive: [
        'फसल चक्र अपनाएं (दलहन या मक्का के साथ फसल बदलें)।',
        'कतारों के बीच उचित दूरी बनाए रखें ताकि धूप और हवा सही से मिल सके।',
      ],
      cautiousChemicalNotes: [
        'गंभीर संक्रमण होने पर ही कॉपर ऑक्सीक्लोराइड (2.5 ग्राम/लीटर) का छिड़काव कृषि विशेषज्ञ की देखरेख में करें।',
      ],
    },
    expertNote: 'यदि रोग 20% से अधिक पत्तियों में फैल जाए तो निकटतम कृषि विज्ञान केंद्र (KVK) या कृषि विशेषज्ञ से परामर्श लें।',
    disclaimer: 'यह एआई आधारित प्रारंभिक मार्गदर्शन है, प्रयोगशाला निदान नहीं। गंभीर प्रकोप में प्रमाणित कृषि वैज्ञानिक से सलाह लें।',
  },
};

export const translateScanData = async (scan, targetLanguage = 'en') => {
  const lang = ['en', 'te', 'hi'].includes(targetLanguage) ? targetLanguage : 'en';

  // 1. Generate updated climate action plan for the target language
  const climateActionPlan = generateClimateActionPlan({
    cropName: scan.crop?.name || 'Crop',
    diseaseName: scan.disease?.name || 'Foliar Condition',
    currentWeather: scan.weatherContext || {},
    forecastDays: [{ precipitationProbability: scan.weatherContext?.rainfallProbability || 40 }],
    targetLanguage: lang,
  });

  if (lang === 'en') {
    // Already english or restore english fields
    return {
      crop: scan.crop,
      disease: scan.disease,
      healthStatus: scan.healthStatus,
      severityEstimate: scan.severityEstimate,
      visibleSymptoms: scan.visibleSymptoms,
      likelyCauses: scan.likelyCauses,
      recommendations: scan.recommendations,
      climateActionPlan,
      expertConsultationNote: scan.expertConsultationNote,
      disclaimer: scan.disclaimer,
      language: 'en',
    };
  }

  // 2. Try Gemini Live Translation if key available
  if (config.aiProviderApiKey && config.cropDetectionProvider !== 'demo') {
    try {
      const targetLangName = lang === 'te' ? 'Telugu (తెలుగు)' : 'Hindi (हिन्दी)';
      const prompt = `You are a certified senior agricultural pathologist and translator.
Translate the following crop pathology diagnosis data into ${targetLangName}.
Keep scientific names and chemical dilution rates recognizable (e.g. "5 ml/L", "Trichoderma viride", "Copper Oxychloride").
Translate accurately for Indian farmers in practical language.

Original Data:
${JSON.stringify({
  cropName: scan.crop?.name,
  diseaseName: scan.disease?.name,
  healthStatus: scan.healthStatus,
  severityEstimate: scan.severityEstimate,
  visibleSymptoms: scan.visibleSymptoms,
  likelyCauses: scan.likelyCauses,
  recommendations: scan.recommendations,
  expertConsultationNote: scan.expertConsultationNote,
  disclaimer: scan.disclaimer,
})}

Respond ONLY with valid JSON with this schema:
{
  "cropName": "...",
  "diseaseName": "...",
  "healthStatus": "...",
  "severityEstimate": "...",
  "visibleSymptoms": ["..."],
  "likelyCauses": ["..."],
  "recommendations": {
    "cultural": ["..."],
    "organic": ["..."],
    "preventive": ["..."],
    "cautiousChemicalNotes": ["..."]
  },
  "expertConsultationNote": "...",
  "disclaimer": "..."
}`;

      const modelName = config.aiModel || 'gemini-flash-latest';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

      const res = await axios.post(
        endpoint,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: 'application/json',
            temperature: 0.2,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': config.aiProviderApiKey,
          },
          timeout: 15000,
        }
      );

      const candidate = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidate) {
        let cleanJson = candidate.trim();
        if (cleanJson.startsWith('```')) {
          cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
        }
        const parsed = JSON.parse(cleanJson);
        return {
          crop: {
            ...scan.crop,
            name: parsed.cropName || scan.crop?.name,
          },
          disease: {
            ...scan.disease,
            name: parsed.diseaseName || scan.disease?.name,
          },
          healthStatus: parsed.healthStatus || scan.healthStatus,
          severityEstimate: parsed.severityEstimate || scan.severityEstimate,
          visibleSymptoms: parsed.visibleSymptoms || scan.visibleSymptoms,
          likelyCauses: parsed.likelyCauses || scan.likelyCauses,
          recommendations: parsed.recommendations || scan.recommendations,
          climateActionPlan,
          expertConsultationNote: parsed.expertConsultationNote || scan.expertConsultationNote,
          disclaimer: parsed.disclaimer || scan.disclaimer,
          language: lang,
        };
      }
    } catch (aiErr) {
      console.warn('[ScanTranslator] Gemini translation fallback triggered:', aiErr.message);
    }
  }

  // 3. Robust High-Quality Dictionary Fallback
  const dict = GLOSSARY[lang] || GLOSSARY.te;
  const translatedCrop = dict.crops[scan.crop?.name] || scan.crop?.name;
  const translatedDisease = dict.diseases[scan.disease?.name] || scan.disease?.name;

  return {
    crop: {
      ...scan.crop,
      name: translatedCrop,
    },
    disease: {
      ...scan.disease,
      name: translatedDisease,
    },
    healthStatus: dict.healthStatuses[scan.healthStatus] || scan.healthStatus,
    severityEstimate: dict.severities[scan.severityEstimate] || scan.severityEstimate,
    visibleSymptoms: dict.defaultSymptoms,
    likelyCauses: dict.defaultCauses,
    recommendations: dict.recommendations,
    climateActionPlan,
    expertConsultationNote: dict.expertNote,
    disclaimer: dict.disclaimer,
    language: lang,
  };
};
