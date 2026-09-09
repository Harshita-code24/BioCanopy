import type {
  AuthorityZone,
  CityMetric,
  Hotspot,
  Language,
  Report,
  RouteOverlay,
} from '../types';

export const cityMetrics: CityMetric[] = [
  {
    city: 'Delhi',
    state: 'Delhi NCR',
    aqi: 184,
    temperature: 39.5,
    feelsLike: 43.2,
    humidity: 38,
    treeCover: 18,
    targetCanopy: 33,
    heatRisk: 'High',
    cpcbStation: 'CPCB Station #04 — Mandir Marg (Live)',
    imdStation: 'IMD Station #281 — Safdarjung Met Center',
    satelliteSurfaceTemp: 44.2,
    lastUpdated: '2 mins ago',
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    aqi: 112,
    temperature: 34.0,
    feelsLike: 41.5,
    humidity: 78,
    treeCover: 24,
    targetCanopy: 35,
    heatRisk: 'Moderate',
    cpcbStation: 'CPCB Station #12 — BKC Complex (Live)',
    imdStation: 'IMD Station #118 — Santacruz Coastal Observatory',
    satelliteSurfaceTemp: 39.8,
    lastUpdated: '4 mins ago',
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    aqi: 68,
    temperature: 28.5,
    feelsLike: 30.1,
    humidity: 56,
    treeCover: 32,
    targetCanopy: 40,
    heatRisk: 'Low',
    cpcbStation: 'CPCB Station #09 — City Railway Terminal',
    imdStation: 'IMD Station #402 — HAL Met Center',
    satelliteSurfaceTemp: 32.4,
    lastUpdated: '1 min ago',
  },
  {
    city: 'Ahmedabad',
    state: 'Gujarat',
    aqi: 168,
    temperature: 41.2,
    feelsLike: 44.8,
    humidity: 32,
    treeCover: 14,
    targetCanopy: 30,
    heatRisk: 'High',
    cpcbStation: 'CPCB Station #06 — Maninagar Industrial Belt',
    imdStation: 'IMD Station #314 — Sardar Patel Observatory',
    satelliteSurfaceTemp: 46.1,
    lastUpdated: '3 mins ago',
  },
];

export const cityCoordinates: Record<string, [number, number]> = {
  Delhi: [28.6139, 77.209],
  Mumbai: [19.0178, 72.8478],
  Bengaluru: [12.9716, 77.5946],
  Ahmedabad: [23.0225, 72.5714],
};

// Route data for Delhi: Connaught Place -> Lodhi Garden
export const delhiRoutes: RouteOverlay[] = [
  {
    id: 'cool',
    name: 'Recommended Cool Path',
    travelTime: '14 min',
    badge: '14 min · 82% shaded',
    shadePercentage: 82,
    heatExposure: 'Low',
    isRecommended: true,
    color: '#22D3EE', // Vibrant Light Turquoise Blue
    weight: 8,
    heatReduction: 34,
    canopyBoost: 42,
    turnInstructions: [
      'Start at CP Radial 3 — Walk through Central Park neem canopy (180m)',
      'Turn onto Janpath avenue shaded tree promenade (450m · 92% shade)',
      'Cross via Rajpath shaded green verge (200m)',
      'Continue through Lodhi Estate tree archway to Lodhi Garden Gate 2 (400m)',
    ],
    coordinates: [
      [28.6315, 77.2167],
      [28.6258, 77.2185],
      [28.6189, 77.2182],
      [28.6082, 77.2168],
      [28.6015, 77.2189],
      [28.5933, 77.2197],
    ],
  },
  {
    id: 'fastest',
    name: 'Alternate Fastest Path',
    travelTime: '12 min',
    badge: '12 min · high heat exposure',
    shadePercentage: 24,
    heatExposure: 'High',
    isRecommended: false,
    color: '#B91C1C', // High-visibility Dark Red
    weight: 6,
    heatReduction: 0,
    canopyBoost: 6,
    turnInstructions: [
      'Exit CP directly via unshaded Outer Circle concrete flyover (350m)',
      'Follow Barakhamba asphalt corridor under direct midday sun (700m)',
      'Cross bare traffic intersection at Tolstoy Marg (250m)',
      'Direct asphalt approach to gate (200m · high radiant surface heat)',
    ],
    coordinates: [
      [28.6315, 77.2167],
      [28.6241, 77.2275],
      [28.6148, 77.2312],
      [28.6045, 77.2268],
      [28.5933, 77.2197],
    ],
  },
];

// Route data for Mumbai: Dadar Station -> Shivaji Park / Hindu Colony
export const mumbaiRoutes: RouteOverlay[] = [
  {
    id: 'cool',
    name: 'Recommended Cool Path',
    travelTime: '14 min',
    badge: '14 min · 82% shaded',
    shadePercentage: 82,
    heatExposure: 'Low',
    isRecommended: true,
    color: '#22D3EE',
    weight: 8,
    heatReduction: 31,
    canopyBoost: 45,
    turnInstructions: [
      'Exit Dadar Station via Shaded East Canopy walkway (120m)',
      'Walk along leafy Hindu Colony 1st Lane tree canopy (400m · 88% shade)',
      'Cross shaded circle at 5 Gardens rain tree stretch (350m)',
      'Enter Shivaji Park perimeter shaded path (250m)',
    ],
    coordinates: [
      [19.0182, 72.8432],
      [19.0205, 72.8455],
      [19.0238, 72.8482],
      [19.0265, 72.8441],
      [19.0278, 72.8398],
    ],
  },
  {
    id: 'fastest',
    name: 'Alternate Fastest Path',
    travelTime: '12 min',
    badge: '12 min · high heat exposure',
    shadePercentage: 19,
    heatExposure: 'High',
    isRecommended: false,
    color: '#B91C1C',
    weight: 6,
    heatReduction: 0,
    canopyBoost: 4,
    turnInstructions: [
      'Take unshaded Tilak Bridge concrete overpass directly (450m)',
      'Walk along unshaded asphalt bus terminal concourse (500m)',
      'Arrive via exposed street edge (150m)',
    ],
    coordinates: [
      [19.0182, 72.8432],
      [19.0212, 72.8415],
      [19.0245, 72.8402],
      [19.0278, 72.8398],
    ],
  },
];

export const cityRoutes: Record<string, RouteOverlay[]> = {
  Delhi: delhiRoutes,
  Mumbai: mumbaiRoutes,
  Bengaluru: [
    {
      id: 'cool',
      name: 'Recommended Cool Path',
      travelTime: '14 min',
      badge: '14 min · 82% shaded',
      shadePercentage: 82,
      heatExposure: 'Low',
      isRecommended: true,
      color: '#22D3EE',
      weight: 8,
      heatReduction: 36,
      canopyBoost: 48,
      turnInstructions: [
        'Exit Cubbon Park shaded bamboo trail (300m)',
        'Walk through Vidhana Soudha tree-lined promenade (400m)',
        'Continue along shaded canopy boulevard to destination (300m)',
      ],
      coordinates: [
        [12.9763, 77.5929],
        [12.9745, 77.5955],
        [12.9716, 77.5946],
        [12.9685, 77.5972],
      ],
    },
    {
      id: 'fastest',
      name: 'Alternate Fastest Path',
      travelTime: '12 min',
      badge: '12 min · high heat exposure',
      shadePercentage: 22,
      heatExposure: 'High',
      isRecommended: false,
      color: '#B91C1C',
      weight: 6,
      heatReduction: 0,
      canopyBoost: 5,
      turnInstructions: [
        'Direct asphalt transit along Kasturba Road traffic artery (650m)',
        'Concrete pavement exposed to peak solar radiation (350m)',
      ],
      coordinates: [
        [12.9763, 77.5929],
        [12.9732, 77.5991],
        [12.9685, 77.5972],
      ],
    },
  ],
  Ahmedabad: [
    {
      id: 'cool',
      name: 'Recommended Cool Path',
      travelTime: '14 min',
      badge: '14 min · 82% shaded',
      shadePercentage: 82,
      heatExposure: 'Low',
      isRecommended: true,
      color: '#22D3EE',
      weight: 8,
      heatReduction: 38,
      canopyBoost: 44,
      turnInstructions: [
        'Sabarmati Riverfront lower shaded tier walkway (400m)',
        'Pass under canopy pergola gardens (350m)',
        'Ascend shaded ramp to destination (250m)',
      ],
      coordinates: [
        [23.0321, 72.5785],
        [23.0295, 72.5762],
        [23.0252, 72.5741],
        [23.0225, 72.5714],
      ],
    },
    {
      id: 'fastest',
      name: 'Alternate Fastest Path',
      travelTime: '12 min',
      badge: '12 min · high heat exposure',
      shadePercentage: 18,
      heatExposure: 'High',
      isRecommended: false,
      color: '#B91C1C',
      weight: 6,
      heatReduction: 0,
      canopyBoost: 3,
      turnInstructions: [
        'Ashram Road unshaded multi-lane asphalt highway (800m)',
        'Hot concrete crossing with no midday shade cover (200m)',
      ],
      coordinates: [
        [23.0321, 72.5785],
        [23.0284, 72.5732],
        [23.0225, 72.5714],
      ],
    },
  ],
};

// Heat Points for Leaflet Heat / Circles
export const thermalPockets: [number, number, number][] = [
  // Delhi
  [28.6288, 77.2423, 0.94], // ITO Flyover
  [28.632, 77.2195, 0.85], // CP Outer Circle
  [28.644, 77.25, 0.88], // Laxmi Nagar junction
  // Mumbai
  [19.0195, 72.8428, 0.89], // Dadar TT
  [19.065, 72.868, 0.92], // BKC Concourse
  [19.072, 72.885, 0.82], // Kurla Junction
  // Bengaluru
  [12.9175, 77.6234, 0.87], // Silk Board
  [12.977, 77.572, 0.79], // Majestic
  // Ahmedabad
  [23.032, 72.569, 0.95], // Ashram Rd
  [23.048, 72.531, 0.91], // SG Highway
];

export const initialCitizenReports: Report[] = [
  {
    id: 'rep-01',
    city: 'Delhi',
    locationName: 'ITO Metro Gate 4 Pedestrian Crossing',
    coordinates: [28.6292, 77.2415],
    category: 'Unshaded Hotspot',
    description:
      'Metal railing surface measured 52°C at 2:30 PM. No overhead tree shade across 180m pedestrian waiting corridor.',
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    status: 'Pending Review',
    submittedAt: '12 mins ago',
    source: 'Citizen Mobile',
    upvotes: 42,
  },
  {
    id: 'rep-02',
    city: 'Delhi',
    locationName: 'Barakhamba Road Construction Flank',
    coordinates: [28.6272, 77.2285],
    category: 'Construction Dust',
    description:
      'Uncovered dry cement and gravel stockpiles releasing heavy PM10 dust clouds into pedestrian footpath.',
    photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    status: 'Reviewed',
    submittedAt: '45 mins ago',
    source: 'Verified Geotag',
    upvotes: 28,
  },
  {
    id: 'rep-03',
    city: 'Mumbai',
    locationName: 'Dadar TT Circle Bus Concourse',
    coordinates: [19.0198, 72.8435],
    category: 'Unshaded Hotspot',
    description:
      'Commuters waiting up to 25 mins under direct solar radiation. Zero tree canopy cover on eastern boarding island.',
    photoUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80',
    status: 'Pending Review',
    submittedAt: '28 mins ago',
    source: 'Citizen Mobile',
    upvotes: 35,
  },
  {
    id: 'rep-04',
    city: 'Mumbai',
    locationName: 'Kurla West Railway Track Verge',
    coordinates: [19.068, 72.879],
    category: 'Illegal Burning',
    description:
      'Open burning of commercial plastic waste and dry debris causing thick black smoke across adjacent residential lane.',
    photoUrl: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&auto=format&fit=crop&q=80',
    status: 'Task Dispatched',
    submittedAt: '1 hour ago',
    source: 'Field Observer',
    upvotes: 61,
  },
  {
    id: 'rep-05',
    city: 'Ahmedabad',
    locationName: 'Ashram Road Vadaj Junction Stretch',
    coordinates: [23.0335, 72.5712],
    category: 'Unshaded Hotspot',
    description:
      'Reflective asphalt and low-albedo concrete creating severe micro-heat island. Ground temp exceeds 48°C.',
    photoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80',
    status: 'Pending Review',
    submittedAt: '15 mins ago',
    source: 'Citizen Mobile',
    upvotes: 19,
  },
  {
    id: 'rep-06',
    city: 'Bengaluru',
    locationName: 'Silk Board Junction Flyover Footpath',
    coordinates: [12.9182, 77.6241],
    category: 'Construction Dust',
    description:
      'Metro expansion works generating continuous fugitive dust. Air is gritty, visibility reduced at eye level.',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?w=600&auto=format&fit=crop&q=80',
    status: 'Task Dispatched',
    submittedAt: '2 hours ago',
    source: 'Citizen Mobile',
    upvotes: 49,
  },
];

export const initialAuthorityZones: AuthorityZone[] = [
  {
    id: 'zone-01',
    zoneName: 'ITO Flyover & Transit Corridor',
    city: 'Delhi',
    complaintCount: 28,
    canopyDeficit: -26,
    currentCanopy: 14,
    surfaceTemp: 43.8,
    priorityRank: 1,
    status: 'Needs Dispatch',
    targetSaplings: 380,
    lastReported: '12 mins ago',
  },
  {
    id: 'zone-02',
    zoneName: 'Dadar TT & Tilak Bridge Concourse',
    city: 'Mumbai',
    complaintCount: 24,
    canopyDeficit: -22,
    currentCanopy: 16,
    surfaceTemp: 40.5,
    priorityRank: 2,
    status: 'Needs Dispatch',
    targetSaplings: 290,
    lastReported: '28 mins ago',
  },
  {
    id: 'zone-03',
    zoneName: 'Ashram Road Commercial Spine',
    city: 'Ahmedabad',
    complaintCount: 21,
    canopyDeficit: -25,
    currentCanopy: 11,
    surfaceTemp: 45.2,
    priorityRank: 3,
    status: 'Needs Dispatch',
    targetSaplings: 340,
    lastReported: '15 mins ago',
  },
  {
    id: 'zone-04',
    zoneName: 'Silk Board Transit Corridor',
    city: 'Bengaluru',
    complaintCount: 16,
    canopyDeficit: -18,
    currentCanopy: 22,
    surfaceTemp: 34.8,
    priorityRank: 4,
    status: 'Task Dispatched',
    targetSaplings: 210,
    dispatchId: 'ORD-BLR-2026-089',
    lastReported: '2 hours ago',
  },
  {
    id: 'zone-05',
    zoneName: 'Laxmi Nagar Vikas Marg Artery',
    city: 'Delhi',
    complaintCount: 15,
    canopyDeficit: -20,
    currentCanopy: 15,
    surfaceTemp: 42.1,
    priorityRank: 5,
    status: 'Planting In Progress',
    targetSaplings: 260,
    dispatchId: 'ORD-DEL-2026-114',
    lastReported: '3 hours ago',
  },
];

export const translations: Record<Language, Record<string, string>> = {
  en: {
    brandSubtitle: 'Urban Air Quality & Extreme Heat Platform',
    navMap: 'Cool-Route Map',
    navDashboard: 'Open Data Dashboard',
    navAuthority: 'Authority Command Center',
    reportHazard: 'Report Hazard',
    aiAlertTitle: 'AI Real-Time Safety Advisor',
    verifiedBadge: 'Verified via CPCB + IMD + Satellite',
    refreshedJustNow: 'Refreshed 2 mins ago',
    heatIndexLabel: 'Local Heat Index',
    aqiLabel: 'Air Quality Index (AQI)',
    canopyLabel: 'Urban Canopy Density',
    heatRiskLabel: 'Pedestrian Heat Risk',
    recommendedRoute: 'Recommended Cool Path',
    fastestRoute: 'Alternate Fastest Path',
    startShadedRoute: 'Start Shaded Route',
    shadedBadge: '82% shaded',
    heatExposureBadge: 'high heat exposure',
    dispatchTask: 'Dispatch Tree-Planting Task',
    taskDispatched: 'Planting Task Dispatched',
    complaintsQueue: 'Citizen Hazard Priority Queue',
    rankingCriteria: 'Ranked by Citizen Complaint Density × Canopy Deficit',
    provenanceCpcb: 'Source: Central Pollution Control Board (CPCB) Ground Monitor',
    provenanceImd: 'Source: India Meteorological Department (IMD) Station',
    provenanceSatellite: 'Source: Landsat / Sentinel-2 Thermal Infrared Imagery',
    submitToMap: 'Submit to Public Map',
    dropGpsPin: 'Select GPS Pin on Map',
    categoryLabel: 'Hazard Category',
    photoUpload: 'Upload Photo Proof (Optional)',
    descriptionLabel: 'Description & Notes',
    close: 'Close',
    sdg13Title: 'SDG 13: Climate Action (Target 13.1 & 13.2)',
    sdg11Title: 'SDG 11: Sustainable Cities & Communities',
    sdg3Title: 'SDG 3: Good Health & Well-being',
  },
  hi: {
    brandSubtitle: 'शहरी वायु गुणवत्ता और अत्यधिक गर्मी समाधान',
    navMap: 'शीतल मार्ग नक्शा',
    navDashboard: 'ओपन डेटा डैशबोर्ड',
    navAuthority: 'प्राधिकरण कमांड सेंटर',
    reportHazard: 'खतरे की सूचना दें',
    aiAlertTitle: 'एआई रीयल-टाइम सुरक्षा सलाहकार',
    verifiedBadge: 'CPCB + IMD + सैटेलाइट द्वारा सत्यापित',
    refreshedJustNow: '२ मिनट पहले अपडेट किया गया',
    heatIndexLabel: 'स्थानीय हीट इंडेक्स',
    aqiLabel: 'वायु गुणवत्ता सूचकांक (AQI)',
    canopyLabel: 'शहरी वृक्ष आवरण घनत्व',
    heatRiskLabel: 'पैदल यात्री ताप जोखिम',
    recommendedRoute: 'अनुशंसित शीतल मार्ग',
    fastestRoute: 'वैकल्पिक सबसे तेज़ मार्ग',
    startShadedRoute: 'छायादार मार्ग शुरू करें',
    shadedBadge: '८२% छायादार',
    heatExposureBadge: 'अत्यधिक गर्मी जोखिम',
    dispatchTask: 'वृक्षारोपण कार्य दल भेजें',
    taskDispatched: 'वृक्षारोपण कार्य स्वीकृत',
    complaintsQueue: 'नागरिक शिकायत प्राथमिकता सूची',
    rankingCriteria: 'नागरिक शिकायत संख्या एवं वृक्ष आवरण कमी के आधार पर क्रमबद्ध',
    provenanceCpcb: 'स्रोत: केंद्रीय प्रदूषण नियंत्रण बोर्ड (CPCB) ग्राउंड सेंसर',
    provenanceImd: 'स्रोत: भारत मौसम विज्ञान विभाग (IMD) स्टेशन',
    provenanceSatellite: 'स्रोत: लैंडसैट / सेंटिनल-२ थर्मल सैटेलाइट डेटा',
    submitToMap: 'सार्वजनिक मानचित्र पर दर्ज करें',
    dropGpsPin: 'मानचित्र पर जीपीएस पिन चुनें',
    categoryLabel: 'खतरे की श्रेणी',
    photoUpload: 'फोटो प्रमाण संलग्न करें',
    descriptionLabel: 'विवरण एवं टिप्पणी',
    close: 'बंद करें',
    sdg13Title: 'एसडीजी १३: जलवायु कार्यवाई (लक्ष्य १३.१ व १३.२)',
    sdg11Title: 'एसडीजी ११: टिकाऊ शहर और समुदाय',
    sdg3Title: 'एसडीजी ३: उत्तम स्वास्थ्य और खुशहाली',
  },
  mr: {
    brandSubtitle: 'शहरी हवेची गुणवत्ता आणि तीव्र उष्णता निवारण प्लॅटफॉर्म',
    navMap: 'शीतल मार्ग नकाशा',
    navDashboard: 'ओपन डेटा डॅशबोर्ड',
    navAuthority: 'प्राधिकरण कमांड सेंटर',
    reportHazard: 'धोक्याची नोंद करा',
    aiAlertTitle: 'एआय रिअल-टाइम सुरक्षा सल्लागार',
    verifiedBadge: 'CPCB + IMD + उपग्रह डेटाद्वारे पडताळणी',
    refreshedJustNow: '२ मिनिटांपूर्वी अद्ययावत',
    heatIndexLabel: 'स्थानिक उष्णता निर्देशांक',
    aqiLabel: 'हवा गुणवत्ता निर्देशांक (AQI)',
    canopyLabel: 'शहरी झाडांचे आच्छादन',
    heatRiskLabel: 'पादचारी उष्णता धोका',
    recommendedRoute: 'शिफारस केलेला सावलीचा मार्ग',
    fastestRoute: 'पर्यायी जलद मार्ग',
    startShadedRoute: 'सावलीचा प्रवास सुरू करा',
    shadedBadge: '८२% सावलीयुक्त',
    heatExposureBadge: 'जास्त उष्णतेचा संपर्क',
    dispatchTask: 'वृक्षारोपण मोहीम सुरू करा',
    taskDispatched: 'वृक्षारोपण आदेश जारी केला',
    complaintsQueue: 'नागरिक तक्रार प्राधान्य यादी',
    rankingCriteria: 'तक्रार संख्या आणि सावली तुटवड्यानुसार क्रमवारी',
    provenanceCpcb: 'स्रोत: केंद्रीय प्रदूषण नियंत्रण मंडळ (CPCB) सेन्सर्स',
    provenanceImd: 'स्रोत: भारतीय हवामान विभाग (IMD) केंद्र',
    provenanceSatellite: 'स्रोत: उपग्रह थर्मल डेटा',
    submitToMap: 'सार्वजनिक नकाशावर जोडा',
    dropGpsPin: 'नकाशावर जीपीएस पिन निवडा',
    categoryLabel: 'धोक्याचा प्रकार',
    photoUpload: 'फोटो अपलोड करा',
    descriptionLabel: 'तपशील व माहिती',
    close: 'बंद करा',
    sdg13Title: 'SDG १३: हवामान कृती (लक्ष्य १३.१ आणि १३.२)',
    sdg11Title: 'SDG ११: शाश्वत शहरे आणि समुदाय',
    sdg3Title: 'SDG ३: चांगले आरोग्य आणि निरोगी जीवन',
  },
};

export const aiAdvisorScenarios = {
  peak_heat: {
    id: 'peak_heat',
    label: 'Afternoon Heatwave (41°C)',
    headline: 'Stay indoors until 5 PM — Extreme surface heat detected',
    description:
      'Unshaded asphalt radiating 48°C+ in central commercial belts. If travel is essential, select the recommended Cool Path (+82% canopy shade) to avoid solar thermal exhaustion.',
    badge: 'High Heatwave Warning',
    badgeColor: 'bg-red-100 text-red-700 border-red-200',
    targetHours: '12:00 PM – 5:00 PM',
    hydrationGoal: 'Drink 500ml oral fluids every 45 mins',
  },
  smog_morning: {
    id: 'smog_morning',
    label: 'Morning Smog Peak (AQI 195)',
    headline: 'Wear N95 protection — Elevated particulate concentration along arterial transit',
    description:
      'Inversion trapping construction dust and diesel exhaust below 50m. Sensitive individuals should avoid outdoor cardio and choose shaded inner lanes with active leaf particulate filtration.',
    badge: 'Air Quality Advisory',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    targetHours: '7:00 AM – 10:30 AM',
    hydrationGoal: 'Rinse eyes & hydrate before transit',
  },
  evening_cooling: {
    id: 'evening_cooling',
    label: 'Sunset Transition (31°C)',
    headline: 'Thermal dissipation active — Shaded corridors safe for pedestrian transit',
    description:
      'Surface radiant temperature dropping steadily. Shaded urban greenways are recommended for cross-ventilation and cool microclimate comfort.',
    badge: 'Moderate Conditions',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    targetHours: '5:30 PM – 8:00 PM',
    hydrationGoal: 'Hydrate normally',
  },
};

// Legacy compatibility exports
export const heatPoints: [number, number, number][] = thermalPockets;

export const routeLocations = [
  { name: 'Connaught Place', value: 'connaught', coordinates: [28.6315, 77.2167] as [number, number] },
  { name: 'India Gate', value: 'indiagate', coordinates: [28.6129, 77.2295] as [number, number] },
  { name: 'Lodhi Garden', value: 'lodhi', coordinates: [28.5933, 77.2197] as [number, number] },
  { name: 'AIIMS Metro', value: 'aiims', coordinates: [28.5672, 77.21] as [number, number] },
];

export const routeOptions = delhiRoutes;

export const mapHotspots: Hotspot[] = [
  { id: 'h1', name: 'ITO Flyover Belt', city: 'Delhi', center: [28.6288, 77.2423], intensity: 92, type: 'Concrete Corridor' },
  { id: 'h2', name: 'Dadar TT Circle', city: 'Mumbai', center: [19.0195, 72.8428], intensity: 88, type: 'Exposed Transit' },
  { id: 'h3', name: 'Silk Board Junction', city: 'Bengaluru', center: [12.9175, 77.6234], intensity: 75, type: 'Asphalt Heat Island' },
  { id: 'h4', name: 'Ashram Road Spine', city: 'Ahmedabad', center: [23.032, 72.569], intensity: 94, type: 'Concrete Corridor' },
];

export const initialReports = initialCitizenReports;

export const weeklyReportVolume = [
  { label: 'Week 1', Delhi: 12, Mumbai: 8, Bengaluru: 5, Ahmedabad: 9 },
  { label: 'Week 2', Delhi: 18, Mumbai: 11, Bengaluru: 7, Ahmedabad: 12 },
  { label: 'Week 3', Delhi: 14, Mumbai: 13, Bengaluru: 8, Ahmedabad: 10 },
  { label: 'Week 4', Delhi: 28, Mumbai: 24, Bengaluru: 16, Ahmedabad: 21 },
];

export const featureCards = [
  {
    title: 'Thermal Cool-Route Map',
    description: 'Visualize urban heat pockets and safer shaded alternatives across the city.',
  },
  {
    title: 'Open Data Dashboard',
    description: 'Turn weather and AQI numbers into quick, color-led snapshots anyone can read.',
  },
  {
    title: 'Citizen Reporting',
    description: 'Submit heat trouble spots and see them appear instantly on the shared map.',
  },
  {
    title: 'AI Advisor',
    description: 'Get dynamic indoor and outdoor guidance as temperature conditions shift.',
  },
  {
    title: 'Authority Center',
    description: 'Help city teams prioritize tree planting and response with live filters.',
  },
];

export const advisorTips = [
  {
    maxTemp: 30,
    title: 'Comfort window',
    message: 'Outdoor temperature is manageable. Keep curtains open for daylight and use ceiling fans before AC.',
  },
  {
    maxTemp: 35,
    title: 'Warm afternoon protocol',
    message: 'Close windows from noon to 4 PM, hydrate early, and plan walking routes near tree-lined streets.',
  },
  {
    maxTemp: 40,
    title: 'Heat alert routine',
    message: 'Keep windows closed until 6 PM, reduce outdoor errands, and reopen for cross-ventilation after sunset.',
  },
  {
    maxTemp: 100,
    title: 'Extreme heat response',
    message: 'Avoid direct sun, postpone non-essential travel, and use shaded community spaces during peak hours.',
  },
];

