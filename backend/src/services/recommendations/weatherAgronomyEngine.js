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

/**
 * Predicts future crop impact based on weather forecast and prescribes
 * precise natural and protective actions in English, Telugu, or Hindi.
 */
export const generateClimateActionPlan = ({
  cropName = 'Crop',
  diseaseName = 'Foliar Issue',
  currentWeather = {},
  forecastDays = [],
  targetLanguage = 'en',
}) => {
  const temp = currentWeather?.temperature || 28;
  const humidity = currentWeather?.humidity || 75;
  const wind = currentWeather?.windSpeed || 10;
  const rainNext48h = forecastDays.slice(0, 3).some((d) => (d.precipitationProbability || 0) > 40 || (d.precipitationSum || 0) > 2);

  const lang = ['en', 'te', 'hi'].includes(targetLanguage) ? targetLanguage : 'en';

  if (lang === 'te') {
    return {
      climateSummary: `ప్రస్తుత ఉష్ణోగ్రత ${temp}°C, గాలిలో తేమ ${humidity}% మరియు గాలి వేగం ${wind} km/h గా ఉంది. రాబోయే 3 రోజుల్లో ${rainNext48h ? 'వర్షం కురిసే అవకాశం ఉంది' : 'వాతావరణం పొడిగా ఉండే అవకాశం ఉంది'}.`,
      predictedImpact: rainNext48h
        ? `అధిక తేమ మరియు వర్షం కారణంగా ${diseaseName} తెగులు శిలీంధ్ర బీజాలు వేగంగా వ్యాపించి పక్క ఆకులకు కూడా సోకే ప్రమాదం ఉంది.`
        : `పొడి వాతావరణం కొనసాగితే రసం పీల్చే పురుగుల బెడద పెరిగే అవకాశం ఉంది, అయితే శిలీంధ్ర వ్యాప్తి మందగిస్తుంది.`,
      immediateNaturalAction:
        `సేంద్రీయ రక్షణ: లీటరు నీటికి 5 మి.లీ వేప నూనె (Neem Oil) లేదా ట్రైకోడెర్మా విరిడి (Trichoderma viride - 5 గ్రా/లీ) కలిపి పిచికారీ చేయండి. ఇది మొక్కకు సహజ రక్షణ కవచంలా పనిచేస్తుంది.`,
      chemicalAction:
        `రసాయన సస్యరక్షణ: తెగులు తీవ్రత 15% మించితేనే కాపర్ ఆక్సీక్లోరైడ్ (2.5 గ్రా/లీ) పిచికారీ చేయండి. వర్షానికి ముందు కాకుండా వర్షం తగ్గిన తర్వాత ఆకులు ఆరినప్పుడే పిచికారీ చేయాలి.`,
      irrigationGuidance: rainNext48h
        ? `రాబోయే 48 గంటల్లో వర్షం ఉన్నందున పొలానికి నీటి తడులు ఇవ్వడం తక్షణమే నిలిపివేయండి. మురుగునీరు పోయే కాలువలను శుభ్రం చేయండి.`
        : `నేలలో తేమను బట్టి ఉదయం వేళల్లో మాత్రమే తేలికపాటి నీటి తడులు ఇవ్వండి.`,
      timelineGuidance:
        `సమయం: ఉదయం 7:00 నుండి 9:30 గంటల మధ్యలో, గాలి వేగం 12 km/h కంటే తక్కువగా ఉన్నప్పుడు మాత్రమే పిచికారీ చేయండి.`,
    };
  }

  if (lang === 'hi') {
    return {
      climateSummary: `वर्तमान तापमान ${temp}°C, आर्द्रता ${humidity}% और हवा की गति ${wind} km/h है। आगामी 3 दिनों में ${rainNext48h ? 'वर्षा की प्रबल संभावना है' : 'मौसम सामान्य एवं शुष्क रहेगा'}।`,
      predictedImpact: rainNext48h
        ? `उच्च आर्द्रता और वर्षा के कारण ${diseaseName} के बीजाणु तेजी से फैल सकते हैं, जिससे स्वस्थ पत्तियों में संक्रमण का खतरा बढ़ जाएगा।`
        : `शुष्क परिस्थितियों में रस चूसक कीटों की सक्रियता बढ़ सकती है, हालांकि फफूंद का फैलाव सीमित रहेगा।`,
      immediateNaturalAction:
        `जैविक उपचार: 5 मिली प्रति लीटर नीम का तेल (Neem Oil) या ट्राइकोडर्मा विरिडी (5 ग्राम/लीटर) का छिड़काव करें। यह पत्तियों पर प्राकृतिक सुरक्षा परत बनाता है।`,
      chemicalAction:
        `रासायनिक सलाह: गंभीर स्थिति में कॉपर ऑक्सीक्लोराइड (2.5 ग्राम/लीटर) का छिड़काव कृषि अधिकारी की सलाह पर करें। बारिश से ठीक पहले छिड़काव न करें ताकि दवा बह न जाए।`,
      irrigationGuidance: rainNext48h
        ? `आगामी 48 घंटों में वर्षा को देखते हुए सिंचाई स्थगित करें और खेत में जल निकासी की व्यवस्था सुनिश्चित करें।`
        : `मिट्टी की नमी देखकर केवल सुबह के समय हल्की सिंचाई करें।`,
      timelineGuidance:
        `सही समय: सुबह 7:00 से 9:30 बजे के बीच, जब हवा शांत (12 km/h से कम) हो, तभी छिड़काव करें।`,
    };
  }

  // English
  return {
    climateSummary: `Current temperature is ${temp}°C with ${humidity}% relative humidity and wind speed of ${wind} km/h. Next 3 days show ${rainNext48h ? 'moderate to high probability of precipitation' : 'predominantly dry conditions'}.`,
    predictedImpact: rainNext48h
      ? `High ambient moisture combined with upcoming rainfall will accelerate spore dispersion of ${diseaseName}, increasing risk of secondary foliar lesions.`
      : `Drier weather will suppress fungal sporulation but may favor sucking pests; monitor canopy hydration carefully.`,
    immediateNaturalAction:
      `Organic / Bio-control: Apply cold-pressed Neem Oil (5 ml/L water with a mild emulsifier) or Trichoderma viride (5g/L) to establish an organic bio-fungal barrier across healthy leaves.`,
    chemicalAction:
      `Cautious Chemical Control: If foliar lesions exceed 15% of the canopy, consider Copper Oxychloride (2.5g/L). Do NOT spray right before rainfall; apply only after foliage dries to prevent environmental runoff.`,
    irrigationGuidance: rainNext48h
      ? `Postpone scheduled irrigation for the next 48 hours to avoid root hypoxia and soil waterlogging. Clear drainage furrows immediately.`
      : `Maintain standard light morning drip irrigation based on soil tensiometer readings.`,
    timelineGuidance:
      `Application Window: Spray between 7:00 AM – 9:30 AM when ambient wind velocities are below 12 km/h to prevent drift and evaporation loss.`,
  };
};
