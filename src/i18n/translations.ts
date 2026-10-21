import type { HazardCategory, Language, ReportStatus } from '../types';

export interface TranslationDictionary {
  common: {
    appName: string;
    tagline: string;
    loading: string;
    citizen: string;
    admin: string;
    welcome: string;
    close: string;
    cancel: string;
    submit: string;
    upvote: string;
    mins: string;
    hours: string;
    goal: string;
    active: string;
    all: string;
    live: string;
    offline: string;
  };
  nav: {
    menu: string;
    rollUp: string;
    rollUpCanopy: string;
    canopyMenu: string;
    selectModule: string;
    reportHazard: string;
    logOut: string;
    overview: string;
    overviewBadge: string;
    coolRoute: string;
    coolRouteBadge: string;
    openData: string;
    openDataBadge: string;
    citizenReporting: string;
    citizenReportingBadge: string;
    aiAdvisor: string;
    aiAdvisorBadge: string;
    adminCommand: string;
    adminCommandBadge: string;
  };
  dashboard: {
    welcomeBannerTitle: string;
    welcomeBannerDesc: string;
    launchCoolRoute: string;
    liveSensorFeed: string;
    updatingSensors: string;
    surfaceTemp: string;
    airQualityIndex: string;
    urbanTreeCanopy: string;
    activeCitizenPins: string;
    targetGoal: string;
    inCity: string;
    highRisk: string;
    moderateRisk: string;
    lowRisk: string;
  };
  map: {
    title: string;
    subtitle: string;
    coolPath: string;
    fastestPath: string;
    thermalSatellite: string;
    hazardPins: string;
    startShadedRoute: string;
    stopNavigation: string;
    flagHeatSpot: string;
    turnNavigation: string;
    stepOf: string;
    arrivalIn: string;
    canopyShadeBadge: string;
    navigationLegend: string;
    legendCoolPath: string;
    legendFastestPath: string;
    legendHotspot: string;
    legendHazardPin: string;
    coolPathDetails: string;
    fastestPathDetails: string;
    heatReduction: string;
    extraCommute: string;
    worthTheComfort: string;
    highHeatExposure: string;
    shadedCover: string;
    continuousCanopy: string;
    highSolarStress: string;
    hotspotTitle: string;
    hotspotObserved: string;
    hotspotDesc: string;
  };
  openData: {
    title: string;
    subtitle: string;
    refreshedLive: string;
    heatIndex: string;
    aqi: string;
    canopyDensity: string;
    pedestrianHeatRisk: string;
    diurnalTitle: string;
    diurnalDesc: string;
    tempAxis: string;
    aqiAxis: string;
    heatRiskAxis: string;
    provenanceCpcb: string;
    provenanceImd: string;
    provenanceSatellite: string;
    sdg13Title: string;
    sdg13Desc: string;
    sdg11Title: string;
    sdg11Desc: string;
    sdg3Title: string;
    sdg3Desc: string;
    dangerous: string;
    severe: string;
    criticalShortfall: string;
    moderate: string;
    viewTempAqi: string;
    viewPm: string;
    viewThermalHumidity: string;
    exportCsv: string;
    exportJson: string;
    multiCityCompare: string;
    multiCityCompareDesc: string;
    refreshData: string;
    stationDetails: string;
    loadingTrends: string;
    interCityComparison: string;
    downloadSuccess: string;
  };
  reports: {
    title: string;
    activeReportsSubtitle: string;
    reportNewHazard: string;
    liveMapTitle: string;
    activePins: string;
    complaintsFeedTitle: string;
    filterAll: string;
    filterUnshaded: string;
    filterBurning: string;
    filterDust: string;
    filterNoTree: string;
    statusPending: string;
    statusReviewed: string;
    statusDispatched: string;
    upvotePrompt: string;
    noReportsFound: string;
  };
  reportModal: {
    modalTitle: string;
    modalSubtitle: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    step4Title: string;
    catUnshadedTitle: string;
    catUnshadedDesc: string;
    catBurningTitle: string;
    catBurningDesc: string;
    catDustTitle: string;
    catDustDesc: string;
    catNoTreeTitle: string;
    catNoTreeDesc: string;
    useCurrentGps: string;
    acquiringGps: string;
    locationPlaceholder: string;
    tapRepositionPin: string;
    photoClickOrDrag: string;
    photoAttached: string;
    photoMetadataNote: string;
    notesPlaceholder: string;
    cancelBtn: string;
    submitBtn: string;
  };
  advisor: {
    title: string;
    subtitle: string;
    liveEngine: string;
    simulateTemp: string;
    scenarioHeatwave: string;
    scenarioSmog: string;
    scenarioSunset: string;
    openCoolRouteCTA: string;
    hydrationPrompt: string;
    safeTransitHours: string;
    hourlyForecastTitle: string;
    extremeWarning: string;
    highAdvisory: string;
    moderateAdvisory: string;
    comfortableWindow: string;
    guidanceHeatwaveHeadline: string;
    guidanceHeatwaveBody: string;
    guidanceSmogHeadline: string;
    guidanceSmogBody: string;
    guidanceModerateHeadline: string;
    guidanceModerateBody: string;
    guidanceComfortHeadline: string;
    guidanceComfortBody: string;
  };
  admin: {
    title: string;
    subtitle: string;
    roleBadge: string;
    kpiTotalReports: string;
    kpiPendingTriage: string;
    kpiDispatched: string;
    kpiResolved: string;
    kpiCitizens: string;
    searchPlaceholder: string;
    filterCity: string;
    filterStatus: string;
    filterCategory: string;
    allCities: string;
    allStatuses: string;
    allCategories: string;
    btnReview: string;
    btnDispatch: string;
    btnResolve: string;
    btnDelete: string;
    statusUpdatedToast: string;
    reportDeletedToast: string;
    noReportsFound: string;
    tabReports: string;
    tabUsers: string;
    usersDirectoryTitle: string;
    usersDirectorySubtitle: string;
    userNameCol: string;
    userEmailCol: string;
    userCityCol: string;
    userRoleCol: string;
    userRegisteredCol: string;
    userActionsCol: string;
    noUsersFound: string;
    searchUsersPlaceholder: string;
    deleteUserConfirm: string;
    userDeletedToast: string;
  };
  auth: {
    title: string;
    subtitle: string;
    tabSignIn: string;
    tabCreateAccount: string;
    fullName: string;
    emailAddress: string;
    password: string;
    assignedCity: string;
    selectCityPlaceholder: string;
    btnSignIn: string;
    btnCreateAccount: string;
    demoCitizen: string;
    demoAdmin: string;
    signingIn: string;
    signInWithGoogle: string;
    orDivider: string;
    welcomeEmailSent: string;
    emailSentNotice: string;
    emailSubject: string;
    googleModalTitle: string;
    googleModalDesc: string;
    continueGoogleBtn: string;
  };
  profile: {
    title: string;
    subtitle: string;
    tabAccount: string;
    tabReports: string;
    tabRoutes: string;
    nameLabel: string;
    emailLabel: string;
    passwordLabel: string;
    showPassword: string;
    hidePassword: string;
    roleLabel: string;
    memberSince: string;
    noReportsTitle: string;
    noReportsDesc: string;
    reportedHazardsCount: string;
    noRoutesTitle: string;
    noRoutesDesc: string;
    visitedRoutesCount: string;
    shadedCoverage: string;
    heatAvoided: string;
    closeBtn: string;
    status: string;
    completed: string;
    mins: string;
    km: string;
    cityLabel: string;
    editBtn: string;
    saveBtn: string;
    cancelBtn: string;
    editPassword: string;
    editCity: string;
    passwordUpdated: string;
    cityUpdated: string;
    passwordMinLength: string;
    newPasswordPlaceholder: string;
    readOnlyBadge: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    common: {
      appName: 'BioCanopy',
      tagline: 'Urban Air Quality & Extreme Heat Resilience',
      loading: 'Loading...',
      citizen: 'Citizen',
      admin: 'Admin',
      welcome: 'Welcome',
      close: 'Close',
      cancel: 'Cancel',
      submit: 'Submit',
      upvote: 'Upvote',
      mins: 'mins',
      hours: 'hours',
      goal: 'goal',
      active: 'Active',
      all: 'All',
      live: 'Live',
      offline: 'Offline',
    },
    nav: {
      menu: 'Menu',
      rollUp: 'Roll Up',
      rollUpCanopy: 'Roll up canopy',
      canopyMenu: 'Canopy Menu',
      selectModule: 'Select a module to navigate',
      reportHazard: 'Report Hazard',
      logOut: 'Log Out',
      overview: 'Overview Dashboard',
      overviewBadge: 'Hub',
      coolRoute: 'Cool-Route Map',
      coolRouteBadge: 'Shaded 82%',
      openData: 'Open Data Dashboard',
      openDataBadge: '3-Band Scale',
      citizenReporting: 'Citizen Reporting',
      citizenReportingBadge: 'Crowdsourced',
      aiAdvisor: 'AI Safety Advisor',
      aiAdvisorBadge: 'Live Guidance',
      adminCommand: 'Authority Command',
      adminCommandBadge: 'Admin',
    },
    dashboard: {
      welcomeBannerTitle: 'Urban Air Quality & Extreme Heat Resilience',
      welcomeBannerDesc:
        'BioCanopy integrates five citizen-first modules to map shaded streets, simplify open telemetry, crowdsource local hazards, and guide city greening.',
      launchCoolRoute: 'Launch Cool-Route Map',
      liveSensorFeed: 'Live Satellite & Ground Feed',
      updatingSensors: 'Updating sensor telemetry...',
      surfaceTemp: 'Surface Temperature',
      airQualityIndex: 'Air Quality Index',
      urbanTreeCanopy: 'Urban Tree Canopy',
      activeCitizenPins: 'Active Citizen Pins',
      targetGoal: '/ 33% goal',
      inCity: 'in',
      highRisk: 'High Risk',
      moderateRisk: 'Moderate Risk',
      lowRisk: 'Low Risk',
    },
    map: {
      title: 'Cool-Route Navigation',
      subtitle: 'Recommended 82% shaded green corridor vs direct unshaded asphalt',
      coolPath: 'Cool Path',
      fastestPath: 'Fastest Path',
      thermalSatellite: 'Thermal Satellite',
      hazardPins: 'Hazard Pins',
      startShadedRoute: 'Start Shaded Route',
      stopNavigation: 'Stop Navigation',
      flagHeatSpot: 'Flag Heat Spot',
      turnNavigation: 'Turn by Turn Navigation',
      stepOf: 'Step',
      arrivalIn: 'Arrival in ~14 mins',
      canopyShadeBadge: '+82% Tree Canopy Shade',
      navigationLegend: 'Navigation Legend',
      legendCoolPath: 'Recommended Cool Path (Light Turquoise)',
      legendFastestPath: 'Fastest Path (Dark Red)',
      legendHotspot: 'Thermal Satellite Hotspot (42°C+)',
      legendHazardPin: 'Citizen Hazard Pin',
      coolPathDetails:
        'Dense neem & banyan tree arches lower radiant heat by -34% compared to bare road asphalt.',
      fastestPathDetails:
        'Direct arterial transit exposed to peak solar radiation with negligible tree canopy.',
      heatReduction: 'Heat Reduction',
      extraCommute: 'Extra Commute',
      worthTheComfort: 'Worth the comfort',
      highHeatExposure: 'High Heat Exposure',
      shadedCover: 'Shaded Cover',
      continuousCanopy: '✓ Continuous tree canopy protection',
      highSolarStress: '⚠ High solar radiant heat stress',
      hotspotTitle: 'Thermal Satellite Hotspot',
      hotspotObserved: 'Observed Surface Temp',
      hotspotDesc: 'Exposed concrete and high vehicle emissions creating microclimate heat island.',
    },
    openData: {
      title: 'Open Environmental Telemetry',
      subtitle: 'Live Ground Sensors & Satellite Feeds for Urban Microclimates',
      refreshedLive: 'Refreshed live from ground sensors',
      heatIndex: 'Local Heat Index',
      aqi: 'Air Quality Index (AQI)',
      canopyDensity: 'Tree Canopy Density',
      pedestrianHeatRisk: 'Pedestrian Heat Risk',
      diurnalTitle: '24-Hour Diurnal Climate Curve',
      diurnalDesc:
        'Correlation between ambient surface temperature, PM2.5/PM10 particulate concentration, and pedestrian thermal vulnerability.',
      tempAxis: 'Temperature (°C)',
      aqiAxis: 'AQI Level',
      heatRiskAxis: 'Heat Risk Score',
      provenanceCpcb: 'Source: Central Pollution Control Board (CPCB) continuous monitoring station',
      provenanceImd: 'Source: India Meteorological Department (IMD) AWS telemetry station',
      provenanceSatellite: 'Source: Sentinel-2 & Landsat thermal infrared surface radiance dataset',
      sdg13Title: 'SDG 13: Climate Action (Targets 13.1 & 13.2)',
      sdg13Desc:
        'Strengthening urban climate resilience through open data transparency and rapid heat response protocols.',
      sdg11Title: 'SDG 11: Sustainable Cities & Communities',
      sdg11Desc:
        'Expanding universal access to safe, inclusive, green public spaces and climate-resilient pedestrian paths.',
      sdg3Title: 'SDG 3: Good Health & Well-being',
      sdg3Desc:
        'Reducing heat stroke incidents, respiratory ailments from PM2.5, and urban cardiovascular stress.',
      dangerous: 'Dangerous',
      severe: 'Severe',
      criticalShortfall: 'Critical Shortfall',
      moderate: 'Moderate',
      viewTempAqi: 'Temperature & AQI',
      viewPm: 'Particulate Matter (PM2.5 & PM10)',
      viewThermalHumidity: 'Thermal & Humidity',
      exportCsv: 'Download CSV Dataset',
      exportJson: 'Raw JSON Feed',
      multiCityCompare: 'Inter-City Climate Comparison',
      multiCityCompareDesc:
        'Live environmental telemetry across all 4 monitored municipal hubs.',
      refreshData: 'Refresh Live Feed',
      stationDetails: 'Monitoring Station Provenance',
      loadingTrends: 'Loading live 24-hour meteorological trends...',
      interCityComparison: 'All Monitored Cities',
      downloadSuccess: 'Telemetry dataset CSV downloaded successfully!',
    },
    reports: {
      title: 'Hazard Reporting',
      activeReportsSubtitle: 'active crowdsourced community reports in',
      reportNewHazard: 'Report New Hazard',
      liveMapTitle: 'Live Geotagged Hazard Map',
      activePins: 'Active Pins',
      complaintsFeedTitle: 'Citizen Complaints Feed',
      filterAll: 'All',
      filterUnshaded: 'Unshaded Hotspot',
      filterBurning: 'Illegal Burning',
      filterDust: 'Construction Dust',
      filterNoTree: 'No Tree Cover',
      statusPending: 'Pending Verification',
      statusReviewed: 'Reviewed',
      statusDispatched: 'Task Dispatched',
      upvotePrompt: 'Upvote to boost priority',
      noReportsFound: 'No reports match your current filter.',
    },
    reportModal: {
      modalTitle: 'Report Environmental Hazard',
      modalSubtitle: 'Logged to the BioCanopy Public Map & Municipal Action Queue',
      step1Title: '1. Select Hazard Category',
      step2Title: '2. Location & GPS Pin Preview',
      step3Title: '3. Image Upload Dropzone (Photo Verification)',
      step4Title: '4. Additional Notes / Ground Observations',
      catUnshadedTitle: 'Unshaded Hotspot',
      catUnshadedDesc: 'Extreme pavement heat, unshaded waiting stops & bridges',
      catBurningTitle: 'Illegal Burning',
      catBurningDesc: 'Commercial waste, plastic or dry leaves burning nearby',
      catDustTitle: 'Construction Dust',
      catDustDesc: 'Fugitive PM10 dust plumes from building or road works',
      catNoTreeTitle: 'No Tree Cover',
      catNoTreeDesc: 'Barren sidewalk needing urgent municipal sapling planting',
      useCurrentGps: 'Use Current GPS Location',
      acquiringGps: 'Acquiring GPS...',
      locationPlaceholder: 'e.g. Near Station Exit / Bus Stop',
      tapRepositionPin: '📍 Tap map to reposition pin:',
      photoClickOrDrag: 'Click to upload photo or drag & drop proof',
      photoAttached: '✓ Attached:',
      photoMetadataNote: 'PNG, JPG or WEBP (Max 5MB) · Geotag metadata extracted automatically',
      notesPlaceholder:
        'Describe the severity: e.g. metal benches too hot to sit, visible black smoke, or zero shade trees for 300m...',
      cancelBtn: 'Cancel',
      submitBtn: 'Submit to Public Map',
    },
    advisor: {
      title: 'AI Heat & Health Safety Advisor',
      subtitle: 'Dynamic plain-language advisory derived from ground telemetry and microclimate AI',
      liveEngine: 'Live Engine',
      simulateTemp: 'Simulate Ambient Temperature',
      scenarioHeatwave: 'Afternoon Heatwave (41°C)',
      scenarioSmog: 'Morning Smog Peak (AQI 195)',
      scenarioSunset: 'Sunset Transition (31°C)',
      openCoolRouteCTA: 'Open Cool Route for this Condition',
      hydrationPrompt: 'Hydration Target',
      safeTransitHours: 'Recommended Window',
      hourlyForecastTitle: '24-Hour Hourly Safety Schedule',
      extremeWarning: 'CRITICAL WARNING',
      highAdvisory: 'HIGH ADVISORY',
      moderateAdvisory: 'MODERATE',
      comfortableWindow: 'SAFE',
      guidanceHeatwaveHeadline: 'Stay indoors until 5:30 PM — Extreme asphalt radiation detected',
      guidanceHeatwaveBody:
        'Unshaded concrete surface temperatures exceed 50°C. Postpone non-essential travel. If transit is unavoidable, utilize the 82% shaded green cool path.',
      guidanceSmogHeadline: 'Limit unshaded transit — Peak solar radiant heat active',
      guidanceSmogBody:
        'Keep windows and blinds closed between 12 PM and 4 PM to prevent indoor heat trapping. Walk strictly under shaded neem & banyan tree arches.',
      guidanceModerateHeadline: 'Manageable conditions with hydration and shaded corridors',
      guidanceModerateBody:
        'Ambient conditions are warm but within pedestrian safety thresholds. Utilize shaded tree corridors to enjoy 3-4°C microclimate relief.',
      guidanceComfortHeadline: 'Optimal outdoor conditions — Safe for transit & recreation',
      guidanceComfortBody:
        'Temperatures are within comfortable levels. Open windows for cross-ventilation and take advantage of outdoor green parks.',
    },
    admin: {
      title: 'Municipal Authority Command Center',
      subtitle: 'Review citizen hazard flags, prioritize field teams, and dispatch tree plantation crews',
      roleBadge: 'City Admin',
      kpiTotalReports: 'Total Reports',
      kpiPendingTriage: 'Pending Triage',
      kpiDispatched: 'Dispatched Tasks',
      kpiResolved: 'Resolved',
      kpiCitizens: 'Registered Citizens',
      searchPlaceholder: 'Search reports by location, citizen, or keywords...',
      filterCity: 'City',
      filterStatus: 'Status',
      filterCategory: 'Category',
      allCities: 'All Cities',
      allStatuses: 'All Statuses',
      allCategories: 'All Categories',
      btnReview: 'Review',
      btnDispatch: 'Dispatch Tree Crew',
      btnResolve: 'Resolve',
      btnDelete: 'Delete',
      statusUpdatedToast: 'Report status updated successfully',
      reportDeletedToast: 'Report removed from queue',
      noReportsFound: 'No citizen reports match current filter criteria.',
      tabReports: 'Hazard Reports',
      tabUsers: 'Registered Citizens',
      usersDirectoryTitle: 'Registered Citizens & Users',
      usersDirectorySubtitle: 'Directory of all verified community residents, city hubs, and authority accounts',
      userNameCol: 'Citizen / Name',
      userEmailCol: 'Email Address',
      userCityCol: 'City Hub',
      userRoleCol: 'Role',
      userRegisteredCol: 'Registered At',
      userActionsCol: 'Actions',
      noUsersFound: 'No registered users match your search criteria.',
      searchUsersPlaceholder: 'Search users by name, email, or city...',
      deleteUserConfirm: 'Are you sure you want to remove this user account?',
      userDeletedToast: 'User account removed from database',
    },
    auth: {
      title: 'BioCanopy Climate Portal',
      subtitle: 'Sign in to access personalized cool routes, crowdsource heat hazard reports, and view open telemetry.',
      tabSignIn: 'Sign In',
      tabCreateAccount: 'Create Account',
      fullName: 'Full Name',
      emailAddress: 'Email Address',
      password: 'Password',
      assignedCity: 'Assigned City',
      selectCityPlaceholder: 'Select your primary city',
      btnSignIn: 'Sign In to BioCanopy',
      btnCreateAccount: 'Create BioCanopy Account',
      demoCitizen: 'Demo Citizen Login',
      demoAdmin: 'Demo Admin Login',
      signingIn: 'Signing in...',
      signInWithGoogle: 'Sign in with Google',
      orDivider: 'OR',
      welcomeEmailSent: 'Welcome email delivered to',
      emailSentNotice: 'Confirmation email dispatched to your inbox.',
      emailSubject: '🌿 Welcome to BioCanopy — Sign-in Successful',
      googleModalTitle: 'Sign in with Google',
      googleModalDesc: 'Select your Google identity to access BioCanopy cool routes and air telemetry.',
      continueGoogleBtn: 'Continue with Google',
    },
    profile: {
      title: 'Citizen Profile',
      subtitle: 'Account details, community reports, and visited cool routes',
      tabAccount: 'Account Info',
      tabReports: 'My Reports',
      tabRoutes: 'Route History',
      nameLabel: 'Full Name',
      emailLabel: 'Email Address',
      passwordLabel: 'Account Password',
      showPassword: 'Show',
      hidePassword: 'Hide',
      roleLabel: 'User Role',
      memberSince: 'Member Since',
      noReportsTitle: 'No Reports Filed Yet',
      noReportsDesc: 'You have not submitted any community hazard reports yet. Use the "Report Hazard" button to flag unshaded spots or smog sources.',
      reportedHazardsCount: 'community hazards reported',
      noRoutesTitle: 'No Route History',
      noRoutesDesc: 'You have not navigated any routes yet. Start navigation on the Cool-Route Map to log your shaded journeys.',
      visitedRoutesCount: 'cool routes visited',
      shadedCoverage: 'Shade Coverage',
      heatAvoided: 'Heat Reduction',
      closeBtn: 'Close Profile',
      status: 'Status',
      completed: 'Completed',
      mins: 'mins',
      km: 'km',
      cityLabel: 'City Hub',
      editBtn: 'Edit',
      saveBtn: 'Save',
      cancelBtn: 'Cancel',
      editPassword: 'Edit Password',
      editCity: 'Edit City',
      passwordUpdated: 'Password updated successfully!',
      cityUpdated: 'City updated successfully!',
      passwordMinLength: 'Password must be at least 6 characters',
      newPasswordPlaceholder: 'Enter new password (min. 6 chars)',
      readOnlyBadge: 'Read-only',
    },
  },
  hi: {
    common: {
      appName: 'बायोकैनोपी',
      tagline: 'शहरी वायु गुणवत्ता और अत्यधिक गर्मी समाधान',
      loading: 'लोड हो रहा है...',
      citizen: 'नागरिक',
      admin: 'प्रशासक',
      welcome: 'स्वागत है',
      close: 'बंद करें',
      cancel: 'रद्द करें',
      submit: 'जमा करें',
      upvote: 'समर्थन',
      mins: 'मिनट',
      hours: 'घंटे',
      goal: 'लक्ष्य',
      active: 'सक्रिय',
      all: 'सभी',
      live: 'लाइव',
      offline: 'ऑफलाइन',
    },
    nav: {
      menu: 'मेन्यू',
      rollUp: 'समेटें',
      rollUpCanopy: 'कैनोपी समेटें',
      canopyMenu: 'कैनोपी मेन्यू',
      selectModule: 'नेविगेट करने के लिए मॉड्यूल चुनें',
      reportHazard: 'खतरे की सूचना दें',
      logOut: 'लॉग आउट',
      overview: 'अवलोकन डैशबोर्ड',
      overviewBadge: 'मुख्य हब',
      coolRoute: 'शीतल मार्ग नक्शा',
      coolRouteBadge: '८२% छायादार',
      openData: 'ओपन डेटा डैशबोर्ड',
      openDataBadge: '३-स्तरीय पैमाना',
      citizenReporting: 'नागरिक रिपोर्टिंग',
      citizenReportingBadge: 'नागरिक सहभाग',
      aiAdvisor: 'एआई सुरक्षा सलाहकार',
      aiAdvisorBadge: 'रीयल-टाइम सलाह',
      adminCommand: 'प्राधिकरण कमांड',
      adminCommandBadge: 'व्यवस्थापक',
    },
    dashboard: {
      welcomeBannerTitle: 'शहरी वायु गुणवत्ता एवं चरम ताप लचीलापन',
      welcomeBannerDesc:
        'बायोकैनोपी पांच नागरिक-केंद्रित मॉड्यूल को जोड़कर छायादार मार्गों का नक्शा, सरल टेलीमेट्री, स्थानीय खतरे की रिपोर्ट और हरित पहल का मार्गदर्शन करता है।',
      launchCoolRoute: 'शीतल मार्ग नक्शा शुरू करें',
      liveSensorFeed: 'लाइव सैटेलाइट और जमीनी डेटा',
      updatingSensors: 'सेंसर डेटा अपडेट हो रहा है...',
      surfaceTemp: 'सतह का तापमान',
      airQualityIndex: 'वायु गुणवत्ता सूचकांक',
      urbanTreeCanopy: 'शहरी वृक्ष आवरण',
      activeCitizenPins: 'सक्रिय नागरिक रिपोर्ट',
      targetGoal: '/ ३३% लक्ष्य',
      inCity: 'में',
      highRisk: 'उच्च जोखिम',
      moderateRisk: 'मध्यम जोखिम',
      lowRisk: 'कम जोखिम',
    },
    map: {
      title: 'शीतल मार्ग नेविगेशन',
      subtitle: 'अनुशंसित ८२% छायादार हरित गलियारा बनाम सीधा धूप वाला डामर रोड',
      coolPath: 'शीतल मार्ग',
      fastestPath: 'सबसे तेज़ मार्ग',
      thermalSatellite: 'थर्मल सैटेलाइट',
      hazardPins: 'खतरा पिन',
      startShadedRoute: 'छायादार मार्ग शुरू करें',
      stopNavigation: 'नेविगेशन रोकें',
      flagHeatSpot: 'खतरा दर्ज करें',
      turnNavigation: 'दिशा-निर्देश नेविगेशन',
      stepOf: 'कदम',
      arrivalIn: 'आगमन ~१४ मिनट में',
      canopyShadeBadge: '+८२% वृक्ष छाया आवरण',
      navigationLegend: 'नक्शा संकेतक',
      legendCoolPath: 'अनुशंसित शीतल मार्ग (हल्का फिरोजी)',
      legendFastestPath: 'सबसे तेज़ मार्ग (गहरा लाल)',
      legendHotspot: 'थर्मल सैटेलाइट हॉटस्पॉट (४२°C+)',
      legendHazardPin: 'नागरिक खतरा पिन',
      coolPathDetails:
        'नीम और बरगद के घने पेड़ सीधे डामर रोड की तुलना में विकिरण ताप को -३४% तक कम करते हैं।',
      fastestPathDetails:
        'सीधा मुख्य मार्ग जो तेज धूप के संपर्क में है और जहां छायादार पेड़ बहुत कम हैं।',
      heatReduction: 'तापमान में कमी',
      extraCommute: 'अतिरिक्त समय',
      worthTheComfort: 'आरामदायक सफर',
      highHeatExposure: 'अत्यधिक धूप जोखिम',
      shadedCover: 'छायादार आवरण',
      continuousCanopy: '✓ निरंतर वृक्ष आवरण सुरक्षा',
      highSolarStress: '⚠ उच्च सौर विकिरण ताप तनाव',
      hotspotTitle: 'थर्मल सैटेलाइट हॉटस्पॉट',
      hotspotObserved: 'दर्ज सतह तापमान',
      hotspotDesc: 'खुला कंक्रीट और वाहनों का धुआं स्थानीय हीट आइलैंड बना रहा है।',
    },
    openData: {
      title: 'ओपन पर्यावरण टेलीमेट्री',
      subtitle: 'शहरी सूक्ष्म जलवायु के लिए जमीनी सेंसर व उपग्रह डेटा',
      refreshedLive: 'जमीनी सेंसरों से रीयल-टाइम अपडेट',
      heatIndex: 'स्थानीय हीट इंडेक्स',
      aqi: 'वायु गुणवत्ता सूचकांक (AQI)',
      canopyDensity: 'शहरी वृक्ष आवरण घनत्व',
      pedestrianHeatRisk: 'पैदल यात्री ताप जोखिम',
      diurnalTitle: '२४ घंटे का दैनिक जलवायु वक्र',
      diurnalDesc:
        'सतह के तापमान, सूक्ष्म कणों (PM2.5/PM10) और पैदल यात्रियों के ताप जोखिम के बीच संबंध।',
      tempAxis: 'तापमान (°C)',
      aqiAxis: 'AQI स्तर',
      heatRiskAxis: 'ताप जोखिम स्कोर',
      provenanceCpcb: 'स्रोत: केंद्रीय प्रदूषण नियंत्रण बोर्ड (CPCB) स्टेशन',
      provenanceImd: 'स्रोत: भारत मौसम विज्ञान विभाग (IMD) टेलीमेट्री',
      provenanceSatellite: 'स्रोत: लैंडसैट व सेंटिनल-२ थर्मल इंफ्रारेड उपग्रह',
      sdg13Title: 'एसडीजी १३: जलवायु कार्यवाई (लक्ष्य १३.१ व १३.२)',
      sdg13Desc:
        'ओपन डेटा और त्वरित ताप प्रतिक्रिया प्रणाली के माध्यम से जलवायु लचीलापन सुदृढ़ करना।',
      sdg11Title: 'एसडीजी ११: टिकाऊ शहर और समुदाय',
      sdg11Desc:
        'सुरक्षित, समावेशी, हरित सार्वजनिक स्थानों और छायादार पैदल मार्गों तक सार्वभौमिक पहुंच।',
      sdg3Title: 'एसडीजी ३: उत्तम स्वास्थ्य और खुशहाली',
      sdg3Desc:
        'लू के मामलों, वायु प्रदूषण से होने वाली श्वसन समस्याओं और हृदय तनाव में कमी लाना।',
      dangerous: 'खतरनाक',
      severe: 'गंभीर',
      criticalShortfall: 'गंभीर कमी',
      moderate: 'मध्यम',
      viewTempAqi: 'तापमान और AQI',
      viewPm: 'कण सांद्रता (PM2.5 और PM10)',
      viewThermalHumidity: 'तापमान और आर्द्रता',
      exportCsv: 'CSV डेटासेट डाउनलोड करें',
      exportJson: 'रॉ JSON फ़ीड',
      multiCityCompare: 'अंतर-शहरी पर्यावरण तुलना',
      multiCityCompareDesc:
        'सभी ४ नगर निगम केंद्रों का रीयल-टाइम पर्यावरण टेलीमेट्री डेटा।',
      refreshData: 'रीयल-टाइम डेटा रीफ्रेश करें',
      stationDetails: 'निगरानी केंद्र विवरण',
      loadingTrends: '२४ घंटे के मौसम संबंधी आंकड़े लोड हो रहे हैं...',
      interCityComparison: 'सभी मॉनिटर किए गए शहर',
      downloadSuccess: 'टेलीमेट्री डेटासेट CSV सफलतापूर्वक डाउनलोड किया गया!',
    },
    reports: {
      title: 'नागरिक खतरा रिपोर्टिंग',
      activeReportsSubtitle: 'में सक्रिय नागरिक शिकायतें',
      reportNewHazard: 'नया खतरा रिपोर्ट करें',
      liveMapTitle: 'लाइव जीपीएस खतरा नक्शा',
      activePins: 'सक्रिय पिन',
      complaintsFeedTitle: 'नागरिक शिकायत सूची',
      filterAll: 'सभी',
      filterUnshaded: 'छायाहीन हॉटस्पॉट',
      filterBurning: 'अवैध कचरा दहन',
      filterDust: 'निर्माण धूल',
      filterNoTree: 'वृक्ष आवरण शून्य',
      statusPending: 'सत्यापन लंबित',
      statusReviewed: 'समीक्षित',
      statusDispatched: 'कार्य दल भेजा गया',
      upvotePrompt: 'प्राथमिकता बढ़ाने के लिए समर्थन दें',
      noReportsFound: 'वर्तमान फ़िल्टर में कोई रिपोर्ट नहीं मिली।',
    },
    reportModal: {
      modalTitle: 'पर्यावरणीय खतरे की सूचना दें',
      modalSubtitle: 'बायोकैनोपी सार्वजनिक मानचित्र और नगर निगम कार्य सूची में दर्ज होगा',
      step1Title: '१. खतरे की श्रेणी चुनें',
      step2Title: '२. स्थान और जीपीएस पिन पूर्वावलोकन',
      step3Title: '३. फोटो प्रमाण संलग्न करें',
      step4Title: '४. अतिरिक्त विवरण व टिप्पणी',
      catUnshadedTitle: 'छायाहीन हॉटस्पॉट',
      catUnshadedDesc: 'अत्यधिक गर्म फुटपाथ, बिना छाया के बस स्टॉप या पुल',
      catBurningTitle: 'अवैध कचरा दहन',
      catBurningDesc: 'कूड़ा, प्लास्टिक या सूखे पत्ते खुले में जलाए जा रहे हैं',
      catDustTitle: 'निर्माण धूल',
      catDustDesc: 'सड़क या इमारत निर्माण से भारी धूल कण (PM10) उड़ रहे हैं',
      catNoTreeTitle: 'वृक्ष आवरण शून्य',
      catNoTreeDesc: 'बंजर फुटपाथ जहाँ तत्काल नए पौधे लगाने की आवश्यकता है',
      useCurrentGps: 'वर्तमान जीपीएस स्थान उपयोग करें',
      acquiringGps: 'जीपीएस खोज रहे हैं...',
      locationPlaceholder: 'उदा. स्टेशन गेट या बस स्टॉप के पास',
      tapRepositionPin: '📍 पिन बदलने के लिए नक्शे पर टैप करें:',
      photoClickOrDrag: 'फोटो अपलोड करने के लिए क्लिक करें या खींचें',
      photoAttached: '✓ संलग्न फोटो:',
      photoMetadataNote: 'PNG, JPG या WEBP (अधिकतम 5MB) · जीपीएस जानकारी स्वतः ली जाएगी',
      notesPlaceholder:
        'स्थिति का वर्णन करें: उदा. बैठने की बेंच बहुत गर्म है, भारी काला धुआं है, या ३०० मीटर तक कोई पेड़ नहीं है...',
      cancelBtn: 'रद्द करें',
      submitBtn: 'सार्वजनिक मानचित्र पर दर्ज करें',
    },
    advisor: {
      title: 'एआई ताप एवं स्वास्थ्य सुरक्षा सलाहकार',
      subtitle: 'जमीनी टेलीमेट्री और पर्यावरण एआई द्वारा संचालित त्वरित सलाह',
      liveEngine: 'लाइव इंजन',
      simulateTemp: 'पर्यावरणीय तापमान सिम्युलेटर',
      scenarioHeatwave: 'दोपहर की तीव्र लू (४१°C)',
      scenarioSmog: 'सुबह का स्मॉग पीक (AQI १९५)',
      scenarioSunset: 'शाम की ठंडक (३१°C)',
      openCoolRouteCTA: 'इस मौसम के लिए शीतल मार्ग देखें',
      hydrationPrompt: 'जलपान लक्ष्य',
      safeTransitHours: 'सुरक्षित समय सीमा',
      hourlyForecastTitle: '२४-घंटे का सुरक्षा कार्यक्रम',
      extremeWarning: 'गंभीर चेतावनी',
      highAdvisory: 'उच्च परामर्श',
      moderateAdvisory: 'मध्यम',
      comfortableWindow: 'सुरक्षित',
      guidanceHeatwaveHeadline: 'शाम ५:३० तक बाहर जाने से बचें — सतह पर अत्यधिक ताप दर्ज',
      guidanceHeatwaveBody:
        'धूप वाले कंक्रीट का तापमान ५०°C से ऊपर पहुँच गया है। गैर-जरूरी यात्रा टालें या ८२% छायादार शीतल मार्ग चुनें।',
      guidanceSmogHeadline: 'धूप वाले रास्तों से बचें — दोपहर का सौर विकिरण सक्रिय',
      guidanceSmogBody:
        'दोपहर १२ से शाम ४ बजे तक खिड़कियाँ बंद रखें ताकि अंदरूनी हवा गर्म न हो। नीम और बरगद के छायादार पेड़ों के नीचे ही चलें।',
      guidanceModerateHeadline: 'पर्याप्त जलपान और छायादार रास्तों के साथ सामान्य स्थिति',
      guidanceModerateBody:
        'मौसम गर्म है परंतु सुरक्षित सीमा में है। ३-४°C राहत के लिए वृक्ष आच्छादित गलियारों का प्रयोग करें।',
      guidanceComfortHeadline: 'उत्तम बाहरी मौसम — आवागमन व सैर के लिए सुरक्षित',
      guidanceComfortBody:
        'तापमान आरामदायक है। ताजी हवा के लिए खिड़कियाँ खोलें और हरे-भरे उद्यानों का आनंद लें।',
    },
    admin: {
      title: 'नगरपालिका प्राधिकरण कमांड सेंटर',
      subtitle: 'नागरिक शिकायतों की समीक्षा करें, वृक्षारोपण दल भेजें और शहर की हरियाली बढ़ाएं',
      roleBadge: 'शहर प्रशासक',
      kpiTotalReports: 'कुल रिपोर्ट',
      kpiPendingTriage: 'लंबित सत्यापन',
      kpiDispatched: 'भेजे गए कार्य दल',
      kpiResolved: 'समाधान संपन्न',
      kpiCitizens: 'पंजीकृत नागरिक',
      searchPlaceholder: 'स्थान, नागरिक या कीवर्ड से शिकायतें खोजें...',
      filterCity: 'शहर चुनें',
      filterStatus: 'स्थिति चुनें',
      filterCategory: 'श्रेणी चुनें',
      allCities: 'सभी शहर',
      allStatuses: 'सभी स्थितियां',
      allCategories: 'सभी श्रेणियां',
      btnReview: 'समीक्षा करें',
      btnDispatch: 'वृक्षारोपण दल भेजें',
      btnResolve: 'समाधान संपन्न',
      btnDelete: 'हटाएं',
      statusUpdatedToast: 'रिपोर्ट स्थिति सफलतापूर्वक अपडेट हुई',
      reportDeletedToast: 'शिकायत सूची से हटा दी गई',
      noReportsFound: 'वर्तमान फ़िल्टर में कोई शिकायत नहीं मिली।',
      tabReports: 'खतरा रिपोर्ट',
      tabUsers: 'पंजीकृत नागरिक',
      usersDirectoryTitle: 'पंजीकृत नागरिक एवं उपयोगकर्ता',
      usersDirectorySubtitle: 'सभी सत्यापित नागरिकों, शहर हब और व्यवस्थापक खातों की सूची',
      userNameCol: 'नागरिक / नाम',
      userEmailCol: 'ईमेल पता',
      userCityCol: 'शहर हब',
      userRoleCol: 'भूमिका',
      userRegisteredCol: 'पंजीकरण समय',
      userActionsCol: 'कार्रवाई',
      noUsersFound: 'खोजे गए निकष में कोई उपयोगकर्ता नहीं मिला।',
      searchUsersPlaceholder: 'नाम, ईमेल या शहर से नागरिक खोजें...',
      deleteUserConfirm: 'क्या आप इस उपयोगकर्ता खाते को हटाना चाहते हैं?',
      userDeletedToast: 'उपयोगकर्ता खाता डेटाबेस से हटा दिया गया',
    },
    auth: {
      title: 'बायोकैनोपी जलवायु पोर्टल',
      subtitle: 'शीतल मार्ग, खतरा रिपोर्टिंग और ओपन टेलीमेट्री के लिए लॉग इन करें।',
      tabSignIn: 'लॉग इन',
      tabCreateAccount: 'नया खाता बनाएं',
      fullName: 'पूरा नाम',
      emailAddress: 'ईमेल पता',
      password: 'पासवर्ड',
      assignedCity: 'शहर चुनें',
      selectCityPlaceholder: 'अपना मुख्य शहर चुनें',
      btnSignIn: 'बायोकैनोपी में लॉग इन करें',
      btnCreateAccount: 'नया खाता पंजीकृत करें',
      demoCitizen: 'नागरिक डेमो लॉग इन',
      demoAdmin: 'प्रशासक डेमो लॉग इन',
      signingIn: 'लॉग इन हो रहा है...',
      signInWithGoogle: 'गूगल से साइन इन करें',
      orDivider: 'या',
      welcomeEmailSent: 'स्वागत ईमेल भेजा गया:',
      emailSentNotice: 'आपके इनबॉक्स में पुष्टि ईमेल भेज दिया गया है।',
      emailSubject: '🌿 बायोकैनोपी में आपका स्वागत है — सफल साइन इन',
      googleModalTitle: 'गूगल से साइन इन करें',
      googleModalDesc: 'बायोकैनोपी शीतल मार्ग और वायु टेलीमेट्री तक पहुँचने के लिए अपना गूगल खाता चुनें।',
      continueGoogleBtn: 'गूगल के साथ जारी रखें',
    },
    profile: {
      title: 'नागरिक प्रोफ़ाइल',
      subtitle: 'खाता विवरण, आपकी दर्ज रिपोर्ट और भ्रमण किए गए शीतल मार्ग',
      tabAccount: 'खाता विवरण',
      tabReports: 'मेरी रिपोर्ट',
      tabRoutes: 'मार्ग इतिहास',
      nameLabel: 'पूरा नाम',
      emailLabel: 'ईमेल पता',
      passwordLabel: 'खाता पासवर्ड',
      showPassword: 'देखें',
      hidePassword: 'छिपाएं',
      roleLabel: 'उपयोगकर्ता भूमिका',
      memberSince: 'सदस्यता प्रारंभ',
      noReportsTitle: 'कोई रिपोर्ट दर्ज नहीं',
      noReportsDesc: 'आपने अभी तक कोई खतरा रिपोर्ट दर्ज नहीं की है। धूप वाले हॉटस्पॉट या प्रदूषण की सूचना देने के लिए "खतरा रिपोर्ट करें" का उपयोग करें।',
      reportedHazardsCount: 'सामुदायिक खतरे दर्ज किए गए',
      noRoutesTitle: 'कोई मार्ग इतिहास नहीं',
      noRoutesDesc: 'आपने अभी तक कोई मार्ग भ्रमण नहीं किया है। अपनी छायादार यात्राओं को दर्ज करने के लिए शीतल-मार्ग मानचित्र पर नेविगेशन शुरू करें।',
      visitedRoutesCount: 'शीतल मार्ग भ्रमण किए',
      shadedCoverage: 'छाया आवरण',
      heatAvoided: 'तापमान में कमी',
      closeBtn: 'प्रोफ़ाइल बंद करें',
      status: 'स्थिति',
      completed: 'संपन्न',
      mins: 'मिनट',
      km: 'किमी',
      cityLabel: 'शहर हब',
      editBtn: 'संपादित करें',
      saveBtn: 'सहेजें',
      cancelBtn: 'रद्द करें',
      editPassword: 'पासवर्ड बदलें',
      editCity: 'शहर बदलें',
      passwordUpdated: 'पासवर्ड सफलतापूर्वक बदल दिया गया!',
      cityUpdated: 'शहर सफलतापूर्वक बदल दिया गया!',
      passwordMinLength: 'पासवर्ड कम से कम ६ अक्षरों का होना चाहिए',
      newPasswordPlaceholder: 'नया पासवर्ड दर्ज करें (न्यूनतम ६ अक्षर)',
      readOnlyBadge: 'केवल पढ़ने योग्य',
    },
  },
  mr: {
    common: {
      appName: 'बायोकॅनॉपी',
      tagline: 'शहरी हवेची गुणवत्ता आणि तीव्र उष्णता निवारण प्लॅटफॉर्म',
      loading: 'लोड होत आहे...',
      citizen: 'नागरिक',
      admin: 'प्रशासक',
      welcome: 'स्वागत आहे',
      close: 'बंद करा',
      cancel: 'रद्द करा',
      submit: 'दाखल करा',
      upvote: 'समर्थन द्या',
      mins: 'मिनिटे',
      hours: 'तास',
      goal: 'ध्येय',
      active: 'सक्रिय',
      all: 'सर्व',
      live: 'थेट',
      offline: 'ऑफलाइन',
    },
    nav: {
      menu: 'मेनू',
      rollUp: 'बंद करा',
      rollUpCanopy: 'कॅनॉपी बंद करा',
      canopyMenu: 'कॅनॉपी मेनू',
      selectModule: 'नेव्हिगेट करण्यासाठी विभाग निवडा',
      reportHazard: 'धोक्याची नोंद करा',
      logOut: 'लॉग आउट',
      overview: 'आढावा डॅशबोर्ड',
      overviewBadge: 'मुख्य केंद्र',
      coolRoute: 'शीतल मार्ग नकाशा',
      coolRouteBadge: '८२% सावलीयुक्त',
      openData: 'ओपन डेटा डॅशबोर्ड',
      openDataBadge: '३-स्तरीय मोजपट्टी',
      citizenReporting: 'नागरिक तक्रार नोंदणी',
      citizenReportingBadge: 'लोकसहभाग',
      aiAdvisor: 'एआय सुरक्षा सल्लागार',
      aiAdvisorBadge: 'थेट मार्गदर्शन',
      adminCommand: 'प्रशासन नियंत्रण',
      adminCommandBadge: 'प्रशासक',
    },
    dashboard: {
      welcomeBannerTitle: 'शहरी हवेची गुणवत्ता आणि तीव्र उष्णता निवारण',
      welcomeBannerDesc:
        'बायोकॅनॉपी सावलीचे मार्ग, सुलभ टेलिमेट्री, स्थानिक तक्रार नोंदणी आणि हरित उपक्रमांचे मार्गदर्शन एकत्र आणते.',
      launchCoolRoute: 'शीतल मार्ग नकाशा उघडा',
      liveSensorFeed: 'थेट उपग्रह व भूपृष्ठ डेटा',
      updatingSensors: 'सेन्सॉर डेटा अद्ययावत होत आहे...',
      surfaceTemp: 'पृष्ठभागाचे तापमान',
      airQualityIndex: 'हवा गुणवत्ता निर्देशांक',
      urbanTreeCanopy: 'शहरी झाडांचे आच्छादन',
      activeCitizenPins: 'सक्रिय नागरिक तक्रारी',
      targetGoal: '/ ३३% ध्येय',
      inCity: 'मध्ये',
      highRisk: 'जास्त धोका',
      moderateRisk: 'मध्यम धोका',
      lowRisk: 'कमी धोका',
    },
    map: {
      title: 'शीतल मार्ग नेव्हिगेशन',
      subtitle: 'शिफारस केलेला ८२% सावलीयुक्त हरित मार्ग विरुद्ध उघडा डांबरी रस्ता',
      coolPath: 'शीतल मार्ग',
      fastestPath: 'जलद मार्ग',
      thermalSatellite: 'थर्मल उपग्रह',
      hazardPins: 'धोक्याच्या पिन',
      startShadedRoute: 'सावलीचा प्रवास सुरू करा',
      stopNavigation: 'नेव्हिगेशन थांबवा',
      flagHeatSpot: 'धोका नोंदवा',
      turnNavigation: 'वळण-दर-वळण नेव्हिगेशन',
      stepOf: 'टप्पा',
      arrivalIn: 'पोहोचण्याची वेळ ~१४ मिनिटे',
      canopyShadeBadge: '+८२% झाडांची सावली',
      navigationLegend: 'नकाशा सूची',
      legendCoolPath: 'शिफारस केलेला सावलीचा मार्ग (फिकट निळा)',
      legendFastestPath: 'जलद मार्ग (गडद लाल)',
      legendHotspot: 'थर्मल उपग्रह हॉटस्पॉट (४२°C+)',
      legendHazardPin: 'नागरिक धोका पिन',
      coolPathDetails:
        'कडुनिंब आणि वडाच्या वृक्षांमुळे डांबरी रस्त्याच्या तुलनेत उष्णता -३४% ने कमी होते.',
      fastestPathDetails:
        'थेट उन्हाचा मुख्य रस्ता जिथे सावली देणारी झाडे उपलब्ध नाहीत.',
      heatReduction: 'उष्णतेत घट',
      extraCommute: 'अतिरिक्त वेळ',
      worthTheComfort: 'सुखकर प्रवास',
      highHeatExposure: 'जास्त उष्णता',
      shadedCover: 'सावलीचे आच्छादन',
      continuousCanopy: '✓ सलग झाडांची सावली व संरक्षण',
      highSolarStress: '⚠ अतिउष्णतेचा त्रास',
      hotspotTitle: 'थर्मल उपग्रह हॉटस्पॉट',
      hotspotObserved: 'नोंदवलेले तापमान',
      hotspotDesc: 'काँक्रीट आणि वाहनांच्या धुरामुळे तीव्र उष्णतेचा पट्टा तयार झाला आहे.',
    },
    openData: {
      title: 'पर्यावरण खुली टेलिमेट्री',
      subtitle: 'शहरी सूक्ष्म हवामानासाठी थेट सेन्सर्स आणि उपग्रह माहिती',
      refreshedLive: 'थेट जमिनीवरील सेन्सर्सवरून अद्ययावत',
      heatIndex: 'स्थानिक उष्णता निर्देशांक',
      aqi: 'हवा गुणवत्ता निर्देशांक (AQI)',
      canopyDensity: 'झाडांचे आच्छादन',
      pedestrianHeatRisk: 'पादचारी उष्णता धोका',
      diurnalTitle: '२४ तासांची हवामान वक्ररेषा',
      diurnalDesc:
        'तापमान, धुलिकण (PM2.5/PM10) आणि पादचारी धोका यांमधील परस्पर संबंध.',
      tempAxis: 'तापमान (°C)',
      aqiAxis: 'AQI पातळी',
      heatRiskAxis: 'उष्णता धोका गुण',
      provenanceCpcb: 'स्रोत: केंद्रीय प्रदूषण नियंत्रण मंडळ (CPCB) सेन्सर्स',
      provenanceImd: 'स्रोत: भारतीय हवामान विभाग (IMD) केंद्र',
      provenanceSatellite: 'स्रोत: उपग्रह थर्मल इन्फ्रारेड डेटा',
      sdg13Title: 'SDG १३: हवामान कृती (लक्ष्य १३.१ आणि १३.२)',
      sdg13Desc:
        'पारदर्शक डेटा व तातडीच्या उपाययोजनांद्वारे हवामान बदल प्रतिकारशक्ती वाढवणे.',
      sdg11Title: 'SDG ११: शाश्वत शहरे आणि समुदाय',
      sdg11Desc:
        'सुरक्षित, सर्वसमावेशक, हिरवेगार सार्वजनिक परिसर आणि सावलीचे रस्ते उपलब्ध करणे.',
      sdg3Title: 'SDG ३: चांगले आरोग्य आणि निरोगी जीवन',
      sdg3Desc:
        'उष्माघाताचे प्रमाण कमी करणे, हवेच्या प्रदूषणामुळे होणारे श्वसनविकार रोखणे.',
      dangerous: 'धोकादायक',
      severe: 'अतिवाईट',
      criticalShortfall: 'मोठी तूट',
      moderate: 'मध्यम',
      viewTempAqi: 'तापमान आणि AQI',
      viewPm: 'धूलिकण (PM2.5 आणि PM10)',
      viewThermalHumidity: 'तापमान आणि आर्द्रता',
      exportCsv: 'CSV डेटा डाऊनलोड करा',
      exportJson: 'रॉ JSON फीड',
      multiCityCompare: 'शहरांमधील पर्यावरण तुलना',
      multiCityCompareDesc:
        'सर्व ४ महापालिका केंद्रांमधील थेट पर्यावरण टेलीमेट्री.',
      refreshData: 'थेट डेटा रीफ्रेश करा',
      stationDetails: 'निरीक्षण केंद्र तपशील',
      loadingTrends: '२४ तासांची हवामान आकडेवारी लोड होत आहे...',
      interCityComparison: 'सर्व नोंदणीकृत शहरे',
      downloadSuccess: 'टेलीमेट्री डेटासेट CSV यशस्वीरित्या डाऊनलोड झाले!',
    },
    reports: {
      title: 'नागरिक तक्रार नोंदणी',
      activeReportsSubtitle: 'मधील सक्रिय नागरिक तक्रारी',
      reportNewHazard: 'नवीन तक्रार नोंदवा',
      liveMapTitle: 'थेट जीपीएस धोका नकाशा',
      activePins: 'सक्रिय पिन',
      complaintsFeedTitle: 'नागरिक तक्रारींची यादी',
      filterAll: 'सर्व',
      filterUnshaded: 'सावली नसलेला भाग',
      filterBurning: 'कचरा जाळणे',
      filterDust: 'बांधकाम धूळ',
      filterNoTree: 'झाडे नसलेला परिसर',
      statusPending: 'पडताळणी प्रलंबित',
      statusReviewed: 'तपासले',
      statusDispatched: 'मोहीम सुरू केली',
      upvotePrompt: 'प्राधान्य देण्यासाठी मत द्या',
      noReportsFound: 'सध्या निवडलेल्या निकषात कोणतीही तक्रार नाही.',
    },
    reportModal: {
      modalTitle: 'पर्यावरणीय धोक्याची नोंद करा',
      modalSubtitle: 'बायोकॅनॉपी सार्वजनिक नकाशा व पालिका कार्यप्रणालीत दाखल होईल',
      step1Title: '१. धोक्याचा प्रकार निवडा',
      step2Title: '२. स्थान आणि जीपीएस पिन',
      step3Title: '३. फोटो पुरावा जोडा',
      step4Title: '४. अतिरिक्त माहिती व तपशील',
      catUnshadedTitle: 'सावली नसलेला भाग',
      catUnshadedDesc: 'अतिउष्ण रस्ता, सावली नसलेला बस थांबा किंवा पूल',
      catBurningTitle: 'कचरा जाळणे',
      catBurningDesc: 'कचरा, प्लास्टिक किंवा वाळलेली पाने उघड्यावर जाळली जात आहेत',
      catDustTitle: 'बांधकाम धूळ',
      catDustDesc: 'रस्ता किंवा इमारत बांधकामामुळे हवेत धूळ पसरत आहे',
      catNoTreeTitle: 'झाडे नसलेला परिसर',
      catNoTreeDesc: 'झाडे नसलेला पदपथ जिथे तातडीने वृक्षारोपणाची गरज आहे',
      useCurrentGps: 'सध्याचे जीपीएस स्थान वापरा',
      acquiringGps: 'जीपीएस शोधत आहे...',
      locationPlaceholder: 'उदा. स्टेशन किंवा बस स्थानकाजवळ',
      tapRepositionPin: '📍 पिन हलवण्यासाठी नकाशावर टॅप करा:',
      photoClickOrDrag: 'फोटो जोडण्यासाठी क्लिक करा किंवा फाईल ओढा',
      photoAttached: '✓ जोडलेला फोटो:',
      photoMetadataNote: 'PNG, JPG किंवा WEBP (कमाल 5MB) · जीपीएस माहिती आपोआप घेतली जाईल',
      notesPlaceholder:
        'तपशील लिहा: उदा. बसण्याची बाकडी खूप तापली आहेत, काळा धूर आहे, किंवा ३०० मीटरपर्यंत सावली नाही...',
      cancelBtn: 'रद्द करा',
      submitBtn: 'सार्वजनिक नकाशावर जोडा',
    },
    advisor: {
      title: 'एआय उष्णता व आरोग्य सुरक्षा सल्लागार',
      subtitle: 'थेट सेन्सर्स आणि हवामान डेटावर आधारित त्वरित मार्गदर्शन',
      liveEngine: 'थेट विश्लेषण',
      simulateTemp: 'वातावरणातील तापमान सिम्युलेटर',
      scenarioHeatwave: 'दुपारची तीव्र उष्णता (४१°C)',
      scenarioSmog: 'सकाळचे धुके व प्रदूषण (AQI १९५)',
      scenarioSunset: 'संध्याकाळची सुखद हवा (३१°C)',
      openCoolRouteCTA: 'या परिस्थितीसाठी शीतल मार्ग पहा',
      hydrationPrompt: 'पाणी पिण्याचे ध्येय',
      safeTransitHours: 'प्रवासाची योग्य वेळ',
      hourlyForecastTitle: '२४ तासांचे सुरक्षा वेळापत्रक',
      extremeWarning: 'गंभीर इशारा',
      highAdvisory: 'उच्च दक्षता सूचना',
      moderateAdvisory: 'मध्यम',
      comfortableWindow: 'सुरक्षित',
      guidanceHeatwaveHeadline: 'संध्याकाळी ५:३० पर्यंत बाहेर जाणे टाळा — रस्ते प्रचंड तापले आहेत',
      guidanceHeatwaveBody:
        'उन्हातील डांबराचे तापमान ५०°C पेक्षा जास्त आहे. महत्वाचे नसल्यास प्रवास टाळा किंवा ८२% सावली असलेला शीतल मार्ग वापरा.',
      guidanceSmogHeadline: 'उन्हातील प्रवास टाळा — दुपारची उष्णता जास्त आहे',
      guidanceSmogBody:
        'दुपारी १२ ते ४ दरम्यान खिडक्या बंद ठेवा जेणेकरून घरातील हवा गरम होणार नाही. कडुनिंब आणि वडाच्या सावलीतूनच चाला.',
      guidanceModerateHeadline: 'भरपूर पाणी आणि सावलीच्या मार्गांसह सामान्य परिस्थिती',
      guidanceModerateBody:
        'हवामान उबदार आहे पण सुरक्षित मर्यादेत आहे. ३-४°C थंडाव्यासाठी झाडांच्या सावलीचा वापर करा.',
      guidanceComfortHeadline: 'उत्तम हवामान — प्रवासासाठी आणि फिरण्यासाठी सुरक्षित',
      guidanceComfortBody:
        'तापमान सुखद आहे. खेळत्या हवेसाठी खिडक्या उघड्या ठेवा आणि हिरव्यागार बागांचा आनंद घ्या.',
    },
    admin: {
      title: 'महानगरपालिका प्रशासन नियंत्रण कक्ष',
      subtitle: 'नागरिक तक्रारी तपासा, वृक्षारोपण मोहीम राबवा आणि शहराचे हरित आच्छादन वाढवा',
      roleBadge: 'शहर प्रशासक',
      kpiTotalReports: 'एकूण तक्रारी',
      kpiPendingTriage: 'प्रलंबित तक्रारी',
      kpiDispatched: 'सुरू केलेल्या मोहिमा',
      kpiResolved: 'निवारण झालेले',
      kpiCitizens: 'नोंदणीकृत नागरिक',
      searchPlaceholder: 'स्थान, नागरिक किंवा शब्दाने तक्रारी शोधा...',
      filterCity: 'शहर निवडा',
      filterStatus: 'स्थिती निवडा',
      filterCategory: 'प्रकार निवडा',
      allCities: 'सर्व शहरे',
      allStatuses: 'सर्व स्थिती',
      allCategories: 'सर्व प्रकार',
      btnReview: 'तपासा',
      btnDispatch: 'झाडे लावणारे पथक पाठवा',
      btnResolve: 'निवारण पूर्ण झाले',
      btnDelete: 'हटवा',
      statusUpdatedToast: 'तक्रारीची स्थिती यशस्वीरीत्या अद्ययावत केली',
      reportDeletedToast: 'तक्रार यादीतून हटवली',
      noReportsFound: 'निवडलेल्या निकषात कोणतीही तक्रार आढळली नाही.',
      tabReports: 'धोका तक्रारी',
      tabUsers: 'नोंदणीकृत नागरिक',
      usersDirectoryTitle: 'नोंदणीकृत नागरिक आणि वापरकर्ते',
      usersDirectorySubtitle: 'सर्व पडताळणी झालेले नागरिक, शहर केंद्र आणि प्रशासन खात्यांची सूची',
      userNameCol: 'नागरिक / नाव',
      userEmailCol: 'ईमेल पत्ता',
      userCityCol: 'शहर केंद्र',
      userRoleCol: 'भूमिका',
      userRegisteredCol: 'नोंदणी वेळ',
      userActionsCol: 'कृती',
      noUsersFound: 'शोध निकषानुसार कोणताही वापरकर्ता आढळला नाही.',
      searchUsersPlaceholder: 'नाव, ईमेल किंवा शहराने नागरिक शोधा...',
      deleteUserConfirm: 'तुम्हाला खात्री आहे का की हे खाते हटवायचे आहे?',
      userDeletedToast: 'वापरकर्ता खाते डेटाबेसमधून हटवले गेले',
    },
    auth: {
      title: 'बायोकॅनॉपी हवामान पोर्टल',
      subtitle: 'सावलीचे मार्ग, तक्रार नोंदणी आणि पर्यावरण माहिती पाहण्यासाठी प्रवेश करा.',
      tabSignIn: 'लॉग इन',
      tabCreateAccount: 'नवीन खाते तयार करा',
      fullName: 'पूर्ण नाव',
      emailAddress: 'ईमेल पत्ता',
      password: 'पासवर्ड',
      assignedCity: 'शहर निवडा',
      selectCityPlaceholder: 'आपले मुख्य शहर निवडा',
      btnSignIn: 'बायोकॅनॉपीमध्ये लॉग इन करा',
      btnCreateAccount: 'नवीन खाते तयार करा',
      demoCitizen: 'नागरिक डेमो लॉग इन',
      demoAdmin: 'प्रशासक डेमो लॉग इन',
      signingIn: 'प्रवेश करत आहे...',
      signInWithGoogle: 'गुगलद्वारे साइन इन करा',
      orDivider: 'किंवा',
      welcomeEmailSent: 'स्वागत ईमेल पाठवला गेला:',
      emailSentNotice: 'आपल्या इनबॉक्समध्ये पुष्टीकरण ईमेल पाठवला आहे.',
      emailSubject: '🌿 बायोकॅनॉपीमध्ये आपले स्वागत आहे — यशस्वी साइन इन',
      googleModalTitle: 'गुगलद्वारे साइन इन करा',
      googleModalDesc: 'बायोकॅनॉपी सावलीचे मार्ग आणि हवा माहितीसाठी आपले गुगल खाते निवडा.',
      continueGoogleBtn: 'गुगलसह पुढे जा',
    },
    profile: {
      title: 'नागरिक प्रोफाइल',
      subtitle: 'खाते तपशील, आपल्या नोंदवलेल्या तक्रारी आणि भेट दिलेले सावलीचे मार्ग',
      tabAccount: 'खाते माहिती',
      tabReports: 'माझ्या तक्रारी',
      tabRoutes: 'मार्ग इतिहास',
      nameLabel: 'पूर्ण नाव',
      emailLabel: 'ईमेल पत्ता',
      passwordLabel: 'खाते पासवर्ड',
      showPassword: 'पहा',
      hidePassword: 'लपवा',
      roleLabel: 'वापरकर्ता भूमिका',
      memberSince: 'नोंदणी दिनांक',
      noReportsTitle: 'कोणतीही तक्रार नोंदवलेली नाही',
      noReportsDesc: 'तुम्ही अद्याप कोणतीही धोका किंवा समस्या नोंदवलेली नाही. तीव्र उन्हाचे ठिकाण किंवा धूर नोंदवण्यासाठी "धोका नोंदवा" वापरा.',
      reportedHazardsCount: 'नागरिक तक्रारी नोंदवल्या',
      noRoutesTitle: 'कोणताही मार्ग इतिहास नाही',
      noRoutesDesc: 'तुम्ही अद्याप कोणताही मार्ग वापरलेला नाही. सावलीच्या मार्गांची नोंद ठेवण्यासाठी कूल-रूट नकाशावर नेव्हिगेशन सुरू करा.',
      visitedRoutesCount: 'सावलीचे मार्ग वापरले',
      shadedCoverage: 'सावलीचे प्रमाण',
      heatAvoided: 'उष्णतेत घट',
      closeBtn: 'प्रोफाइल बंद करा',
      status: 'स्थिती',
      completed: 'पूर्ण झाले',
      mins: 'मिनिटे',
      km: 'किमी',
      cityLabel: 'शहर केंद्र',
      editBtn: 'बदला',
      saveBtn: 'जतन करा',
      cancelBtn: 'रद्द करा',
      editPassword: 'पासवर्ड बदला',
      editCity: 'शहर बदला',
      passwordUpdated: 'पासवर्ड यशस्वीरीत्या बदलला!',
      cityUpdated: 'शहर यशस्वीरीत्या बदलले!',
      passwordMinLength: 'पासवर्ड किमान ६ अक्षरांचा असावा',
      newPasswordPlaceholder: 'नवीन पासवर्ड टाका (किमान ६ अक्षरे)',
      readOnlyBadge: 'केवळ वाचनासाठी',
    },
  },
};

export function getTranslation(lang: Language): TranslationDictionary {
  return translations[lang] || translations.en;
}
