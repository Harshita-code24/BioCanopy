import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Helper to calculate Heat Index (Rothfusz equation / Steadman approximation)
function calculateHeatIndex(tempC, humidity) {
  // Convert C to F
  const T = (tempC * 9) / 5 + 32;
  const RH = humidity;

  // Simple equation first
  let HI = 0.5 * (T + 61.0 + (T - 68.0) * 1.2 + RH * 0.094);

  // Full Rothfusz regression if HI >= 80F
  if (HI >= 80) {
    HI =
      -42.379 +
      2.04901523 * T +
      10.14333127 * RH -
      0.22475541 * T * RH -
      0.00683783 * T * T -
      0.05481717 * RH * RH +
      0.00122874 * T * T * RH +
      0.00085282 * T * RH * RH -
      0.00000199 * T * T * RH * RH;
  }

  // Convert back to Celsius
  return Number((((HI - 32) * 5) / 9).toFixed(1));
}

// Generate dynamic hourly commute safety breakdown based on temperature and solar peak
function generateHourlyForecast(baseTemp, lang = 'en') {
  const safeLabel = lang === 'hi' ? 'सुरक्षित' : lang === 'mr' ? 'सुरक्षित' : 'Safe';
  const cautionLabel = lang === 'hi' ? 'सतर्क रहें' : lang === 'mr' ? 'काळजी घ्या' : 'Caution';
  const avoidLabel = lang === 'hi' ? 'टालें' : lang === 'mr' ? 'टाळा' : 'Avoid';

  // Diurnal temperature offset curve relative to peak afternoon
  const slots = [
    { hour: '7 AM', tempOffset: -8, radiation: 'Low' },
    { hour: '9 AM', tempOffset: -4, radiation: 'Moderate' },
    { hour: '11 AM', tempOffset: -1, radiation: 'High' },
    { hour: '1 PM', tempOffset: +1, radiation: 'Severe' },
    { hour: '3 PM', tempOffset: +2, radiation: 'Peak' },
    { hour: '5 PM', tempOffset: 0, radiation: 'High' },
    { hour: '7 PM', tempOffset: -4, radiation: 'Low' },
    { hour: '9 PM', tempOffset: -7, radiation: 'None' },
  ];

  return slots.map((slot) => {
    const slotTemp = baseTemp + slot.tempOffset;
    let status = safeLabel;
    let color = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

    if (slotTemp >= 40 || (slotTemp >= 37 && (slot.hour === '1 PM' || slot.hour === '3 PM'))) {
      status = avoidLabel;
      color = 'bg-red-500/20 text-red-300 border-red-500/30';
    } else if (slotTemp >= 34 || slot.hour === '11 AM' || slot.hour === '5 PM') {
      status = cautionLabel;
      color = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }

    return {
      hour: slot.hour,
      temp: slotTemp,
      radiation: slot.radiation,
      status,
      color,
    };
  });
}

// Comprehensive Clinical & Environmental Rules Engine
function evaluateClinicalRules({ temp, city, humidity = 45, aqi = 140, persona = 'general', lang = 'en' }) {
  const heatIndex = calculateHeatIndex(temp, humidity);
  const asphaltTemp = Number((temp + 7.5 + (temp > 38 ? 2.5 : 0)).toFixed(0));

  let level, headline, body, badge, badgeColor, hydration, safeHours, riskLevel;

  if (temp >= 42 || heatIndex >= 48) {
    riskLevel = 'extreme';
    if (lang === 'hi') {
      level = 'तीव्र लू चेतावनी (रेड अलर्ट)';
      badge = 'अत्यधिक आपातकालीन स्तर';
      badgeColor = 'bg-red-500/20 text-red-300 border-red-500/40';
      headline = 'भीषण ग्रीष्म लहर: बाह्य गतिविधियां जानलेवा हो सकती हैं';
      body = `डामर का तापमान ${asphaltTemp}°C पार कर चुका है। प्रत्यक्ष सूर्य में 15 मिनट से अधिक न रहें। हीटस्ट्रोक और डिहाइड्रेशन का खतरा अधिकतम है।`;
      hydration = 'प्रति २०-३० मिनट में ५०० मिली ओआरएस या नींबू पानी पिएं';
      safeHours = 'प्रातः ९:३० से पहले या सायं ७:०० के बाद';
    } else if (lang === 'mr') {
      level = 'अति तीव्र उष्णतेची लाट (रेड अलर्ट)';
      badge = 'अत्यंत धोकादायक';
      badgeColor = 'bg-red-500/20 text-red-300 border-red-500/40';
      headline = 'अति तीव्र उष्णतेचा इशारा: दुपारच्या उन्हात बाहेर पडणे टाळा';
      body = `डांबरी रस्त्यांचे तापमान ${asphaltTemp}°C च्या वर पोहोचले आहे. सनस्ट्रोक आणि निर्जलीकरणाचा तीव्र धोका आहे. सावलीच्या मार्गांचाच वापर करा.`;
      hydration = 'दर २०-३० मिनिटांनी ५०० मिली ओआरएस किंवा इलेक्ट्रोलाइट्स प्या';
      safeHours = 'सकाळी ९:३० पूर्वी किंवा संध्याकाळी ७:०० नंतर';
    } else {
      level = 'Extreme Heatwave Response (Red Alert)';
      badge = 'Extreme Warning';
      badgeColor = 'bg-red-500/20 text-red-300 border-red-500/40';
      headline = 'Severe Solar Load: Exposed Outdoor Transit Poses Acute Health Hazard';
      body = `Asphalt surface temperature reaches ~${asphaltTemp}°C under direct sun. Limit continuous exposure to under 15 mins. Significant risk of heat cramps and hyperthermia.`;
      hydration = 'Drink 500ml oral rehydration solution (ORS) or water every 20-30 mins';
      safeHours = 'Before 9:30 AM or after 7:00 PM';
    }
  } else if (temp >= 37 || heatIndex >= 41) {
    riskLevel = 'high';
    if (lang === 'hi') {
      level = 'दोपहर की उष्णता चेतावनी (ऑरेंज अलर्ट)';
      badge = 'उच्च सतर्कता';
      badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      headline = 'तेज धूप व उमस: छायादार हरित गलियारों का उपयोग अनिवार्य';
      body = `डामरी सड़कें ऊष्मा संचित कर रही हैं (${asphaltTemp}°C)। दोपहर १२ से ४ के मध्य गैर-जरूरी आवागमन टालें तथा शीतलता केंद्र खोजें।`;
      hydration = 'प्रति ४० मिनट में ४०० मिली जल व नारियल पानी लें';
      safeHours = 'प्रातः ११:०० से पहले या सायं ५:३० के बाद';
    } else if (lang === 'mr') {
      level = 'दुपारचा उष्णता इशारा (ऑरेंज अलर्ट)';
      badge = 'उच्च दक्षता';
      badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      headline = 'दुपारची तीव्र उष्णता: सावलीच्या मार्गानेच प्रवास करा';
      body = `रस्त्यांचे तापमान ${asphaltTemp}°C असून थेट उन्हामुळे थकवा येऊ शकतो. दुपारी १२ ते ४ दरम्यान सावली नसलेल्या ठिकाणी थांबणे टाळा.`;
      hydration = 'दर ४० मिनिटांनी ४०० मिली पाणी किंवा लिंबू सरबत प्या';
      safeHours = 'सकाळी ११:०० पूर्वी किंवा संध्याकाळी ५:३० नंतर';
    } else {
      level = 'Midday Thermal Alert (Orange Advisory)';
      badge = 'High Advisory';
      badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      headline = 'Intense Midday Solar Gain: Utilize Shaded Canopy Corridors';
      body = `Unshaded asphalt radiating at ~${asphaltTemp}°C. Avoid direct sun between 12:00 PM and 4:00 PM. High cumulative thermal strain on pedestrians.`;
      hydration = 'Drink 400ml fluids every 40-45 mins with added electrolytes';
      safeHours = 'Before 11:00 AM or after 5:30 PM';
    }
  } else if (temp >= 32 || heatIndex >= 35) {
    riskLevel = 'moderate';
    if (lang === 'hi') {
      level = 'मध्यम तापमान सतर्कता (येलो)';
      badge = 'मध्यम परामर्श';
      badgeColor = 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      headline = 'मध्यम गर्मी: छायादार रास्तों पर आवागमन सुरक्षित';
      body = `तापमान सामान्य से अधिक है। धूप से बचाव के लिए सूती कपड़े और टोपी का प्रयोग करें।`;
      hydration = 'प्रति घंटे २५० मिली जलपान करें';
      safeHours = 'छायादार मार्गों के साथ सभी घंटे उपयुक्त';
    } else if (lang === 'mr') {
      level = 'मध्यम उष्णता सूचना (येलो)';
      badge = 'मध्यम सल्ला';
      badgeColor = 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      headline = 'मध्यम उष्णता: झाडांच्या सावलीतून प्रवास करणे हितावह';
      body = `हवामान उबदार आहे. शरीरातील पाण्याची पातळी टिकवण्यासाठी वेळोवेळी पाणी प्या.`;
      hydration = 'दर तासाला २५० मिली पाणी प्या';
      safeHours = 'सावलीच्या रस्त्यांनी सर्व वेळ सुरक्षित';
    } else {
      level = 'Moderate Warm Protocol (Yellow)';
      badge = 'Moderate Advisory';
      badgeColor = 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      headline = 'Warm Day: Walking Safe With Shaded Canopy Route Choices';
      body = `Ambient conditions are warm but manageable. Tree canopy coverage on pedestrian routes keeps microclimate ~4°C cooler.`;
      hydration = 'Hydrate with 250ml water every hour';
      safeHours = 'All hours with shaded walking paths';
    }
  } else {
    riskLevel = 'low';
    if (lang === 'hi') {
      level = 'सुखद मौसम (ग्रीन विंडो)';
      badge = 'आरामदायक समय';
      badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      headline = 'आरामदायक मौसमी स्थिति: आउटडोर आवागमन के लिए अनुकूल';
      body = `थर्मल तनाव न्यूनतम है। पैदल चलने, साइकिलिंग और सार्वजनिक स्थानों पर भ्रमण के लिए आदर्श स्थिति।`;
      hydration = 'सामान्य दैनिक जलपान (२.५ लीटर)';
      safeHours = 'सभी घंटे पूर्णतः सुरक्षित';
    } else if (lang === 'mr') {
      level = 'सुखद हवामान (ग्रीन विंडो)';
      badge = 'सुखद वेळ';
      badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      headline = 'आनंददायी हवामान: मैदानी हालचालींसाठी उत्तम वेळ';
      body = `उष्णतेचा ताण नाही. पायी चालण्यासाठी आणि सायकलिंगसाठी उत्तम वातावरण.`;
      hydration = 'नेहमीप्रमाणे पाणी प्या (२.५ लीटर)';
      safeHours = 'सर्व वेळ पूर्णपणे सुरक्षित';
    } else {
      level = 'Comfortable Window (Green Phase)';
      badge = 'Comfortable Window';
      badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      headline = 'Optimal Thermal Window: Safe Outdoor Transit & Recreation';
      body = `Low atmospheric heat stress. Excellent conditions for pedestrian transit, outdoor exercise, and urban cycling.`;
      hydration = 'Normal daily fluid intake (2.0L - 2.5L)';
      safeHours = 'All daylight and evening hours safe';
    }
  }

  // Demographic specific guidance
  const personaTips = {
    general: {
      en: 'Carry a refillable water bottle, wear UV-protective sunglasses, and favor tree-canopied pedestrian sidewalks.',
      hi: 'पानी की बोतल साथ रखें, यूवी चश्मा पहनें और पेड़ों की छाया वाले रास्तों का चयन करें।',
      mr: 'पाण्याची बाटली सोबत ठेवा, गॉगल वापरा आणि सावलीच्या रस्त्यांचा वापर करा.',
    },
    elderly: {
      en: 'Strictly avoid direct sunlight between 11:30 AM - 4:30 PM. Cardiovascular strain increases sharply at ambient temps >38°C. Stay in well-ventilated or cool rooms.',
      hi: 'प्रातः ११:३० से सायं ४:३० तक बाहर न निकलें। ३८°C से ऊपर दिल और रक्तचाप पर दबाव बढ़ता है। शीतलता में रहें।',
      mr: 'सकाळी ११:३० ते दुपारी ४:३० दरम्यान बाहेर पडणे टाळा. उष्णतेमुळे रक्तदाबावर ताण येऊ शकतो. थंड जागेत राहा.',
    },
    children: {
      en: 'Suspend outdoor sports and playground activities during peak heat. Ensure loose-fitting light cotton clothing and frequent sips of water.',
      hi: 'दोपहर में खेलकूद और खेल के मैदान की गतिविधियां स्थगित रखें। ढीले सूती कपड़े पहनाएं व समय-समय पर पानी पिलाएं।',
      mr: 'दुपारच्या वेळी मैदानावरील खेळ थांबवा. सैल सुती कपडे वापरा आणि वारंवार पाणी पिण्यास सांगा.',
    },
    outdoor_workers: {
      en: 'Mandatory 15-minute shaded rest breaks every 45-60 minutes. Keep a wet cotton towel around neck and consume ORS electrolytes hourly.',
      hi: 'प्रति ४५ मिनट में १५ मिनट छाया में विश्राम अनिवार्य। गर्दन पर गीला सूती कपड़ा रखें और ओआरएस का सेवन करें।',
      mr: 'दर ४५ मिनिटांनी १५ मिनिटे सावलीत विश्रांती घ्या. मानेभोवती ओला रुमाल ठेवा आणि ओआरएस प्या.',
    },
    athletes: {
      en: 'Shift strenuous aerobic running/cycling workouts to before 6:30 AM or after 7:30 PM to avoid heat syncope and dehydration.',
      hi: 'दौड़ व भारी कसरत सुबह ६:३० से पहले या रात ७:३० के बाद ही करें ताकि हीट सिंकोप से बचा जा सके।',
      mr: 'धावणे किंवा जड व्यायाम सकाळी ६:३० पूर्वी किंवा संध्याकाळी ७:३० नंतरच करा.',
    },
  };

  const selectedPersonaTip = personaTips[persona]?.[lang] || personaTips.general[lang] || personaTips.general.en;

  return {
    level,
    badge,
    badgeColor,
    headline,
    body,
    hydration,
    safeHours,
    riskLevel,
    heatIndex,
    asphaltTemp,
    persona,
    personaTip: selectedPersonaTip,
    hourlyForecast: generateHourlyForecast(temp, lang),
    source: 'CPCB/IMD Validated Clinical Rules Engine v2.4',
  };
}

// Call Gemini API if GEMINI_API_KEY is configured
async function callGeminiAdvisor({ temp, city, humidity, aqi, persona, lang }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `You are the BioCanopy Urban Climate & Health Advisory AI for Indian cities.
City: ${city}
Current Ambient Temperature: ${temp}°C
Relative Humidity: ${humidity || 45}%
Air Quality Index: ${aqi || 140}
Target Demographic: ${persona || 'general'}
Language: ${lang === 'hi' ? 'Hindi' : lang === 'mr' ? 'Marathi' : 'English'}

Provide an authoritative, medical and climate-grounded heat resilience advisory in pure JSON format:
{
  "level": "Short title classification (e.g. Extreme Heatwave Response, Midday Thermal Alert)",
  "badge": "Short badge tag (e.g. Red Alert, High Advisory)",
  "badgeColor": "Tailwind color classes like 'bg-red-500/20 text-red-300 border-red-500/40'",
  "headline": "Actionable headline (1 sentence)",
  "body": "Detailed actionable health guidance regarding physiological heat stress, concrete radiant heat, and shade-seeking directives (2-3 sentences)",
  "hydration": "Precise hydration recommendation (e.g. 500ml ORS every 30 mins)",
  "safeHours": "Safe transit hours window (e.g. Before 10:30 AM or after 6:00 PM)",
  "personaTip": "1-2 sentences of specific advice for ${persona}",
  "riskLevel": "low|moderate|high|severe|extreme"
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}`);
      return null;
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    const parsed = JSON.parse(candidateText);
    parsed.source = 'Google Gemini 1.5 Flash (Live AI Engine)';
    parsed.asphaltTemp = Number((temp + 7.5 + (temp > 38 ? 2.5 : 0)).toFixed(0));
    parsed.heatIndex = calculateHeatIndex(temp, humidity || 45);
    parsed.hourlyForecast = generateHourlyForecast(temp, lang);
    parsed.persona = persona;
    return parsed;
  } catch (err) {
    console.warn('Gemini API call failed, falling back to Rules Engine:', err.message);
    return null;
  }
}

// -------------------------------------------------------------
// POST /api/advisor/generate - Generate heat & health advisory
// -------------------------------------------------------------
router.post('/generate', async (req, res) => {
  try {
    const {
      city = 'Delhi',
      temperature = 39,
      humidity = 45,
      aqi = 140,
      persona = 'general',
      language = 'en',
    } = req.body;

    const tempNum = Number(temperature);

    // Try Gemini API first if configured
    let result = await callGeminiAdvisor({
      temp: tempNum,
      city,
      humidity: Number(humidity),
      aqi: Number(aqi),
      persona,
      lang: language,
    });

    // Fallback to validated rules engine
    if (!result) {
      result = evaluateClinicalRules({
        temp: tempNum,
        city,
        humidity: Number(humidity),
        aqi: Number(aqi),
        persona,
        lang: language,
      });
    }

    // Log consultation to SQLite
    try {
      const stmt = db.prepare(`
        INSERT INTO advisor_consultations (city, user_query, temperature, humidity, aqi, demographic, advisory_level, response_text)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        city,
        `Simulation at ${tempNum}°C (${persona})`,
        tempNum,
        Number(humidity),
        Number(aqi),
        persona,
        result.level,
        result.headline
      );
    } catch (e) {
      console.error('Error logging advisor consultation:', e.message);
    }

    res.json(result);
  } catch (err) {
    console.error('Advisor error:', err);
    res.status(500).json({ message: 'Internal error generating climate advisory.' });
  }
});

// -------------------------------------------------------------
// POST /api/advisor/chat - Interactive AI Climate Consultation
// -------------------------------------------------------------
router.post('/chat', async (req, res) => {
  try {
    const {
      message,
      city = 'Delhi',
      temperature = 39,
      humidity = 45,
      aqi = 140,
      persona = 'general',
      language = 'en',
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Query message is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let answerText = null;
    let source = 'CPCB / BioCanopy Clinical Expert System';

    // 1. Try Gemini if configured
    if (apiKey) {
      try {
        const prompt = `You are BioCanopy's expert AI Climate & Heat-Health Advisor for Indian urban centers.
Current Environmental Status in ${city}:
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- AQI: ${aqi}
- User Demographic: ${persona}
- User Language: ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'}

User question: "${message}"

Answer concisely (under 120 words), direct, and medically grounded. Offer practical cooling, hydration, shade, and route recommendations suited to Indian street conditions.`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3 },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (geminiText) {
            answerText = geminiText.trim();
            source = 'Google Gemini 1.5 Flash';
          }
        }
      } catch (err) {
        console.warn('Gemini chat failed, using fallback:', err.message);
      }
    }

    // 2. Intelligent clinical fallback responder if Gemini is not active
    if (!answerText) {
      const q = message.toLowerCase();
      const isHindi = language === 'hi';
      const isMarathi = language === 'mr';

      if (q.includes('jog') || q.includes('run') || q.includes('exercise') || q.includes('gym') || q.includes('व्यायाम') || q.includes('दौड़')) {
        if (isHindi) {
          answerText = `वर्तमान तापमान ${temperature}°C पर दोपहर या शाम को दौड़ना हानिकारक हो सकता है। दौड़ या भारी व्यायाम केवल प्रातः ६:०० से ७:३० के बीच ही करें। व्यायाम से पहले और बाद में इलेक्ट्रोलाइट्स युक्त जलपान अवश्य करें।`;
        } else if (isMarathi) {
          answerText = `सध्याचे तापमान ${temperature}°C असल्याने दुपारच्या वेळी धावणे किंवा व्यायाम करणे टाळावे. सकाळी ६:०० ते ७:३० च्या दरम्यानच व्यायाम करावा आणि भरपूर पाणी प्यावे.`;
        } else {
          answerText = `At ${temperature}°C, outdoor running during daylight hours triggers severe cardiovascular and thermoregulatory strain. Schedule workouts strictly before 7:00 AM or after 7:30 PM. Drink 500ml water with electrolytes 30 mins before exercising.`;
        }
      } else if (q.includes('water') || q.includes('hydrat') || q.includes('drink') || q.includes('पानी') || q.includes('जल')) {
        if (isHindi) {
          answerText = `${temperature}°C तापमान पर शरीर से पसीने के रूप में तेजी से लवण निकलते हैं। केवल सादा पानी ही नहीं, बल्कि ओआरएस, नारियल पानी या छाछ लें। प्रति घंटे कम से कम ३५०-५०० मिली जलपान आवश्यक है।`;
        } else if (isMarathi) {
          answerText = `${temperature}°C तापमानात फक्त पाणी पुरेसे नाही; ओआरएस, लिंबू सरबत किंवा ताक प्या. प्रति तास किमान ३५० ते ५०० मिली द्रवपदार्थ घेणे आवश्यक आहे.`;
        } else {
          answerText = `At ${temperature}°C, dehydration and electrolyte depletion occur rapidly. Drink 400-500ml of fluids every 45 minutes. Complement plain water with coconut water, lemonade, or ORS to replenish lost sodium and potassium.`;
        }
      } else if (q.includes('asthma') || q.includes('breathing') || q.includes('smoke') || q.includes('aqi') || q.includes('सांस') || q.includes('दमा')) {
        if (isHindi) {
          answerText = `शहर का एक्यूआई ${aqi} है और तापमान ${temperature}°C है। गर्म व प्रदूषित हवा श्वसन नली में सूजन पैदा कर सकती है। बाहर निकलते समय N95 मास्क लगाएं और अपना इन्हेलर हमेशा साथ रखें।`;
        } else if (isMarathi) {
          answerText = `हवेची गुणवत्ता (AQI ${aqi}) आणि उष्णतेमुळे दम्याचा त्रास वाढू शकतो. बाहेर पडताना N95 मास्क वापरा आणि आवश्यक औषधे नेहमी जवळ ठेवा.`;
        } else {
          answerText = `With AQI at ${aqi} combined with ${temperature}°C ambient heat, fine particulate matter (PM2.5) penetrates deeply into bronchial airways. Keep an emergency inhaler on hand, wear an N95 mask in construction or traffic zones, and avoid exposed highways.`;
        }
      } else if (q.includes('worker') || q.includes('delivery') || q.includes('outside') || q.includes('धूप') || q.includes('काम')) {
        if (isHindi) {
          answerText = `बाहरी श्रमिकों और डिलीवरी राइडर्स को हर ४५ मिनट में कम से कम १०-१५ मिनट का छायादार विश्राम लेना चाहिए। सिर और गर्दन पर गीला सूती कपड़ा रखें तथा सीधी धूप से बचें।`;
        } else if (isMarathi) {
          answerText = `उन्हात काम करणाऱ्यांनी दर ४५ मिनिटांनी १०-१५ मिनिटे सावलीत विश्रांती घ्यावी. डोक्यावर आणि मानेवर ओला सुती रुमाल ठेवावा.`;
        } else {
          answerText = `For outdoor workers and couriers, implement mandatory 15-minute shaded rest intervals every 45 minutes. Wear a damp cotton scarf around the neck, seek shaded canopy rest hubs, and never wait at unshaded asphalt traffic intersections.`;
        }
      } else {
        if (isHindi) {
          answerText = `${city} में वर्तमान तापमान ${temperature}°C और एक्यूआई ${aqi} है। हमारा सुझाव है कि बायोकेनोपी कूल-रूट मैप पर दिखाए गए छायादार रास्तों का ही उपयोग करें और दोपहर १२ से ४ के मध्य धूप से बचें।`;
        } else if (isMarathi) {
          answerText = `${city} मध्ये तापमान ${temperature}°C आहे. दुपारच्या उन्हात सावलीच्या मार्गांचा वापर करा आणि वेळोवेळी पाणी प्या.`;
        } else {
          answerText = `Based on ${city}'s current temperature of ${temperature}°C and AQI ${aqi}, we advise taking shaded pedestrian corridors (available in our Cool-Route Map) and limiting direct sun exposure between 12:00 PM and 4:00 PM. Stay hydrated with electrolytes.`;
        }
      }
    }

    // Save to consultation log
    try {
      const stmt = db.prepare(`
        INSERT INTO advisor_consultations (city, user_query, temperature, humidity, aqi, demographic, advisory_level, response_text)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(city, message, Number(temperature), Number(humidity), Number(aqi), persona, 'Chat Consultation', answerText);
    } catch (e) {
      console.error('Error logging consultation:', e.message);
    }

    res.json({
      answer: answerText,
      source,
      city,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ message: 'Failed to process AI chat consultation.' });
  }
});

// -------------------------------------------------------------
// GET /api/advisor/presets - Preset environmental conditions
// -------------------------------------------------------------
router.get('/presets', (req, res) => {
  res.json([
    {
      id: 'heatwave',
      temp: 41,
      humidity: 32,
      aqi: 195,
      label: 'Peak Heatwave Spike',
      description: 'Severe 41°C midsummer solar load with high radiant asphalt heat',
    },
    {
      id: 'smog',
      temp: 34,
      humidity: 58,
      aqi: 260,
      label: 'Trapped Smog & Dust',
      description: 'Warm 34°C morning with PM2.5 particulate inversion and high haze',
    },
    {
      id: 'monsoon_heat',
      temp: 36,
      humidity: 78,
      aqi: 95,
      label: 'Monsoon Humid Heat',
      description: 'High 78% relative humidity creating extreme wet-bulb heat index of 46°C',
    },
    {
      id: 'sunset_cooling',
      temp: 29,
      humidity: 45,
      aqi: 110,
      label: 'Sunset Relief Window',
      description: 'Comfortable 29°C dusk conditions ideal for pedestrian recreation',
    },
  ]);
});

export default router;
