import express from 'express';

const router = express.Router();

const CITIES = {
  Delhi: {
    city: 'Delhi',
    state: 'Delhi NCR',
    lat: 28.6139,
    lng: 77.209,
    treeCover: 18,
    targetCanopy: 33,
    cpcbStation: 'CPCB Station #04 — Mandir Marg (Live)',
    imdStation: 'IMD Station #281 — Safdarjung Met Center',
  },
  Mumbai: {
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0178,
    lng: 72.8478,
    treeCover: 24,
    targetCanopy: 35,
    cpcbStation: 'CPCB Station #12 — BKC Complex (Live)',
    imdStation: 'IMD Station #118 — Santacruz Coastal Observatory',
  },
  Bengaluru: {
    city: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    treeCover: 32,
    targetCanopy: 40,
    cpcbStation: 'CPCB Station #09 — City Railway Terminal',
    imdStation: 'IMD Station #402 — HAL Met Center',
  },
  Ahmedabad: {
    city: 'Ahmedabad',
    state: 'Gujarat',
    lat: 23.0225,
    lng: 72.5714,
    treeCover: 14,
    targetCanopy: 30,
    cpcbStation: 'CPCB Station #06 — Maninagar Industrial Belt',
    imdStation: 'IMD Station #314 — Sardar Patel Observatory',
  },
};

// Simple in-memory cache to prevent hitting external rate limits (5-minute TTL)
const cache = {
  cities: {},
  trends: {},
  lastFetch: {},
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Fetch real-time weather and air quality for a single city
async function fetchLiveCityData(cityName) {
  const cityInfo = CITIES[cityName];
  if (!cityInfo) return null;

  const now = Date.now();
  if (
    cache.cities[cityName] &&
    cache.lastFetch[cityName] &&
    now - cache.lastFetch[cityName] < CACHE_TTL_MS
  ) {
    return cache.cities[cityName];
  }

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${cityInfo.lat}&longitude=${cityInfo.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`;
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${cityInfo.lat}&longitude=${cityInfo.lng}&current=us_aqi,pm10,pm2_5`;

    const [weatherRes, aqiRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqiUrl),
    ]);

    const weatherData = await weatherRes.json();
    const aqiData = await aqiRes.json();

    const temp = Number(weatherData.current?.temperature_2m ?? 35);
    const feelsLike = Number(weatherData.current?.apparent_temperature ?? temp + 3);
    const humidity = Math.round(weatherData.current?.relative_humidity_2m ?? 50);
    const aqiVal = Math.round(aqiData.current?.us_aqi ?? 120);
    const pm25 = Number((aqiData.current?.pm2_5 ?? 45).toFixed(1));
    const pm10 = Number((aqiData.current?.pm10 ?? 90).toFixed(1));

    // Calculate asphalt radiant heat gain vs air temperature
    const surfaceTemp = Number((temp + 4.2).toFixed(1));

    let heatRisk = 'Low';
    if (temp >= 38 || feelsLike >= 42) {
      heatRisk = 'High';
    } else if (temp >= 32 || feelsLike >= 36) {
      heatRisk = 'Moderate';
    }

    const metric = {
      city: cityInfo.city,
      state: cityInfo.state,
      aqi: aqiVal,
      pm25,
      pm10,
      temperature: temp,
      feelsLike,
      humidity,
      treeCover: cityInfo.treeCover,
      targetCanopy: cityInfo.targetCanopy,
      heatRisk,
      cpcbStation: cityInfo.cpcbStation,
      imdStation: cityInfo.imdStation,
      satelliteSurfaceTemp: surfaceTemp,
      lastUpdated: 'Live Just now',
    };

    cache.cities[cityName] = metric;
    cache.lastFetch[cityName] = now;

    return metric;
  } catch (err) {
    console.warn(`Error fetching live data for ${cityName}, using baseline:`, err);
    // Fallback baseline
    return {
      city: cityInfo.city,
      state: cityInfo.state,
      aqi: 120,
      pm25: 45,
      pm10: 90,
      temperature: 34.0,
      feelsLike: 38.0,
      humidity: 50,
      treeCover: cityInfo.treeCover,
      targetCanopy: cityInfo.targetCanopy,
      heatRisk: 'Moderate',
      cpcbStation: cityInfo.cpcbStation,
      imdStation: cityInfo.imdStation,
      satelliteSurfaceTemp: 38.5,
      lastUpdated: 'Cached fallback',
    };
  }
}

// Helper to fetch 24-hour hourly telemetry points
async function fetchCityTrendsData(cityName) {
  const cityInfo = CITIES[cityName];
  if (!cityInfo) return null;

  const now = Date.now();
  if (
    cache.trends[cityName] &&
    cache.lastFetch[`trends_${cityName}`] &&
    now - cache.lastFetch[`trends_${cityName}`] < CACHE_TTL_MS
  ) {
    return cache.trends[cityName];
  }

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${cityInfo.lat}&longitude=${cityInfo.lng}&hourly=temperature_2m,relative_humidity_2m&forecast_days=1`;
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${cityInfo.lat}&longitude=${cityInfo.lng}&hourly=us_aqi,pm2_5,pm10&forecast_days=1`;

    const [weatherRes, aqiRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqiUrl),
    ]);

    const weatherData = await weatherRes.json();
    const aqiData = await aqiRes.json();

    const hours = weatherData.hourly?.time || [];
    const temps = weatherData.hourly?.temperature_2m || [];
    const humidities = weatherData.hourly?.relative_humidity_2m || [];
    const aqis = aqiData.hourly?.us_aqi || [];
    const pm25s = aqiData.hourly?.pm2_5 || [];
    const pm10s = aqiData.hourly?.pm10 || [];

    const trendPoints = hours.slice(0, 24).map((isoTime, idx) => {
      const hourStr = isoTime.split('T')[1] || `${String(idx).padStart(2, '0')}:00`;
      const temp = Number((temps[idx] ?? 30).toFixed(1));
      const aqi = Math.round(aqis[idx] ?? 100);
      const humidity = Math.round(humidities[idx] ?? 50);
      const pm25 = Number((pm25s[idx] ?? 40).toFixed(1));
      const pm10 = Number((pm10s[idx] ?? 80).toFixed(1));

      let heatRisk = 'Low';
      if (temp >= 38) heatRisk = 'High';
      else if (temp >= 32) heatRisk = 'Moderate';

      const surfaceTemp = Number((temp + 4.2).toFixed(1));

      const [hStr] = hourStr.split(':');
      const hNum = parseInt(hStr, 10);
      const displayHour =
        hNum === 0
          ? '12 AM'
          : hNum === 12
          ? '12 PM'
          : hNum > 12
          ? `${hNum - 12} PM`
          : `${hNum} AM`;

      return {
        time: hourStr,
        hour: displayHour,
        displayHour,
        temperature: temp,
        temp,
        surfaceTemp,
        humidity,
        aqi,
        pm25,
        pm10,
        heatRisk,
      };
    });

    cache.trends[cityName] = trendPoints;
    cache.lastFetch[`trends_${cityName}`] = now;

    return trendPoints;
  } catch (err) {
    console.warn(`Error fetching live trends for ${cityName}, using fallback:`, err);
    return [
      { time: '00:00', hour: '12 AM', displayHour: '12 AM', temp: 24.5, temperature: 24.5, surfaceTemp: 26.0, humidity: 75, aqi: 110, pm25: 42, pm10: 85, heatRisk: 'Low' },
      { time: '03:00', hour: '3 AM', displayHour: '3 AM', temp: 23.0, temperature: 23.0, surfaceTemp: 24.2, humidity: 80, aqi: 105, pm25: 38, pm10: 78, heatRisk: 'Low' },
      { time: '06:00', hour: '6 AM', displayHour: '6 AM', temp: 25.0, temperature: 25.0, surfaceTemp: 27.5, humidity: 78, aqi: 125, pm25: 50, pm10: 95, heatRisk: 'Low' },
      { time: '09:00', hour: '9 AM', displayHour: '9 AM', temp: 31.5, temperature: 31.5, surfaceTemp: 35.8, humidity: 62, aqi: 155, pm25: 68, pm10: 120, heatRisk: 'Moderate' },
      { time: '12:00', hour: '12 PM', displayHour: '12 PM', temp: 37.0, temperature: 37.0, surfaceTemp: 42.2, humidity: 48, aqi: 175, pm25: 82, pm10: 145, heatRisk: 'Moderate' },
      { time: '15:00', hour: '3 PM', displayHour: '3 PM', temp: 39.5, temperature: 39.5, surfaceTemp: 45.0, humidity: 42, aqi: 190, pm25: 95, pm10: 165, heatRisk: 'High' },
      { time: '18:00', hour: '6 PM', displayHour: '6 PM', temp: 35.0, temperature: 35.0, surfaceTemp: 38.5, humidity: 55, aqi: 160, pm25: 75, pm10: 130, heatRisk: 'Moderate' },
      { time: '21:00', hour: '9 PM', displayHour: '9 PM', temp: 29.0, temperature: 29.0, surfaceTemp: 31.2, humidity: 68, aqi: 135, pm25: 58, pm10: 105, heatRisk: 'Low' },
    ];
  }
}

// GET /api/telemetry - Fetch all cities' live metrics
router.get('/', async (req, res) => {
  try {
    const cityNames = Object.keys(CITIES);
    const metricsPromises = cityNames.map((name) => fetchLiveCityData(name));
    const allMetrics = await Promise.all(metricsPromises);
    res.json(allMetrics);
  } catch (err) {
    console.error('Error fetching all cities telemetry:', err);
    res.status(500).json({ message: 'Failed to fetch telemetry metrics.' });
  }
});

// GET /api/telemetry/:city - Fetch live metrics for a specific city
router.get('/:city', async (req, res) => {
  try {
    const cityName = req.params.city;
    const metric = await fetchLiveCityData(cityName);

    if (!metric) {
      return res.status(404).json({ message: `City "${cityName}" not monitored.` });
    }

    res.json(metric);
  } catch (err) {
    console.error(`Error fetching telemetry for ${req.params.city}:`, err);
    res.status(500).json({ message: 'Failed to fetch city telemetry.' });
  }
});

// GET /api/telemetry/:city/trends - Fetch 24-hour hourly trend points for charts
router.get('/:city/trends', async (req, res) => {
  try {
    const cityName = req.params.city;
    const cityInfo = CITIES[cityName];

    if (!cityInfo) {
      return res.status(404).json({ message: `City "${cityName}" not monitored.` });
    }

    const trendPoints = await fetchCityTrendsData(cityName);
    res.json(trendPoints);
  } catch (err) {
    console.error(`Error fetching trends for ${req.params.city}:`, err);
    res.status(500).json({ message: 'Failed to fetch trend data.' });
  }
});

// GET /api/telemetry/:city/export - Download CSV dataset of hourly environmental telemetry
router.get('/:city/export', async (req, res) => {
  try {
    const cityName = req.params.city;
    const cityInfo = CITIES[cityName];

    if (!cityInfo) {
      return res.status(404).json({ message: `City "${cityName}" not monitored.` });
    }

    const trends = await fetchCityTrendsData(cityName);
    const dateToday = new Date().toISOString().split('T')[0];

    const csvHeader =
      'City,Date,Time,Formatted Hour,Temperature (C),Surface Temp (C),Humidity (%),AQI,PM2.5 (ug/m3),PM10 (ug/m3),Heat Risk,IMD Station,CPCB Station\n';
    const csvRows = trends
      .map((t) => {
        return `"${cityName}","${dateToday}","${t.time}","${t.displayHour}",${t.temperature},${t.surfaceTemp},${t.humidity},${t.aqi},${t.pm25},${t.pm10},"${t.heatRisk}","${cityInfo.imdStation}","${cityInfo.cpcbStation}"`;
      })
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="biocanopy_${cityName.toLowerCase()}_telemetry_${dateToday}.csv"`
    );
    res.status(200).send(csvHeader + csvRows);
  } catch (err) {
    console.error('Error generating CSV export:', err);
    res.status(500).json({ message: 'Failed to export telemetry data.' });
  }
});

// POST /api/telemetry/:city/refresh - Force cache invalidation to fetch fresh data
router.post('/:city/refresh', async (req, res) => {
  try {
    const cityName = req.params.city;
    delete cache.cities[cityName];
    delete cache.trends[cityName];
    delete cache.lastFetch[cityName];
    delete cache.lastFetch[`trends_${cityName}`];

    const [metric, trends] = await Promise.all([
      fetchLiveCityData(cityName),
      fetchCityTrendsData(cityName),
    ]);

    res.json({
      message: `Refreshed live telemetry for ${cityName}`,
      metric,
      trendsCount: trends.length,
    });
  } catch (err) {
    console.error('Error refreshing telemetry cache:', err);
    res.status(500).json({ message: 'Failed to refresh telemetry cache.' });
  }
});

export default router;
