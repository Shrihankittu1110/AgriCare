/**
 * AgriCare Demo Crop Pathology Classifier
 * Clearly labeled demonstration and development provider used when an external AI vision key is not set.
 */

const demoDiagnoses = [
  {
    en: {
      crop: { name: 'Tomato', scientificName: 'Solanum lycopersicum', confidence: 92 },
      disease: { name: 'Early Blight', scientificName: 'Alternaria solani', confidence: 87 },
      healthStatus: 'Suspected Disease',
      confidenceScore: 87,
      severityEstimate: 'Moderate',
      visibleSymptoms: [
        'Dark brown to black concentric circular rings (target-like pattern) on mature lower leaves',
        'Yellow chlorotic halos surrounding the foliar lesions',
        'Partial lower canopy defoliation beginning at plant base',
      ],
      likelyCauses: [
        'Prolonged leaf wetness exceeding 8 hours from overhead irrigation or morning dew',
        'Pathogen overwintering in previous nightshade crop residue',
        'Warm temperatures between 24°C and 29°C with high ambient humidity',
      ],
      recommendations: {
        cultural: [
          'Prune affected lower leaves within 30 cm of ground and dispose away from the field',
          'Switch from overhead sprinkler to drip irrigation to keep leaf surfaces dry',
          'Apply organic straw mulch around plant bases to prevent soil splash during rain',
        ],
        organic: [
          'Foliar spray of cold-pressed Neem Oil (3-5 ml per liter) or Trichoderma viride bio-fungicide',
          'Copper hydroxide or copper oxychloride bio-compatible protective sprays early in the morning',
        ],
        preventive: [
          'Practice a minimum 2-year crop rotation with non-solanaceous crops (e.g. maize, legumes)',
          'Ensure adequate 60 cm row spacing to facilitate air circulation throughout canopy',
        ],
        cautiousChemicalNotes: [
          'If certified synthetic fungicides are required, strictly follow local agricultural university (ICAR/KVK) recommendations and respect minimum pre-harvest intervals (PHI).',
        ],
      },
      expertConsultationNote:
        'Consult your local Krishi Vigyan Kendra (KVK) extension officer if concentric spots spread upward past mid-canopy level.',
    },
    te: {
      crop: { name: 'టమోటా', scientificName: 'Solanum lycopersicum', confidence: 92 },
      disease: { name: 'ముందస్తు ఆకు మచ్చ తెగులు (Early Blight)', scientificName: 'Alternaria solani', confidence: 87 },
      healthStatus: 'Suspected Disease',
      confidenceScore: 87,
      severityEstimate: 'Moderate',
      visibleSymptoms: [
        'కింది ఆకులపై నల్లటి వలయాల వంటి గోధుమ రంగు మచ్చలు కనిపించడం',
        'మచ్చల చుట్టూ పసుపు రంగు వలయాలు ఏర్పడటం',
        'మొక్క కింది భాగంలో ఆకులు ఎండి రాలిపోవడం',
      ],
      likelyCauses: [
        'ఆకులపై ఎక్కువ సమయం తేమ నిలిచి ఉండటం',
        'గాలిలో అధిక తేమ మరియు 24°C నుండి 29°C ఉష్ణోగ్రత అనుకూలించడం',
        'గత పంట అవశేషాల ద్వారా శిలీంధ్రం వ్యాప్తి చెందడం',
      ],
      recommendations: {
        cultural: [
          'రోగం సోకిన కింది ఆకులను తుంచి పొలానికి దూరంగా నాశనం చేయండి',
          'ఆకులపై నీరు పడకుండా డ్రిప్ పద్ధతి ద్వారా మాత్రమే నీరు అందించండి',
          'మొక్క మొదళ్ల చుట్టూ ఎండు గడ్డితో మల్చింగ్ చేయండి',
        ],
        organic: [
          'వేప నూనె (లీటరు నీటికి 5 మి.లీ) లేదా ట్రైకోడెర్మా విరిడి పిచికారీ చేయండి',
          'ఉదయం వేళల్లో కాపర్ ఆక్సీక్లోరైడ్ రక్షక ద్రావణం పిచికారీ చేయండి',
        ],
        preventive: [
          'టమోటా తర్వాత వరి లేదా జొన్న వంటి ఇతర పంటలతో పంట మార్పిడి చేయండి',
          'మొక్కల మధ్య గాలి వెలుతురు బాగా ఆడేలా తగినంత దూరం పాటించండి',
        ],
        cautiousChemicalNotes: [
          'ఏదైనా రసాయన మందులను వాడే ముందు స్థానిక కృషి విజ్ఞాన కేంద్రం (KVK) అధికారుల సలహా తీసుకోండి.',
        ],
      },
      expertConsultationNote: 'మచ్చలు పై ఆకులకు కూడా వేగంగా వ్యాపిస్తే స్థానిక వ్యవసాయ అధికారిని వెంటనే సంప్రదించండి.',
    },
    hi: {
      crop: { name: 'टमाटर', scientificName: 'Solanum lycopersicum', confidence: 92 },
      disease: { name: 'अगेती झुलसा (Early Blight)', scientificName: 'Alternaria solani', confidence: 87 },
      healthStatus: 'Suspected Disease',
      confidenceScore: 87,
      severityEstimate: 'Moderate',
      visibleSymptoms: [
        'निचली पत्तियों पर गोल छल्लेदार गहरे भूरे या काले धब्बे बनना',
        'धब्बों के चारों ओर पीले रंग का घेरा दिखाई देना',
        'पौधे के निचले भाग की पत्तियों का सूखकर गिरना',
      ],
      likelyCauses: [
        'पत्तियों पर अधिक समय तक नमी या ओस का बने रहना',
        '24°C से 29°C तापमान और हवा में अत्यधिक आर्द्रता',
        'पुरानी फसल के अवशेषों में फफूंद का जीवित रहना',
      ],
      recommendations: {
        cultural: [
          'रोगग्रस्त निचली पत्तियों को तोड़कर खेत से दूर नष्ट कर दें',
          'फव्वारा सिंचाई के स्थान पर ड्रिप सिंचाई प्रणाली अपनाएं ताकि पत्तियां सूखी रहें',
          'पौधों की जड़ों के पास पुआल की मल्चिंग करें ताकि मिट्टी के छींटे न पड़ें',
        ],
        organic: [
          'नीम का तेल (5 मिली प्रति लीटर पानी) या ट्राइकोडर्मा विरिडी का छिड़काव करें',
          'सुबह के समय कॉपर ऑक्सीक्लोराइड का सुरक्षात्मक छिड़काव करें',
        ],
        preventive: [
          'गैर-सोलेनेसी फसलों (जैसे मक्का, दलहन) के साथ 2 वर्ष का फसल चक्र अपनाएं',
          'पौधों के बीच हवा के आवागमन के लिए उचित दूरी बनाए रखें',
        ],
        cautiousChemicalNotes: [
          'रासायनिक कवकनाशक का उपयोग करने से पहले कृषि विज्ञान केंद्र (KVK) के निर्देशों का पालन करें।',
        ],
      },
      expertConsultationNote: 'यदि रोग मध्यम ऊंचाई की पत्तियों तक तेजी से फैले तो तुरंत कृषि अधिकारी से संपर्क करें।',
    },
  },
  {
    en: {
      crop: { name: 'Cotton', scientificName: 'Gossypium hirsutum', confidence: 94 },
      disease: { name: 'Leaf Curl Virus', scientificName: 'Cotton Leaf Curl Geminivirus (CLCuV)', confidence: 89 },
      healthStatus: 'Suspected Disease',
      confidenceScore: 89,
      severityEstimate: 'High',
      visibleSymptoms: [
        'Upward and downward curling of young leaf margins',
        'Thickening and greening of primary and secondary leaf veins',
        'Enations (small leaf-like outgrowths) on the undersides of leaves',
      ],
      likelyCauses: [
        'Transmission through silverleaf whitefly (Bemisia tabaci) vectors',
        'High whitefly population favored by dry and warm weather',
        'Presence of alternate weed hosts nearby (e.g. Abutilon, Parthenium)',
      ],
      recommendations: {
        cultural: [
          'Eradicate weed hosts and self-sown cotton plants around field borders',
          'Install yellow sticky traps (15-20 traps per acre) to monitor and catch whiteflies',
          'Avoid excessive application of nitrogenous fertilizers which attract sucking pests',
        ],
        organic: [
          'Spray 5% Neem Seed Kernel Extract (NSKE) or Beauveria bassiana bio-pesticide',
          'Release natural predatory green lacewings (Chrysoperla carnea)',
        ],
        preventive: [
          'Sow CLCuV-tolerant certified hybrid varieties recommended for your agro-climatic zone',
          'Avoid staggered sowing in neighboring fields to break the vector cycle',
        ],
        cautiousChemicalNotes: [
          'Target sucking pest management conservatively; rotate chemical modes of action to prevent insecticide resistance.',
        ],
      },
      expertConsultationNote:
        'Leaf curl is a viral epidemic threat; alert your district agriculture officer if more than 10% of plants show enation symptoms.',
    },
    te: {
      crop: { name: 'పత్తి', scientificName: 'Gossypium hirsutum', confidence: 94 },
      disease: { name: 'పత్తి ఆకు ముడత వైరస్ (Leaf Curl Virus)', scientificName: 'Cotton Leaf Curl Geminivirus', confidence: 89 },
      healthStatus: 'Suspected Disease',
      confidenceScore: 89,
      severityEstimate: 'High',
      visibleSymptoms: [
        'చిగురు ఆకుల అంచులు పైకి లేదా కిందికి ముడుచుకుపోవడం',
        'ఆకు ఈనెలు లావుగా మారి ముదురు ఆకుపచ్చ రంగులోకి మారడం',
        'ఆకుల వెనుక భాగంలో చిన్న ఆకు వంటి బుడిపెలు ఏర్పడటం',
      ],
      likelyCauses: [
        'తెల్లదోమ (Whitefly) ద్వారా వైరస్ వ్యాప్తి చెందడం',
        'వెచ్చని మరియు పొడి వాతావరణంలో తెల్లదోమల సంఖ్య వేగంగా పెరగడం',
        'పొలం గట్లపై కలుపు మొక్కలు ఎక్కువగా ఉండటం',
      ],
      recommendations: {
        cultural: [
          'పొలం చుట్టూ ఉన్న కలుపు మొక్కలను మరియు తెగులు సోకిన మొక్కలను తొలగించండి',
          'ఎకరానికి 15-20 పసుపు రంగు జిగురు అట్టలను అమర్చి తెల్లదోమలను గమనించండి',
          'నత్రజని (యూరియా) ఎరువులను అధికంగా వేయవద్దు',
        ],
        organic: [
          '5% వేప గింజల కషాయం (NSKE) లేదా బవేరియా బాసియానా పిచికారీ చేయండి',
          'మిత్ర పురుగులైన క్రిసోపెర్లాను పొలంలో వదలండి',
        ],
        preventive: [
          'ఈ వైరస్‌ను తట్టుకునే ధృవీకరించిన విత్తనాలను మాత్రమే నాటండి',
          'పక్క పక్క పొలాలలో ఒకేసారి విత్తనాలు నాటేలా సమన్వయం చేసుకోండి',
        ],
        cautiousChemicalNotes: [
          'పురుగు మందులను విచక్షణారహితంగా వాడవద్దు, వ్యవసాయ శాస్త్రవేత్తల సలహా మేరకే పిచికారీ చేయండి.',
        ],
      },
      expertConsultationNote: 'ఆకు ముడత లక్షణాలు పొలంలో 10% కంటే ఎక్కువ కనిపిస్తే వెంటనే వ్యవసాయాధికారిని సంప్రదించండి.',
    },
    hi: {
      crop: { name: 'कपास', scientificName: 'Gossypium hirsutum', confidence: 94 },
      disease: { name: 'कपास पत्ती मरोड़ रोग (Leaf Curl Virus)', scientificName: 'Cotton Leaf Curl Virus', confidence: 89 },
      healthStatus: 'Suspected Disease',
      confidenceScore: 89,
      severityEstimate: 'High',
      visibleSymptoms: [
        'नई पत्तियों के किनारों का ऊपर या नीचे की ओर मुड़ जाना',
        'पत्ती की नसों का मोटा और गहरा हरा हो जाना',
        'पत्ती की निचली सतह पर छोटे पत्तीनुमा उभार (इनेशन) बनना',
      ],
      likelyCauses: [
        'सफेद मक्खी (Whitefly) कीट द्वारा वायरस का संचरण',
        'गर्म और शुष्क मौसम में सफेद मक्खी की आबादी में तीव्र वृद्धि',
        'खेत की मेड़ों पर जंगली खरपतवारों की उपस्थिति',
      ],
      recommendations: {
        cultural: [
          'खेत के चारों ओर के खरपतवारों को नष्ट करें',
          'प्रति एकड़ 15-20 पीले चिपचिपे ट्रैप लगाकर सफेद मक्खी की निगरानी करें',
          'नाइट्रोजन उर्वरकों (यूरिया) का अत्यधिक उपयोग न करें',
        ],
        organic: [
          '5% नीम बीज अर्क (NSKE) या ब्युवेरिया बेसियाना का छिड़काव करें',
          'प्राकृतिक शिकारी कीटों (क्राइसोपर्ला) को बढ़ावा दें',
        ],
        preventive: [
          'रोग रोधी प्रमाणित हाइब्रिड किस्मों की ही बुवाई करें',
          'आसपास के खेतों में एक ही समय पर बुवाई करें ताकि कीट चक्र टूट सके',
        ],
        cautiousChemicalNotes: [
          'कीटनाशकों का अंधाधुंध छिड़काव न करें; रासायनिक प्रतिरोध से बचने के लिए विशेषज्ञों की सलाह लें।',
        ],
      },
      expertConsultationNote: 'यदि खेत में 10% से अधिक पौधे प्रभावित दिखें तो तत्काल ब्लॉक कृषि अधिकारी को सूचित करें।',
    },
  },
  {
    en: {
      crop: { name: 'Rice / Paddy', scientificName: 'Oryza sativa', confidence: 91 },
      disease: { name: 'Brown Spot', scientificName: 'Bipolaris oryzae', confidence: 86 },
      healthStatus: 'Suspected Disease',
      confidenceScore: 86,
      severityEstimate: 'Moderate',
      visibleSymptoms: [
        'Small, circular to oval sesame-shaped brown spots on leaf blades',
        'Lesions feature yellowish halos with grayish centers on mature spots',
        'Reduced photosynthetic leaf area and premature leaf senescence',
      ],
      likelyCauses: [
        'Soil nutrient deficiency, particularly nitrogen and potassium scarcity',
        'Water stress or fluctuating drought followed by excessive wetness',
        'Infected seed sources carrying seed-borne fungal spores',
      ],
      recommendations: {
        cultural: [
          'Apply balanced fertilization based on soil health card testing',
          'Top-dress with potassium (MOP) to enhance plant cell wall strength',
          'Avoid severe drought stress by maintaining steady saturation in paddy fields',
        ],
        organic: [
          'Seed treatment with Pseudomonas fluorescens (10g per kg seed) prior to nursery sowing',
          'Foliar spray of 2% cow urine concoction mixed with neem extract as a bio-stimulant',
        ],
        preventive: [
          'Source certified disease-free seeds from authorized agricultural cooperatives',
          'Incorporate crop residues well in advance to ensure thorough decomposition',
        ],
        cautiousChemicalNotes: [
          'Judicious fungicide application (e.g. Edifenphos or Mancozeb) only when disease exceeds economic threshold levels.',
        ],
      },
      expertConsultationNote:
        'Consult agricultural extension if brown spots appear on grain glumes and panicles.',
    },
    te: {
      crop: { name: 'వరి', scientificName: 'Oryza sativa', confidence: 91 },
      disease: { name: 'వరి ఎండిన ఆకు మచ్చ తెగులు (Brown Spot)', scientificName: 'Bipolaris oryzae', confidence: 86 },
      healthStatus: 'Suspected Disease',
      confidenceScore: 86,
      severityEstimate: 'Moderate',
      visibleSymptoms: [
        'ఆకులపై నువ్వుల గింజ ఆకారంలో చిన్న గోధుమ రంగు మచ్చలు ఏర్పడటం',
        'మచ్చల మధ్య భాగం బూడిద రంగులో మరియు చుట్టూ పసుపు రంగు వలయం ఉండటం',
        'ఆకులు ముందుగానే పసుపు రంగులోకి మారి ఎండిపోవడం',
      ],
      likelyCauses: [
        'నేలలో నత్రజని మరియు పొటాష్ పోషకాల లోపం ఉండటం',
        'పొలంలో నీటి ఎద్దడి రావడం లేదా తగినంత తేమ లేకపోవడం',
        'విత్తనాల ద్వారా శిలీంధ్ర బీజాలు వ్యాపించడం',
      ],
      recommendations: {
        cultural: [
          'భూసార పరీక్ష ఆధారంగా సమతుల్య ఎరువులను వాడండి',
          'రోగ నిరోధక శక్తి పెంచడానికి పొటాష్ ఎరువులను సిఫార్సు మేరకు వేయండి',
          'పొలంలో తీవ్రమైన నీటి కొరత రాకుండా సమతుల్య తేమను కాపాడండి',
        ],
        organic: [
          'విత్తన శుద్ధికి సూడోమోనాస్ ఫ్లోరోసెన్స్ (కిలో విత్తనానికి 10 గ్రాములు) వాడండి',
          'వేప కషాయం లేదా జీవామృతం పిచికారీ చేయడం వల్ల మొక్కకు పోషణ అందుతుంది',
        ],
        preventive: [
          'ధృవీకరించిన నాణ్యమైన విత్తనాలను మాత్రమే ఉపయోగించండి',
          'గత పంట అవశేషాలు భూమిలో బాగా కుళ్లేలా లోతు దుక్కులు చేయండి',
        ],
        cautiousChemicalNotes: [
          'తెగులు తీవ్రత ఎక్కువగా ఉన్నప్పుడు మాత్రమే నిపుణుల సలహాతో సిఫార్సు చేసిన మందులను వాడండి.',
        ],
      },
      expertConsultationNote: 'కంకులపై కూడా గోధుమ రంగు మచ్చలు కనిపిస్తే వెంటనే వ్యవసాయ శాస్త్రవేత్తను సంప్రదించండి.',
    },
    hi: {
      crop: { name: 'धान (चावल)', scientificName: 'Oryza sativa', confidence: 91 },
      disease: { name: 'भूरा धब्बा रोग (Brown Spot)', scientificName: 'Bipolaris oryzae', confidence: 86 },
      healthStatus: 'Suspected Disease',
      confidenceScore: 86,
      severityEstimate: 'Moderate',
      visibleSymptoms: [
        'पत्तियों पर तिल के आकार के छोटे भूरे अंडाकार धब्बे बनना',
        'धब्बों के बीच में धूसर रंग और बाहर पीला घेरा होना',
        'पत्तियों का समय से पहले पीला पड़कर सूखना',
      ],
      likelyCauses: [
        'मिट्टी में पोषक तत्वों (विशेषकर पोटाश और नाइट्रोजन) की कमी',
        'खेत में नमी का अत्यधिक उतार-चढ़ाव या सूखा पड़ना',
        'संक्रमित बीजों के माध्यम से रोग का प्रसार',
      ],
      recommendations: {
        cultural: [
          'मृदा स्वास्थ्य कार्ड के अनुसार संतुलित खाद व पोटाश का उपयोग करें',
          'पौधों की सहनशक्ति बढ़ाने के लिए म्यूरेट ऑफ पोटाश (MOP) का प्रयोग करें',
          'खेत में पर्याप्त नमी बनाए रखें और लंबे समय तक सूखा न पड़ने दें',
        ],
        organic: [
          'बुवाई से पहले स्यूडोमोनास फ्लोरोसेंस (10 ग्राम प्रति किग्रा बीज) से बीज शोधन करें',
          'नीम का काढ़ा या जीवामृत का पत्तियों पर छिड़काव करें',
        ],
        preventive: [
          'केवल प्रमाणित एवं रोगमुक्त बीजों का ही उपयोग करें',
          'फसल अवशेषों को खेत में अच्छी तरह जुताई कर सड़ाएं',
        ],
        cautiousChemicalNotes: [
          'फफूंदनाशकों का प्रयोग केवल आर्थिक क्षति स्तर (ETL) पार होने पर ही कृषि विशेषज्ञ की देखरेख में करें।',
        ],
      },
      expertConsultationNote: 'यदि बालियों पर भी धब्बे दिखें तो तुरंत कृषि वैज्ञानिक या प्रसार कार्यकर्ता से संपर्क करें।',
    },
  },
  {
    en: {
      crop: { name: 'Tomato', scientificName: 'Solanum lycopersicum', confidence: 95 },
      disease: { name: 'Healthy Leaf Canopy', scientificName: 'None (Healthy)', confidence: 94 },
      healthStatus: 'Healthy',
      confidenceScore: 94,
      severityEstimate: 'None',
      visibleSymptoms: [
        'Vibrant, uniform green leaf coloration with no necrotic lesions or chlorosis',
        'Turgid leaf structure and normal venation pattern across canopy',
        'No visible signs of insect chewing, webbing, or frass',
      ],
      likelyCauses: [
        'Well-balanced soil fertility and optimal soil pH (6.0 - 6.8)',
        'Proper irrigation scheduling preventing waterlogging or drought stress',
        'Good canopy aeration and proactive pest scouting',
      ],
      recommendations: {
        cultural: [
          'Continue regular morning drip irrigation matching current crop growth stage',
          'Maintain clean weed-free zones around the drip lines',
          'Ensure sturdy trellising to keep foliage elevated from moist soil',
        ],
        organic: [
          'Apply periodic foliar bio-stimulants such as seaweed extract (2 ml/L) for plant vigor',
          'Fortify root rhizosphere with Trichoderma viride enriched farmyard manure',
        ],
        preventive: [
          'Conduct weekly field walks checking undersides of leaves for early aphids or thrips',
          'Monitor forecast for sudden humidity spikes or heavy rain events',
        ],
        cautiousChemicalNotes: [
          'No chemical interventions required. Avoid preventative prophylactic chemical sprays.',
        ],
      },
      expertConsultationNote:
        'Your crop shows excellent baseline vitality. Continue regular agronomic monitoring.',
    },
    te: {
      crop: { name: 'టమోటా', scientificName: 'Solanum lycopersicum', confidence: 95 },
      disease: { name: 'ఆరోగ్యకరమైన ఆకు (Healthy)', scientificName: 'ఏమీ లేదు (ఆరోగ్యకరం)', confidence: 94 },
      healthStatus: 'Healthy',
      confidenceScore: 94,
      severityEstimate: 'None',
      visibleSymptoms: [
        'ఆకు ఏపుగా, సహజమైన పచ్చదనం కలిగి ఎటువంటి మచ్చలు లేకుండా ఉండటం',
        'ఆకు ఈనెలు మరియు కణజాలం దృఢంగా ఉండటం',
        'పురుగులు తిన్న ఆనవాళ్లు లేదా గూళ్ళు ఏవీ కనిపించకపోవడం',
      ],
      likelyCauses: [
        'నేలలో తగినంత పోషకాలు మరియు సరైన pH స్థాయి ఉండటం',
        'సమతుల్య నీటి యాజమాన్యం మరియు మంచి సంరక్షణ',
        'సహజ సూర్యరశ్మి మరియు గాలి ప్రసరణ బాగుండటం',
      ],
      recommendations: {
        cultural: [
          'ప్రస్తుత నీటి తడుల పద్ధతిని ఇలాగే కొనసాగించండి',
          'మొక్క మొదళ్ల దగ్గర కలుపు లేకుండా శుభ్రంగా ఉంచండి',
          'ఆకులు నేలను తాకకుండా తగిన విధంగా ఆధారం కల్పించండి',
        ],
        organic: [
          'మొక్కల బలం కోసం క్రమం తప్పకుండా జీవామృతం లేదా సముద్రపు నాచు ద్రావణం వాడండి',
          'పొలానికి సేంద్రీయ ఎరువులను అందించండి',
        ],
        preventive: [
          'వారానికి ఒకసారి ఆకుల కింద రసం పీల్చే పురుగుల కోసం పరిశీలించండి',
          'వాతావరణ మార్పులను ఎప్పటికప్పుడు గమనించండి',
        ],
        cautiousChemicalNotes: [
          'ప్రస్తుతం ఎలాంటి రసాయన మందుల వాడకం అవసరం లేదు.',
        ],
      },
      expertConsultationNote: 'మీ పంట చాలా ఆరోగ్యకరంగా ఉంది. ఇదే సంరక్షణ పద్ధతులను కొనసాగించండి.',
    },
    hi: {
      crop: { name: 'टमाटर', scientificName: 'Solanum lycopersicum', confidence: 95 },
      disease: { name: 'स्वस्थ पत्ती (Healthy)', scientificName: 'कोई नहीं (स्वस्थ)', confidence: 94 },
      healthStatus: 'Healthy',
      confidenceScore: 94,
      severityEstimate: 'None',
      visibleSymptoms: [
        'पत्ती का प्राकृतिक हरा रंग और धब्बों से पूरी तरह मुक्त होना',
        'पत्ती की संरचना मजबूत और नसें पूरी तरह स्वस्थ होना',
        'कीटों या फफूंद के कोई लक्षण न होना',
      ],
      likelyCauses: [
        'मिट्टी में पर्याप्त पोषक तत्व और उचित जल निकासी',
        'नियमित ड्रिप सिंचाई और सही देखभाल',
        'पर्याप्त धूप और हवा का संचार',
      ],
      recommendations: {
        cultural: [
          'वर्तमान सिंचाई व्यवस्था को इसी प्रकार जारी रखें',
          'पौधों के आसपास खरपतवार न उगने दें',
          'पत्तियों को जमीन से ऊपर रखने के लिए सहारा दें',
        ],
        organic: [
          'पौधों की मजबूती के लिए जीवामृत या समुद्री शैवाल अर्क का उपयोग करें',
          'गोबर की अच्छी सड़ी खाद का प्रयोग जारी रखें',
        ],
        preventive: [
          'हफ्ते में एक बार पत्तियों की निचली सतह की जांच करते रहें',
          'मौसम के पूर्वानुमान पर नजर बनाए रखें',
        ],
        cautiousChemicalNotes: [
          'किसी भी प्रकार के रासायनिक छिड़काव की कोई आवश्यकता नहीं है।',
        ],
      },
      expertConsultationNote: 'आपकी फसल उत्तम स्वास्थ्य में है। सामान्य कृषि कार्य जारी रखें।',
    },
  },
];

let currentIndex = 0;

export const analyzeCropDemo = async (imagePath, targetLanguage = 'en') => {
  const lang = ['en', 'te', 'hi'].includes(targetLanguage) ? targetLanguage : 'en';
  const selected = demoDiagnoses[currentIndex % demoDiagnoses.length];
  currentIndex++;

  const diagnosis = JSON.parse(JSON.stringify(selected[lang] || selected.en));

  diagnosis.providerMetadata = {
    provider: 'AgriCare Agricultural Diagnostic Engine',
    model: 'Pathology-Demonstration-V1',
    isDemoMode: true,
  };

  diagnosis.disclaimer =
    lang === 'te'
      ? 'ఇది ఆఫ్‌లైన్ డెమో మోడ్ ఫలితం. AI లైవ్ సేవల కోసం బ్యాకెండ్‌లో API కీని సెట్ చేయండి. ఏవైనా సమస్యలుంటే వ్యవసాయ అధికారిని సంప్రదించండి.'
      : lang === 'hi'
      ? 'यह ऑफ़लाइन प्रदर्शन मोड का परिणाम है। लाइव AI सेवाओं के लिए बैकएंड में API कुंजी कॉन्फ़िगर करें। संदेह होने पर कृषि विशेषज्ञ से संपर्क करें।'
      : 'Development / Demo Mode: Simulated preliminary diagnostic for testing without active external vision API key. Configure GEMINI_API_KEY for live vision AI analysis.';

  return diagnosis;
};
