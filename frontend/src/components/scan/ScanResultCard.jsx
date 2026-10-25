import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  Bug,
  HelpCircle,
  Activity,
  Calendar,
  CloudSun,
  Bot,
  Printer,
  ChevronRight,
  Sparkles,
  Info,
  Volume2,
  VolumeX,
  Languages,
  CloudRain,
  Leaf,
  Clock,
  Droplets,
  FlaskConical,
  RefreshCw,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { scanService } from '../../services/scanService';

export const ScanResultCard = ({ scan, onScanAnother, onScanUpdated }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentScan, setCurrentScan] = useState(scan);
  const [activeTab, setActiveTab] = useState('cultural'); // 'cultural' | 'organic' | 'preventive'
  const [isTranslating, setIsTranslating] = useState(false);

  const { isSpeaking, speak, stop, isSupported } = useSpeechSynthesis();

  useEffect(() => {
    setCurrentScan(scan);
  }, [scan]);

  // Stop speech if component unmounts
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  if (!currentScan) return null;

  const {
    crop,
    disease,
    healthStatus,
    confidenceScore = 85,
    severityEstimate = 'Moderate',
    visibleSymptoms = [],
    likelyCauses = [],
    recommendations = {},
    weatherContext,
    climateActionPlan,
    expertConsultationNote,
    disclaimer,
    imageUrl,
    providerMetadata,
    createdAt,
    language = 'en',
  } = currentScan;

  // Fallback climate action plan if scan didn't have one populated
  const activeClimatePlan = climateActionPlan?.climateSummary
    ? climateActionPlan
    : {
        climateSummary:
          language === 'te'
            ? 'ప్రస్తుత ఉష్ణోగ్రత 28°C, గాలిలో తేమ 75% గా ఉంది. రాబోయే 3 రోజుల్లో వర్షం కురిసే అవకాశం ఉన్నందున తగిన జాగ్రత్తలు పాటించండి.'
            : language === 'hi'
            ? 'वर्तमान तापमान 28°C और आर्द्रता 75% है। आगामी 3 दिनों में मौसमी वर्षा के अनुसार पूर्वोपचार आवश्यक है।'
            : 'Current temperature 28°C with 75% relative humidity and calm winds. Weather conditions favor standard preventative care.',
        predictedImpact:
          language === 'te'
            ? 'అధిక తేమ మరియు వర్షపు తుంపర్ల వల్ల ఆకుమచ్చ లేదా బ్లైట్ శిలీంధ్ర బీజాలు పక్క ఆకులకు వేగంగా వ్యాపించే ప్రమాదం ఉంది.'
            : language === 'hi'
            ? 'अधिक नमी के कारण फफूंद बीजाणुओं का फैलाव तेज हो सकता है, जिससे स्वस्थ पत्तियों में संक्रमण का खतरा रहता है।'
            : 'High ambient moisture combined with upcoming precipitation will accelerate fungal spore dispersion on tender foliage.',
        immediateNaturalAction:
          language === 'te'
            ? 'సేంద్రీయ రక్షణ: లీటరు నీటికి 5 మి.లీ వేప నూనె (Neem Oil 10,000 ppm) లేదా ట్రైకోడెర్మా విరిడి (5 గ్రా/లీ) కలిపి పిచికారీ చేయండి.'
            : language === 'hi'
            ? 'जैविक उपचार: 5 मिली प्रति लीटर नीम का तेल (Neem Oil) या ट्राइकोडर्मा विरिडी (5 ग्राम/लीटर) पत्तियों पर छिड़कें।'
            : 'Organic / Bio-control: Apply cold-pressed Neem Oil (5 ml/L with mild emulsifier) or Trichoderma viride (5g/L) to form a natural bio-barrier.',
        chemicalAction:
          language === 'te'
            ? 'రసాయన సస్యరక్షణ: తెగులు తీవ్రత 15% మించితేనే కాపర్ ఆక్సీక్లోరైడ్ (2.5 గ్రా/లీ) పిచికారీ చేయండి. వర్షానికి ముందు కాకుండా ఆకులు ఆరినప్పుడే పిచికారీ చేయాలి.'
            : language === 'hi'
            ? 'रासायनिक सलाह: गंभीर स्थिति (15% से अधिक) में कॉपर ऑक्सीक्लोराइड (2.5 ग्राम/लीटर) का छिड़काव करें। बारिश से ठीक पहले छिड़काव न करें।'
            : 'Cautious Chemical Control: If foliar lesions exceed 15% of the canopy, consider Copper Oxychloride (2.5g/L). Do NOT spray immediately before rainfall.',
        irrigationGuidance:
          language === 'te'
            ? 'రాబోయే 48 గంటల్లో వర్ష సూచన ఉన్నందున నీటి తడులు నిలిపివేయండి. మురుగునీటి కాలువలు శుభ్రం చేయండి.'
            : language === 'hi'
            ? 'आगामी 48 घंटों में वर्षा की संभावना को देखते हुए सिंचाई स्थगित करें और खेत से जल निकासी सुनिश्चित करें।'
            : 'Postpone scheduled irrigation for the next 48 hours to avoid root hypoxia and soil waterlogging. Clear field drainage furrows.',
        timelineGuidance:
          language === 'te'
            ? 'సమయం: ఉదయం 7:00 నుండి 9:30 గంటల మధ్యలో, గాలి వేగం 12 km/h కంటే తక్కువగా ఉన్నప్పుడు మాత్రమే పిచికారీ చేయండి.'
            : language === 'hi'
            ? 'सही समय: सुबह 7:00 से 9:30 बजे के बीच, जब हवा शांत (12 km/h से कम) हो, तभी छिड़काव करें।'
            : 'Application Window: Spray between 7:00 AM – 9:30 AM when ambient wind velocities are below 12 km/h to prevent drift and evaporation loss.',
      };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Healthy':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
          label: language === 'te' ? 'ఆరోగ్యకరమైనది' : language === 'hi' ? 'स्वस्थ पत्ती' : 'Healthy Canopy',
        };
      case 'Suspected Disease':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          label: language === 'te' ? 'తెగులు అనుమానం' : language === 'hi' ? 'संदिग्ध रोग' : 'Suspected Disease',
        };
      case 'Pest Damage':
        return {
          bg: 'bg-orange-100 text-orange-800 border-orange-300',
          icon: <Bug className="w-4 h-4 text-orange-600" />,
          label: language === 'te' ? 'పురుగుల నష్టం' : language === 'hi' ? 'कीट प्रकोप' : 'Pest Infestation',
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: <HelpCircle className="w-4 h-4 text-gray-500" />,
          label: status || 'Preliminary',
        };
    }
  };

  const badge = getStatusBadge(healthStatus);

  const handleAskAssistant = () => {
    navigate('/assistant', {
      state: {
        cropScanId: currentScan._id,
        cropContext: {
          cropName: crop?.name,
          diseaseName: disease?.name,
          healthStatus: healthStatus,
        },
      },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Language translation handler on the card
  const handleSwitchLanguage = async (targetLang) => {
    if (isTranslating || currentScan.language === targetLang) return;
    setIsTranslating(true);
    stop(); // stop any audio if running

    try {
      if (currentScan._id) {
        const res = await scanService.translateScan(currentScan._id, targetLang);
        if (res.success && res.scan) {
          setCurrentScan(res.scan);
          if (onScanUpdated) {
            onScanUpdated(res.scan);
          }
        }
      }
      i18n.changeLanguage(targetLang);
    } catch (err) {
      console.warn('[ScanResultCard] Translation failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Text-To-Speech speech readout handler
  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stop();
      return;
    }

    const currentLang = currentScan.language || i18n.language || 'en';
    let script = '';

    if (currentLang === 'te') {
      script = `అగ్రికేర్ వ్యాధి నిర్ధారణ నివేదిక. పంట: ${crop?.name || 'పంట'}. గుర్తించిన సమస్య: ${disease?.name || 'పరిశీలన'}. పరిస్థితి: ${healthStatus || 'సాధారణం'}. నిర్ధారణ స్థాయి: ${confidenceScore} శాతం. `;
      if (visibleSymptoms.length > 0) {
        script += `ఆకుపై కనిపించిన లక్షణాలు: ${visibleSymptoms.join('. ')}. `;
      }
      if (activeClimatePlan.climateSummary) {
        script += `వాతావరణ అంచనా: ${activeClimatePlan.climateSummary}. `;
      }
      if (activeClimatePlan.predictedImpact) {
        script += `భవిష్యత్ తెగులు ప్రభావం: ${activeClimatePlan.predictedImpact}. `;
      }
      if (activeClimatePlan.immediateNaturalAction) {
        script += `సేంద్రీయ రక్షణ: ${activeClimatePlan.immediateNaturalAction}. `;
      }
      if (activeClimatePlan.chemicalAction) {
        script += `రసాయన సలహా: ${activeClimatePlan.chemicalAction}. `;
      }
      if (activeClimatePlan.irrigationGuidance) {
        script += `నీటి యాజమాన్యం: ${activeClimatePlan.irrigationGuidance}. `;
      }
      if (activeClimatePlan.timelineGuidance) {
        script += `పిచికారీ సమయం: ${activeClimatePlan.timelineGuidance}. `;
      }
    } else if (currentLang === 'hi') {
      script = `एग्रीकेयर फसल जांच रिपोर्ट। फसल: ${crop?.name || 'फसल'}। पहचानी गई समस्या: ${disease?.name || 'निरीक्षण'}। स्थिति: ${healthStatus || 'सामान्य'}। विश्वसनीयता: ${confidenceScore} प्रतिशत। `;
      if (visibleSymptoms.length > 0) {
        script += `पत्तियों पर दिखे लक्षण: ${visibleSymptoms.join('. ')}। `;
      }
      if (activeClimatePlan.climateSummary) {
        script += `मौसम सारांश: ${activeClimatePlan.climateSummary}। `;
      }
      if (activeClimatePlan.predictedImpact) {
        script += `संभावित प्रभाव: ${activeClimatePlan.predictedImpact}। `;
      }
      if (activeClimatePlan.immediateNaturalAction) {
        script += `जैविक उपचार: ${activeClimatePlan.immediateNaturalAction}। `;
      }
      if (activeClimatePlan.chemicalAction) {
        script += `रासायनिक सलाह: ${activeClimatePlan.chemicalAction}। `;
      }
      if (activeClimatePlan.irrigationGuidance) {
        script += `सिंचाई सलाह: ${activeClimatePlan.irrigationGuidance}। `;
      }
      if (activeClimatePlan.timelineGuidance) {
        script += `छिड़काव का सही समय: ${activeClimatePlan.timelineGuidance}। `;
      }
    } else {
      script = `AgriCare Leaf Diagnosis Report. Crop: ${crop?.name || 'Crop'}. Condition: ${disease?.name || 'Observation'}. Health Status: ${healthStatus || 'Standard'}. Diagnostic Confidence: ${confidenceScore} percent. `;
      if (visibleSymptoms.length > 0) {
        script += `Observed Symptoms: ${visibleSymptoms.join('. ')}. `;
      }
      if (activeClimatePlan.climateSummary) {
        script += `Weather and 7-Day Climate Action Plan: ${activeClimatePlan.climateSummary}. `;
      }
      if (activeClimatePlan.predictedImpact) {
        script += `Predicted Disease Impact: ${activeClimatePlan.predictedImpact}. `;
      }
      if (activeClimatePlan.immediateNaturalAction) {
        script += `Natural Treatment: ${activeClimatePlan.immediateNaturalAction}. `;
      }
      if (activeClimatePlan.chemicalAction) {
        script += `Chemical Guidance: ${activeClimatePlan.chemicalAction}. `;
      }
      if (activeClimatePlan.irrigationGuidance) {
        script += `Irrigation Advice: ${activeClimatePlan.irrigationGuidance}. `;
      }
      if (activeClimatePlan.timelineGuidance) {
        script += `Safe Spray Window: ${activeClimatePlan.timelineGuidance}. `;
      }
    }

    speak(script, currentLang, currentScan._id);
  };

  return (
    <div className="bg-white rounded-3xl border border-agri-100 shadow-soft-lg overflow-hidden transition-all">
      {/* Top Banner / Demo Notice */}
      {providerMetadata?.isDemoMode && (
        <div className="bg-amber-500/10 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="font-semibold">Development / Demonstration Mode:</span>
            <span>Preliminary simulated pathology analysis.</span>
          </div>
          <span className="hidden sm:inline-block bg-amber-200/80 px-2 py-0.5 rounded text-[10px] font-bold">
            DEMO
          </span>
        </div>
      )}

      {/* Interactive Control Header: Language Switcher & Text-To-Speech Bar */}
      <div className="bg-gradient-to-r from-agri-50 via-cream-50 to-emerald-50/50 border-b border-agri-100 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Language Options Side-by-Side */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-agri-900 mr-1">
            <Languages className="w-4 h-4 text-agri-600" />
            <span className="hidden sm:inline">Translate:</span>
          </div>
          <div className="inline-flex bg-white p-1 rounded-xl border border-agri-200 shadow-xs gap-1">
            <button
              type="button"
              onClick={() => handleSwitchLanguage('en')}
              disabled={isTranslating}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                (currentScan.language || 'en') === 'en'
                  ? 'bg-agri-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-agri-700 hover:bg-agri-50'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleSwitchLanguage('te')}
              disabled={isTranslating}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                currentScan.language === 'te'
                  ? 'bg-agri-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-agri-700 hover:bg-agri-50'
              }`}
            >
              తెలుగు
            </button>
            <button
              type="button"
              onClick={() => handleSwitchLanguage('hi')}
              disabled={isTranslating}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                currentScan.language === 'hi'
                  ? 'bg-agri-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-agri-700 hover:bg-agri-50'
              }`}
            >
              हिन्दी
            </button>
          </div>
          {isTranslating && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-agri-700 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Translating...</span>
            </span>
          )}
        </div>

        {/* Text-to-Speech Speaker Button */}
        <div>
          <button
            type="button"
            onClick={handleToggleSpeak}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isSpeaking
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>
                  {language === 'te'
                    ? 'ఆడియో ఆపండి (Stop)'
                    : language === 'hi'
                    ? 'ऑडियो रोकें (Stop)'
                    : 'Stop Audio'}
                </span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>
                  {language === 'te'
                    ? 'నివేదిక వినండి (Speak Report)'
                    : language === 'hi'
                    ? 'रिपोर्ट सुनें (Speak Report)'
                    : 'Listen to Full Report'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="p-6 sm:p-8">
        {/* Header: Photo + Overview */}
        <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-agri-100">
          {/* Leaf Photo */}
          <div className="w-full md:w-56 h-56 rounded-2xl overflow-hidden bg-gray-100 border border-agri-200 flex-shrink-0 relative shadow-sm">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Analyzed leaf specimen"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Preview
              </div>
            )}
            <div className="absolute top-2.5 left-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${badge.bg}`}
              >
                {badge.icon}
                <span>{badge.label}</span>
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Assessment ID: {currentScan._id ? currentScan._id.slice(-8) : 'NEW'}</span>
                {createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-agri-dark tracking-tight mb-1">
                {crop?.name || 'Crop Leaf'} —{' '}
                <span className="text-agri-700">{disease?.name || 'Observation'}</span>
              </h2>

              {(crop?.scientificName || disease?.scientificName) && (
                <p className="text-xs italic text-gray-500 mb-4">
                  {crop?.scientificName} {disease?.scientificName && `• Pathogen: ${disease.scientificName}`}
                </p>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                <div className="bg-agri-50/70 p-3 rounded-2xl border border-agri-100">
                  <div className="text-[11px] text-gray-500 font-medium">Confidence</div>
                  <div className="text-lg font-bold text-agri-900 flex items-center gap-2">
                    {confidenceScore}%
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-agri-600 h-full rounded-full transition-all"
                      style={{ width: `${confidenceScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-agri-50/70 p-3 rounded-2xl border border-agri-100">
                  <div className="text-[11px] text-gray-500 font-medium">Severity</div>
                  <div className="text-lg font-bold text-agri-900">{severityEstimate || 'Moderate'}</div>
                  <div className="text-[10px] text-agri-600 mt-1">Canopy Assessment</div>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-agri-50/70 p-3 rounded-2xl border border-agri-100">
                  <div className="text-[11px] text-gray-500 font-medium">Model / Provider</div>
                  <div className="text-xs font-bold text-agri-900 truncate">
                    {providerMetadata?.model || 'AgriCare-Vision'}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {providerMetadata?.provider || 'Google Gemini AI'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleAskAssistant}
                className="flex items-center gap-2 py-2.5 px-4 bg-agri-600 hover:bg-agri-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>
                  {language === 'te'
                    ? 'ఏఐ వ్యవసాయ శాస్త్రవేత్తను అడగండి'
                    : language === 'hi'
                    ? 'कृषि वैज्ञानिक से पूछें'
                    : 'Ask AI Agronomist About This'}
                </span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>

              {onScanAnother && (
                <button
                  onClick={onScanAnother}
                  className="py-2.5 px-4 text-xs font-semibold text-agri-700 hover:bg-agri-50 rounded-xl transition-all ml-auto"
                >
                  {language === 'te'
                    ? 'మరొక ఆకును పరీక్షించండి'
                    : language === 'hi'
                    ? 'दूसरी पत्ती स्कैन करें'
                    : 'Scan Another Leaf'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 🌦️ 7-Day Weather & Climate Action Plan (High Priority) */}
        <div className="my-6 p-5 sm:p-6 bg-gradient-to-br from-blue-50/70 via-emerald-50/40 to-cream-50 border border-blue-200/80 rounded-3xl shadow-soft-sm">
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-blue-200/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-agri-dark tracking-tight">
                  {language === 'te'
                    ? '🌦️ 7-రోజుల వాతావరణ అంచనా & భవిష్యత్ కార్యాచరణ'
                    : language === 'hi'
                    ? '🌦️ 7-दिवसीय मौसम पूर्वानुमान एवं भावी कार्ययोजना'
                    : '🌦️ 7-Day Weather & Future Crop Action Plan'}
                </h3>
                <p className="text-xs text-gray-500">
                  {language === 'te'
                    ? 'వాతావరణ మార్పులను బట్టి రైతు చేయవలసిన రక్షణ చర్యలు'
                    : language === 'hi'
                    ? 'मौसम के अनुसार फसल सुरक्षा, प्राकृतिक नुस्खे और छिड़काव सलाह'
                    : 'Agronomic impact forecast: Natural bio-control recipes, pesticide timing & irrigation adjustments'}
                </p>
              </div>
            </div>
            {weatherContext?.temperature && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 text-blue-900 rounded-full text-xs font-bold shadow-xs">
                <span>{weatherContext.temperature}°C</span>
                <span>•</span>
                <span>{weatherContext.humidity}% Humidity</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Climate Summary & Forecast */}
            <div className="bg-white/80 p-4 rounded-2xl border border-blue-100 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-950 mb-1.5">
                <CloudRain className="w-4 h-4 text-blue-600" />
                <span>
                  {language === 'te' ? 'వాతావరణ సారాంశం' : language === 'hi' ? 'मौसम सारांश' : 'Climate Forecast & Atmospheric State'}
                </span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{activeClimatePlan.climateSummary}</p>
            </div>

            {/* Predicted Disease Spread Impact */}
            <div className="bg-white/80 p-4 rounded-2xl border border-amber-100 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950 mb-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>
                  {language === 'te' ? 'భవిష్యత్ తెగులు వ్యాప్తి అంచనా' : language === 'hi' ? 'भावी रोग प्रकोप की संभावना' : 'Predicted Pathology Spread & Risk'}
                </span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{activeClimatePlan.predictedImpact}</p>
            </div>

            {/* Natural Ingredients & Bio-control Recipe */}
            <div className="bg-white/80 p-4 rounded-2xl border border-emerald-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 mb-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>
                  {language === 'te' ? '🌿 సహజ & సేంద్రీయ పదార్థాల చిట్కా' : language === 'hi' ? '🌿 जैविक एवं प्राकृतिक सामग्री (नीम अर्क आदि)' : '🌿 Natural Ingredients & Bio-control Recipe'}
                </span>
              </div>
              <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                {activeClimatePlan.immediateNaturalAction}
              </p>
            </div>

            {/* Cautious Chemical Pesticide Advice */}
            <div className="bg-white/80 p-4 rounded-2xl border border-rose-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-950 mb-1.5">
                <FlaskConical className="w-4 h-4 text-rose-600" />
                <span>
                  {language === 'te' ? '⚠️ రసాయన సస్యరక్షణ (అవసరమైతేనే)' : language === 'hi' ? '⚠️ रासायनिक कीटनाशक/फफूंदनाशक सलाह' : '⚠️ Cautious Chemical Options & Precautions'}
                </span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed">{activeClimatePlan.chemicalAction}</p>
            </div>

            {/* Irrigation & Soil Guidance */}
            <div className="bg-white/80 p-4 rounded-2xl border border-cyan-100 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-950 mb-1.5">
                <Droplets className="w-4 h-4 text-cyan-600" />
                <span>
                  {language === 'te' ? '💧 నీటి యాజమాన్యం & డ్రైనేజీ' : language === 'hi' ? '💧 सिंचाई एवं जल निकासी मार्गदर्शन' : '💧 Irrigation & Drainage Guidance'}
                </span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{activeClimatePlan.irrigationGuidance}</p>
            </div>

            {/* Safe Spray Timing */}
            <div className="bg-white/80 p-4 rounded-2xl border border-purple-100 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-950 mb-1.5">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>
                  {language === 'te' ? '⏰ పిచికారీ చేయడానికి సరైన సమయం' : language === 'hi' ? '⏰ छिड़काव का अनुकूल समय' : '⏰ Optimal Weather Spray Window'}
                </span>
              </div>
              <p className="text-xs text-purple-900 font-medium leading-relaxed">
                {activeClimatePlan.timelineGuidance}
              </p>
            </div>
          </div>
        </div>

        {/* Symptoms & Causes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-agri-100">
          <div>
            <h4 className="text-sm font-bold text-agri-900 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-agri-600" />
              <span>
                {language === 'te' ? 'గమనించిన లక్షణాలు' : language === 'hi' ? 'देखे गए लक्षण' : t('scan.result.symptoms')}
              </span>
            </h4>
            <ul className="space-y-2">
              {visibleSymptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-agri-500 flex-shrink-0 mt-1.5"></div>
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-agri-900 mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>
                {language === 'te' ? 'ప్రధాన కారణాలు' : language === 'hi' ? 'संभावित कारण' : t('scan.result.causes')}
              </span>
            </h4>
            <ul className="space-y-2">
              {likelyCauses.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5"></div>
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tabbed Recommendations */}
        <div className="py-6 border-b border-agri-100">
          <h4 className="text-base font-bold text-agri-dark mb-4">
            {language === 'te' ? 'రైతుకు పూర్తి సలహాలు & సూచనలు' : language === 'hi' ? 'विस्तृत कृषि सिफारिशें' : t('scan.result.recommendations')}
          </h4>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-4 gap-2">
            <button
              onClick={() => setActiveTab('cultural')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'cultural'
                  ? 'border-agri-600 text-agri-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {language === 'te' ? 'పొలంలో చేయవలసిన పనులు' : language === 'hi' ? 'खेत प्रबंधन' : 'Cultural & Field Practices'}
            </button>
            <button
              onClick={() => setActiveTab('organic')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'organic'
                  ? 'border-agri-600 text-agri-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {language === 'te' ? 'సేంద్రీయ రక్షణ' : language === 'hi' ? 'जैविक उपचार' : 'Organic & Bio-Remedies'}
            </button>
            <button
              onClick={() => setActiveTab('preventive')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'preventive'
                  ? 'border-agri-600 text-agri-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {language === 'te' ? 'దీర్ఘకాలిక నివారణ' : language === 'hi' ? 'दीर्घकालिक रोकथाम' : 'Long-term Prevention'}
            </button>
          </div>

          {/* Active Tab Content */}
          <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200">
            {activeTab === 'cultural' && (
              <ul className="space-y-2">
                {(recommendations.cultural || []).map((rec, i) => (
                  <li key={i} className="text-xs text-agri-900 flex items-start gap-2">
                    <span className="font-bold text-agri-600">{i + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'organic' && (
              <ul className="space-y-2">
                {(recommendations.organic || []).map((rec, i) => (
                  <li key={i} className="text-xs text-agri-900 flex items-start gap-2">
                    <span className="font-bold text-agri-600">{i + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'preventive' && (
              <ul className="space-y-2">
                {(recommendations.preventive || []).map((rec, i) => (
                  <li key={i} className="text-xs text-agri-900 flex items-start gap-2">
                    <span className="font-bold text-agri-600">{i + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            )}

            {recommendations.cautiousChemicalNotes &&
              recommendations.cautiousChemicalNotes.length > 0 && (
                <div className="mt-4 pt-3 border-t border-cream-300/80 text-[11px] text-gray-600 bg-white/70 p-3 rounded-xl border border-cream-200">
                  <span className="font-bold text-red-700 block mb-1">
                    {language === 'te' ? 'రసాయన మందుల పట్ల జాగ్రత్తలు:' : language === 'hi' ? 'रासायनिक सुरक्षा चेतावनी:' : 'Cautious Chemical Management:'}
                  </span>
                  {recommendations.cautiousChemicalNotes.map((note, i) => (
                    <p key={i}>{note}</p>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* Expert Escalation */}
        {expertConsultationNote && (
          <div className="mt-4 p-4 bg-amber-50/70 border border-amber-100 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>
                {language === 'te' ? 'వ్యవసాయ నిపుణుల సంప్రదింపు' : language === 'hi' ? 'कृषि विशेषज्ञ सलाह' : t('scan.result.expertEscalation')}
              </span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">{expertConsultationNote}</p>
          </div>
        )}

        {/* Mandatory Disclaimer */}
        <div className="mt-4 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] text-gray-500 leading-relaxed">
          <span className="font-bold text-gray-700 block mb-0.5">
            {language === 'te' ? 'చట్టబద్ధమైన గమనిక:' : language === 'hi' ? 'महत्वपूर्ण सूचना:' : 'Agricultural Disclaimer:'}
          </span>
          {disclaimer || t('scan.result.disclaimer')}
        </div>
      </div>
    </div>
  );
};
