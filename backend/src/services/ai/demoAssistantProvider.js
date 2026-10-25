/**
 * AgriCare Demo Agricultural Assistant Provider
 * Provides grounded, practical agronomic Q&A in English, Telugu, and Hindi when API keys are not provided.
 */

export const askDemoAssistant = async ({
  messages,
  targetLanguage = 'en',
  cropContext = null,
  weatherContext = null,
}) => {
  const latestMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
  const lang = ['en', 'te', 'hi'].includes(targetLanguage) ? targetLanguage : 'en';

  let replyText = '';

  if (lang === 'te') {
    // Telugu Responses
    if (latestMessage.includes('yellow') || latestMessage.includes('పసుపు') || latestMessage.includes('ఆకులు')) {
      replyText = `ఆకులు పసుపు రంగులోకి మారడానికి ప్రధాన కారణాలు:
1. **నత్రజని (Nitrogen) లోపం**: కింది పాత ఆకులు మొదట పసుపుగా మారి ఎండిపోతాయి. సిఫార్సు మేరకు వేపపిండి లేదా సేంద్రీయ ఎరువులను అందించండి.
2. **అధిక తేమ లేదా నీరు నిలవడం**: వేర్లకు గాలి ఆడక ఆకులు పసుపుగా మారతాయి. పొలంలో మురుగునీటి పారుదల సౌకర్యం సరిచూసుకోండి.
3. **రసం పీల్చే పురుగులు**: ఆకుల అడుగున తెల్లదోమలు లేదా తామర పురుగులు రసం పీల్చడం వల్ల ఆకులు పసుపు రంగులోకి మారతాయి.
${cropContext ? `\nగమనిక: మీ ${cropContext.cropName || 'పంట'}లో ${cropContext.diseaseName || 'సమస్య'} అనుమానం ఉంది కాబట్టి ఆకుల అడుగు భాగాన్ని కూడా జాగ్రత్తగా పరిశీలించండి.` : ''}
ముఖ్యమైన సూచన: పురుగు మందులను వాడే ముందు స్థానిక వ్యవసాయ అధికారి లేదా KVK శాస్త్రవేత్తల సలహా తీసుకోండి.`;
    } else if (latestMessage.includes('rain') || latestMessage.includes('వర్షం') || latestMessage.includes('నీరు')) {
      replyText = `భారీ వర్షాలు కురిసిన తర్వాత రైతులు తీసుకోవాల్సిన ముఖ్యమైన జాగ్రత్తలు:
1. పొలంలో నీరు నిల్వ ఉండకుండా వెంటనే కాలువల ద్వారా బయటకు పంపండి.
2. అధిక తేమ వల్ల శిలీంధ్ర తెగుళ్లు వచ్చే అవకాశం ఉంది కాబట్టి మొక్క మొదళ్లకు గాలి తగిలేలా చూడండి.
3. వర్షం తగ్గిన 2-3 రోజుల వరకు ఎరువులు లేదా రసాయనాల పిచికారీని వాయిదా వేయండి.
4. నేల ఆరిన తర్వాత తేలికపాటి గొర్రు తోలి వేర్లకు ప్రాణవాయువు అందేలా చేయండి.`;
    } else if (latestMessage.includes('soil') || latestMessage.includes('నేల') || latestMessage.includes('భూమి')) {
      replyText = `నేల ఆరోగ్యం మరియు సారవంతాన్ని పెంచే ఉత్తమ పద్ధతులు:
1. పచ్చిరొట్ట ఎరువులైన జీలుగ, జనుము వంటి పంటలను సాగు చేసి పూత దశలో భూమిలో కలియదున్నండి.
2. బాగా మాగిన పశువుల ఎరువు లేదా వర్మీ కంపోస్టును ఎకరానికి 3-4 టన్నులు వేయండి.
3. ప్రతి 2-3 సంవత్సరాలకు ఒకసారి తప్పనిసరిగా భూసార పరీక్ష (Soil Health Card) చేయించండి.
4. రసాయన ఎరువులను సిఫార్సు చేసిన మోతాదులోనే వాడండి, మితిమీరి వాడవద్దు.`;
    } else {
      replyText = `నమస్కారం! నేను మీ అగ్రికేర్ AI వ్యవసాయ సహాయకుడిని.
${cropContext ? `మీరు ప్రస్తుతం స్కాన్ చేసిన ${cropContext.cropName || 'పంట'} (${cropContext.diseaseName || 'ఆరోగ్య పరిస్థితి'}) గురించి ఏదైనా అడగవచ్చు.\n` : ''}
పంట తెగుళ్ల గుర్తింపు, సేంద్రీయ నివారణ చర్యలు, నీటి యాజమాన్యం, ఎరువుల సమతుల్యత మరియు వాతావరణ ఆధారిత సలహాల గురించి మీ సందేహాలను ఇక్కడ అడగవచ్చు.

(గమనిక: ఇది డెమో మోడ్ సమాధానం. పూర్తి AI సామర్థ్యం కోసం GEMINI_API_KEY ను కాన్ఫిగర్ చేయండి.)`;
    }
  } else if (lang === 'hi') {
    // Hindi Responses
    if (latestMessage.includes('yellow') || latestMessage.includes('पीली') || latestMessage.includes('पत्तियां')) {
      replyText = `पत्तियों के पीले पड़ने (क्लोरोसिस) के मुख्य कारण एवं समाधान:
1. **नाइट्रोजन की कमी**: निचली पुरानी पत्तियां पहले पीली पड़ती हैं। संतुलित रूप से कम्पोस्ट या अनुशंसित उर्वरक डालें।
2. **जलभराव**: खेत में पानी ठहरने से जड़ों को ऑक्सीजन नहीं मिलती, जिससे पत्तियां पीली पड़ जाती हैं। उचित जल निकासी करें।
3. **रस चूसक कीट**: सफेद मक्खी या एफिड्स पत्तियों का रस चूसते हैं। 5% नीम तेल का छिड़काव उपयोगी रहता है।
${cropContext ? `\nसक्रिय संदर्भ: आपकी ${cropContext.cropName || 'फसल'} में ${cropContext.diseaseName || 'समस्या'} की आशंका पाई गई है, इसलिए पत्ती के निचले हिस्से की भी जांच करें।` : ''}
सलाह: गंभीर स्थिति में हमेशा स्थानीय कृषि विज्ञान केंद्र (KVK) के अधिकारियों से मार्गदर्शन लें।`;
    } else if (latestMessage.includes('rain') || latestMessage.includes('बारिश') || latestMessage.includes('पानी')) {
      replyText = `भारी बारिश के पश्चात खेत में करने योग्य आवश्यक कार्य:
1. खेत से अतिरिक्त वर्षा जल को तुरंत नालियों के माध्यम से बाहर निकालें।
2. अधिक नमी के कारण फफूंद जनित रोगों का खतरा बढ़ जाता है, अतः पौधों के पास वायु संचार सुनिश्चित करें।
3. बारिश के तुरंत बाद कीटनाशक या पर्णीय खाद का छिड़काव न करें, जब तक कि पत्तियां पूरी तरह सूख न जाएं।
4. मिट्टी की ऊपरी परत सूखने पर हल्की निराई-गुड़ाई करें ताकि जड़ों को हवा मिल सके।`;
    } else if (latestMessage.includes('soil') || latestMessage.includes('मिट्टी') || latestMessage.includes('खाद')) {
      replyText = `मिट्टी की उर्वरा शक्ति सुधारने के टिकाऊ उपाय:
1. हरी खाद के लिए ढैंचा या सनई की बुवाई करें और फूल आने पर खेत में पलटाई करें।
2. अच्छी सड़ी हुई गोबर की खाद या केंचुआ खाद (वर्मीकम्पोस्ट) का नियमित उपयोग करें।
3. मृदा स्वास्थ्य कार्ड (Soil Health Card) के आधार पर ही आवश्यक पोषक तत्वों का प्रयोग करें।
4. फसल चक्र अपनाएं और दलहनी फसलों को शामिल करें।`;
    } else {
      replyText = `नमस्ते! मैं आपका एग्रीकेयर AI कृषि सहायक हूँ।
${cropContext ? `आप वर्तमान में स्कैन की गई ${cropContext.cropName || 'फसल'} (${cropContext.diseaseName || 'स्थिति'}) के बारे में प्रश्न पूछ सकते हैं।\n` : ''}
आप फसल रोगों की रोकथाम, जैविक उपचार, मौसम के अनुसार कृषि कार्य, सिंचाई और खाद प्रबंधन पर कोई भी सवाल पूछ सकते हैं।

(नोट: यह डेमो मोड उत्तर है। उन्नत AI कार्यक्षमता के लिए बैकएंड में GEMINI_API_KEY कॉन्फ़िगर करें।)`;
    }
  } else {
    // English Responses
    if (latestMessage.includes('yellow') || latestMessage.includes('leaf') || latestMessage.includes('leaves')) {
      replyText = `Common causes for yellowing leaves (chlorosis) and recommended agronomic actions:
1. **Nutrient Deficiency (Nitrogen)**: Symptoms appear first on older, lower leaves as general yellowing. Apply well-decomposed organic manure or balanced fertilization based on soil testing.
2. **Overwatering / Root Hypoxia**: Standing water prevents roots from breathing and absorbing nutrients. Check field drainage channels immediately.
3. **Sucking Pest Infestation**: Aphids, mites, or whiteflies piercing leaf tissues cause yellow speckling. Inspect leaf undersides and consider certified neem oil formulation (3-5 ml/L).
${cropContext ? `\nActive Scan Reference: Your ${cropContext.cropName || 'crop'} has recorded ${cropContext.diseaseName || 'observation'}. Monitor symptoms across surrounding plants.` : ''}
Safety Guidance: Always verify chemical remedies with local agricultural extension officers (KVK/ICAR) before application.`;
    } else if (latestMessage.includes('rain') || latestMessage.includes('weather') || latestMessage.includes('water')) {
      replyText = `Essential field management steps following rainfall:
1. Ensure prompt surface drainage to prevent water stagnation in the root zone.
2. Refrain from spraying foliar fertilizers or chemical pesticides when foliage is wet or when rain is imminent.
3. High moisture combined with warmth accelerates fungal spore germination; scout for early leaf spots on lower canopies.
4. Perform light inter-cultivation once soil surface is friable to aerate the root system.`;
    } else if (latestMessage.includes('soil') || latestMessage.includes('fertilizer') || latestMessage.includes('health')) {
      replyText = `Sustainable practices to maintain and restore soil fertility:
1. Incorporate green manure crops (such as Sesbania/Dhaincha or Sunhemp) at flowering stage.
2. Apply 3-5 tonnes of well-rotted farmyard manure (FYM) or vermicompost per acre annually.
3. Test soil every two years via the National Soil Health Card scheme to avoid over-application of synthetic nitrogen.
4. Practice crop rotation with leguminous crops to fix atmospheric nitrogen biologically.`;
    } else {
      replyText = `Hello! I am your AgriCare AI Agricultural Assistant.
${cropContext ? `You have an active scan for ${cropContext.cropName || 'crop'} (${cropContext.diseaseName || 'condition'}). You can ask specific questions about this diagnosis.\n` : ''}
I can assist with:
- Crop disease identification and organic cultural remedies
- Weather-aware spraying and irrigation timing
- Soil health, composting, and nutrient management
- IPM (Integrated Pest Management) practices

(Notice: Running in development demo mode. Configure GEMINI_API_KEY in the backend for live generative AI responses.)`;
    }
  }

  return {
    content: replyText,
    providerMetadata: {
      provider: 'AgriCare Demo Agricultural Knowledge Engine',
      model: 'demo-agronomy-v1',
      isDemoMode: true,
    },
  };
};
