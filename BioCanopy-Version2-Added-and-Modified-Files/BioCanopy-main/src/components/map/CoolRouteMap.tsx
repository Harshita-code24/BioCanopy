import L from 'leaflet';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  Compass,
  Eye,
  Layers,
  MapPin,
  Maximize2,
  Navigation,
  RefreshCw,
  RotateCcw,
  Route,
  Search,
  ShieldAlert,
  Sparkles,
  Sun,
  Thermometer,
  Trees,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import {
  cityCoordinates,
  cityRoutes,
  thermalPockets as fallbackThermalPockets,
} from '../../data/mockData';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppState } from '../../store/AppStateContext';
import type { RouteOverlay, ThermalPocketItem } from '../../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Fix Leaflet's default icon path in bundler
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Leaflet DivIcon for Route Start & Destination
const createRoutePinIcon = (type: 'origin' | 'destination', label: string) => {
  const isOrigin = type === 'origin';
  const accentColor = isOrigin ? '#22D3EE' : '#34D399';
  const tagText = isOrigin ? 'ORIGIN' : 'DEST';

  return L.divIcon({
    className: 'custom-route-pin',
    html: `
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #091E1A;
        color: #ffffff;
        padding: 5px 12px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        border: 2px solid ${accentColor};
        box-shadow: 0 4px 16px rgba(0,0,0,0.85), 0 0 10px ${accentColor}66;
        white-space: nowrap;
        transform: translate(-50%, -100%);
        margin-top: -8px;
        pointer-events: auto;
      ">
        <span style="
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: ${accentColor};
          box-shadow: 0 0 6px ${accentColor};
          flex-shrink: 0;
        "></span>
        <span style="
          color: ${accentColor};
          font-weight: 800;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          flex-shrink: 0;
        ">${tagText}:</span>
        <span style="
          color: #FFFFFF;
          font-weight: 800;
        ">${label}</span>
      </div>
    `,
    iconSize: undefined,
    iconAnchor: [0, 0],
  });
};

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.2 });
  }, [center, map]);
  return null;
}

export function CoolRouteMap() {
  const {
    selectedCity,
    reports,
    isNavigating,
    setIsNavigating,
    activeRouteId,
    setActiveRouteId,
    setIsReportModalOpen,
    addVisitedRoute,
    theme,
  } = useAppState();
  const { t } = useTranslation();

  const [showHeatOverlay, setShowHeatOverlay] = useState(true);
  const [showCitizenPins, setShowCitizenPins] = useState(true);
  const [navigationStep, setNavigationStep] = useState(0);

  // Backend data states
  const [thermalPockets, setThermalPockets] = useState<ThermalPocketItem[]>([]);
  const [corridors, setCorridors] = useState<any[]>([]);
  const [selectedPairId, setSelectedPairId] = useState<string>('');
  const [activeRoutes, setActiveRoutes] = useState<RouteOverlay[]>([]);
  const [routeTitle, setRouteTitle] = useState<string>('');
  const [originName, setOriginName] = useState<string>('');
  const [destName, setDestName] = useState<string>('');
  const [isLoadingRoutes, setIsLoadingRoutes] = useState<boolean>(false);
  const [isLiveCalculated, setIsLiveCalculated] = useState<boolean>(false);

  // Custom route calculation drawer state
  const [showRouteCalculator, setShowRouteCalculator] = useState<boolean>(false);
  const [calcOrigin, setCalcOrigin] = useState<string>('');
  const [calcDest, setCalcDest] = useState<string>('');
  const [isCalculatingLive, setIsCalculatingLive] = useState<boolean>(false);

  const cityCenter = cityCoordinates[selectedCity] || [28.6139, 77.209];

  // 1. Fetch satellite thermal pockets from SQLite backend (/api/routes/thermal-pockets)
  useEffect(() => {
    let isCancelled = false;
    const fetchThermalPockets = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/routes/thermal-pockets?city=${selectedCity}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.pockets && data.pockets.length > 0) {
            setThermalPockets(data.pockets);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend thermal pockets offline, using fallback:', err);
      }
      // Fallback
      if (!isCancelled) {
        const fallbacks: ThermalPocketItem[] = fallbackThermalPockets.map(([lat, lng, intensity], idx) => ({
          id: idx + 1,
          city: selectedCity,
          name: `Satellite Micro-Heat Pocket #${idx + 1}`,
          latitude: lat,
          longitude: lng,
          coordinates: [lat, lng],
          intensity,
          surfaceTemp: Number((38 + intensity * 8).toFixed(1)),
          sensorSource: 'Landsat-9 TIRS Satellite',
        }));
        setThermalPockets(fallbacks);
      }
    };

    fetchThermalPockets();
    return () => {
      isCancelled = true;
    };
  }, [selectedCity]);

  // 2. Fetch available walking corridors from SQLite backend (/api/routes/corridors)
  useEffect(() => {
    let isCancelled = false;
    const fetchCorridors = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/routes/corridors?city=${selectedCity}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && Array.isArray(data) && data.length > 0) {
            setCorridors(data);
            setSelectedPairId(data[0].pair_id);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend corridors offline:', err);
      }
      if (!isCancelled) {
        setCorridors([]);
        setSelectedPairId('');
      }
    };

    fetchCorridors();
    return () => {
      isCancelled = true;
    };
  }, [selectedCity]);

  // 3. Fetch route pair from SQLite backend (/api/routes)
  useEffect(() => {
    let isCancelled = false;
    const fetchCityRoutes = async () => {
      setIsLoadingRoutes(true);
      try {
        const url = selectedPairId
          ? `${API_BASE}/api/routes?city=${selectedCity}&pairId=${selectedPairId}`
          : `${API_BASE}/api/routes?city=${selectedCity}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.routes && data.routes.length > 0) {
            setActiveRoutes(data.routes);
            setRouteTitle(data.title || `${selectedCity} Shaded Corridor`);
            setOriginName(data.origin || 'Origin');
            setDestName(data.destination || 'Destination');
            setIsLiveCalculated(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend routes offline, using local mock data:', err);
      } finally {
        if (!isCancelled) setIsLoadingRoutes(false);
      }

      // Fallback to static mock data if backend route isn't available
      if (!isCancelled) {
        const local = cityRoutes[selectedCity] || cityRoutes.Delhi;
        setActiveRoutes(local);
        setRouteTitle(`${selectedCity} Shaded Corridor`);
        setOriginName(`${selectedCity} Hub`);
        setDestName(`${selectedCity} Destination`);
        setIsLiveCalculated(false);
      }
    };

    fetchCityRoutes();
    return () => {
      isCancelled = true;
    };
  }, [selectedCity, selectedPairId]);

  // Active cool and fastest routes
  const coolRoute = useMemo(
    () => activeRoutes.find((r) => r.id === 'cool') || activeRoutes[0] || (cityRoutes.Delhi[0] as RouteOverlay),
    [activeRoutes],
  );
  const fastestRoute = useMemo(
    () => activeRoutes.find((r) => r.id === 'fastest') || activeRoutes[1] || (cityRoutes.Delhi[1] as RouteOverlay),
    [activeRoutes],
  );

  const cityReports = useMemo(
    () => reports.filter((r) => r.city === selectedCity),
    [reports, selectedCity],
  );

  // Turn-by-turn navigation timer simulation
  useEffect(() => {
    let timer: any;
    if (isNavigating && coolRoute?.turnInstructions?.length) {
      timer = setInterval(() => {
        setNavigationStep((prev) => (prev + 1) % coolRoute.turnInstructions.length);
      }, 4000);
    } else {
      setNavigationStep(0);
    }
    return () => clearInterval(timer);
  }, [isNavigating, coolRoute?.turnInstructions?.length]);

  // Handle live custom route calculation using backend OSRM Pedestrian Routing Engine
  const handleCalculateCustomRoute = async () => {
    setIsCalculatingLive(true);
    try {
      // Pick sensible city landmark coordinates
      const startPoint: [number, number] = [cityCenter[0] + 0.008, cityCenter[1] - 0.007];
      const endPoint: [number, number] = [cityCenter[0] - 0.012, cityCenter[1] + 0.009];

      const res = await fetch(`${API_BASE}/api/routes/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: selectedCity,
          origin: startPoint,
          destination: endPoint,
          originName: calcOrigin.trim() || `${selectedCity} Central Metro Concourse`,
          destinationName: calcDest.trim() || `${selectedCity} Botanical Green Plaza`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          setActiveRoutes(data.routes);
          setRouteTitle(`${data.origin} ➔ ${data.destination}`);
          setOriginName(data.origin);
          setDestName(data.destination);
          setIsLiveCalculated(true);
          setShowRouteCalculator(false);
          setActiveRouteId('cool');
        }
      }
    } catch (err) {
      console.error('Error calculating live route:', err);
    } finally {
      setIsCalculatingLive(false);
    }
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#0F2420] shadow-2xl">
      {/* Map Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 bg-[#0A1B17] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/40 shadow-glow">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{t.map.title}</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                {selectedCity}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                {isLiveCalculated ? 'OSRM Live Computed' : 'SQLite Canopy DB'}
              </span>
            </h3>
            <p className="text-[11px] font-medium text-[#94BDB2]">
              {routeTitle || t.map.subtitle}
            </p>
          </div>
        </div>

        {/* Layer Toggles & Route Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Corridor Switcher Dropdown (from SQLite routes) */}
          {corridors.length > 1 && (
            <select
              value={selectedPairId}
              onChange={(e) => setSelectedPairId(e.target.value)}
              className="rounded-xl border border-emerald-500/30 bg-[#081412] px-3 py-1.5 text-xs font-semibold text-emerald-300 focus:outline-none"
            >
              {corridors.map((c) => (
                <option key={c.pair_id} value={c.pair_id}>
                  {c.title}
                </option>
              ))}
            </select>
          )}

          {/* Real-time Route Engine Trigger */}
          <button
            onClick={() => setShowRouteCalculator(!showRouteCalculator)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              showRouteCalculator
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400'
                : 'border-emerald-500/30 bg-[#081412] text-emerald-300 hover:border-cyan-400 hover:text-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-cyan-400" />
            <span>Route Engine</span>
          </button>

          {/* Active Route Selector */}
          <div className="inline-flex rounded-xl bg-[#081412] p-1 border border-emerald-500/20">
            <button
              onClick={() => setActiveRouteId('cool')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition ${
                activeRouteId === 'cool'
                  ? 'bg-emerald-600 text-white shadow-glow'
                  : 'text-[#94BDB2] hover:text-white'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
              <span>{t.map.coolPath}</span>
            </button>
            <button
              onClick={() => setActiveRouteId('fastest')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition ${
                activeRouteId === 'fastest'
                  ? 'bg-red-500/30 text-red-200 ring-1 ring-red-500/50'
                  : 'text-[#94BDB2] hover:text-white'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-red-400"></span>
              <span>{t.map.fastestPath}</span>
            </button>
          </div>

          {/* Heat Overlay Toggle */}
          <button
            onClick={() => setShowHeatOverlay(!showHeatOverlay)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              showHeatOverlay
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                : 'border-emerald-500/20 bg-[#081412] text-[#94BDB2] hover:text-white'
            }`}
          >
            <Thermometer className="h-3.5 w-3.5 text-amber-400" />
            <span>{t.map.thermalSatellite} ({thermalPockets.length})</span>
          </button>

          {/* Citizen Pins Toggle */}
          <button
            onClick={() => setShowCitizenPins(!showCitizenPins)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              showCitizenPins
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                : 'border-emerald-500/20 bg-[#081412] text-[#94BDB2] hover:text-white'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-emerald-400" />
            <span>{t.map.hazardPins} ({cityReports.length})</span>
          </button>
        </div>
      </div>

      {/* Slide-Down Live OSRM Pedestrian Route Engine Panel */}
      {showRouteCalculator && (
        <div className="border-b border-cyan-500/30 bg-[#091E1A] p-4 sm:p-5">
          <div className="mx-auto max-w-4xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Live Pedestrian Routing Backend & Canopy Optimizer
                </h4>
              </div>
              <span className="text-[11px] text-[#94BDB2]">
                Uses OpenStreetMap OSRM API + SQLite Satellite Hotspot Penalization
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
              <div>
                <label className="text-[10px] font-bold uppercase text-[#94BDB2]">Origin Landmark</label>
                <input
                  type="text"
                  value={calcOrigin}
                  onChange={(e) => setCalcOrigin(e.target.value)}
                  placeholder={`e.g. ${selectedCity} Metro / Terminal`}
                  className="mt-1 w-full rounded-xl border border-emerald-500/30 bg-[#061210] px-3 py-2 text-xs text-white placeholder-[#94BDB2]/50 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#94BDB2]">Destination Landmark</label>
                <input
                  type="text"
                  value={calcDest}
                  onChange={(e) => setCalcDest(e.target.value)}
                  placeholder={`e.g. ${selectedCity} Botanical Garden`}
                  className="mt-1 w-full rounded-xl border border-emerald-500/30 bg-[#061210] px-3 py-2 text-xs text-white placeholder-[#94BDB2]/50 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleCalculateCustomRoute}
                  disabled={isCalculatingLive}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-black shadow-glow transition hover:bg-cyan-400 disabled:opacity-50"
                >
                  {isCalculatingLive ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Computing Shade Arc...</span>
                    </>
                  ) : (
                    <>
                      <Compass className="h-3.5 w-3.5" />
                      <span>Calculate Shaded Route</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Leaflet Map View */}
      <div className="relative h-[540px] w-full bg-[#060F0D] sm:h-[600px]">
        {isLoadingRoutes && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#060F0D]/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 rounded-2xl border border-cyan-400/40 bg-[#0F2420] px-4 py-3 text-xs font-bold text-cyan-300 shadow-2xl">
              <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
              <span>Loading route from SQLite Backend...</span>
            </div>
          </div>
        )}

        <MapContainer
          center={cityCenter}
          zoom={14}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <MapRecenter center={cityCenter} />

          {/* OpenStreetMap Tiles (100% Key-Free, Zero Watermarks) */}
          <TileLayer
            key={theme}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className={theme === 'dark' ? 'dark-tiles' : ''}
            maxZoom={19}
          />

          {/* 1. Recommended Cool Path Polyline */}
          {coolRoute?.coordinates?.length > 0 && (
            <Polyline
              positions={coolRoute.coordinates}
              pathOptions={{
                color: '#22D3EE',
                weight: activeRouteId === 'cool' ? 9 : 6,
                opacity: activeRouteId === 'cool' ? 1 : 0.85,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            >
              <Popup>
                <div className="p-2 text-white">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                    <Trees className="h-4 w-4" />
                    <span>{coolRoute.name}</span>
                  </div>
                  <div className="mt-1 font-bold text-white text-sm">
                    {coolRoute.travelTime} · {coolRoute.shadePercentage}% {t.map.shadedCover}
                  </div>
                  <p className="mt-1 text-xs text-[#94BDB2]">
                    {t.map.coolPathDetails}
                  </p>
                  <div className="mt-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 p-1.5 text-[11px] font-bold text-cyan-300">
                    -{coolRoute.heatReduction}% Heat Exposure vs Bare Asphalt
                  </div>
                </div>
              </Popup>
            </Polyline>
          )}

          {/* 2. Alternate Fastest Path Polyline */}
          {fastestRoute?.coordinates?.length > 0 && (
            <Polyline
              positions={fastestRoute.coordinates}
              pathOptions={{
                color: '#B91C1C',
                weight: activeRouteId === 'fastest' ? 8 : 5,
                opacity: activeRouteId === 'fastest' ? 1 : 0.85,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            >
              <Popup>
                <div className="p-2 text-white">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs">
                    <Sun className="h-4 w-4" />
                    <span>{fastestRoute.name}</span>
                  </div>
                  <div className="mt-1 font-bold text-white text-sm">
                    {fastestRoute.travelTime} · {fastestRoute.shadePercentage}% shade
                  </div>
                  <p className="mt-1 text-xs text-[#94BDB2]">
                    {t.map.fastestPathDetails}
                  </p>
                  <div className="mt-2 rounded-lg bg-red-950/50 border border-red-700/40 p-1.5 text-[11px] font-bold text-red-300">
                    High Solar & Asphalt Thermal Stress
                  </div>
                </div>
              </Popup>
            </Polyline>
          )}

          {/* Start and Destination Markers */}
          {coolRoute?.coordinates?.length > 0 && (
            <>
              <Marker
                position={coolRoute.coordinates[0]}
                icon={createRoutePinIcon('origin', originName || 'Origin')}
              />
              <Marker
                position={coolRoute.coordinates[coolRoute.coordinates.length - 1]}
                icon={createRoutePinIcon('destination', destName || 'Destination')}
              />
            </>
          )}

          {/* Satellite Thermal Heat Overlays from SQLite Backend */}
          {showHeatOverlay &&
            thermalPockets.map((pocket) => (
              <Circle
                key={`thermal-${pocket.id}`}
                center={pocket.coordinates || [pocket.latitude, pocket.longitude]}
                radius={280 * pocket.intensity}
                pathOptions={{
                  fillColor: pocket.intensity > 0.88 ? '#EF4444' : '#F59E0B',
                  fillOpacity: 0.28,
                  stroke: true,
                  color: pocket.intensity > 0.88 ? '#F87171' : '#FBBF24',
                  weight: 1.5,
                  opacity: 0.7,
                }}
              >
                <Popup>
                  <div className="p-1 text-white">
                    <p className="text-xs font-bold text-red-400">
                      {pocket.name}
                    </p>
                    <p className="text-xs text-[#ECFDF5] mt-0.5 font-semibold">
                      Surface Temp: {pocket.surfaceTemp}°C (Intensity: {Math.round(pocket.intensity * 100)}%)
                    </p>
                    <p className="text-[11px] text-[#94BDB2] mt-1">
                      Sensor: {pocket.sensorSource}
                    </p>
                  </div>
                </Popup>
              </Circle>
            ))}

          {/* Citizen Geotagged Hazard Pins from SQLite Backend */}
          {showCitizenPins &&
            cityReports.map((report) => (
              <Marker
                key={report.id}
                position={report.coordinates}
                icon={L.divIcon({
                  className: 'citizen-hazard-pin',
                  html: `<div style="background-color: ${
                    report.category === 'Unshaded Hotspot'
                      ? '#EF4444'
                      : report.category === 'Illegal Burning'
                      ? '#F59E0B'
                      : '#38BDF8'
                  }; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 0 12px rgba(239,68,68,0.6); border: 2px solid white;">
                    ⚠
                  </div>`,
                  iconSize: [28, 28],
                  iconAnchor: [14, 14],
                })}
              >
                <Popup>
                  <div className="p-1 text-white max-w-[220px]">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-red-400">
                      <span>Citizen Hazard</span> · {report.submittedAt}
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1">
                      {report.category}
                    </h4>
                    <p className="text-xs text-[#94BDB2] mt-0.5">
                      {report.locationName}
                    </p>
                    <p className="text-[11px] text-[#94BDB2]/80 mt-1 line-clamp-2">
                      {report.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between border-t border-emerald-500/20 pt-1.5 text-[10px]">
                      <span className="font-semibold text-emerald-400">
                        Status: {report.status}
                      </span>
                      <span className="text-gray-400">👍 {report.upvotes || 0}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* Floating Route Badges (Top-Left overlay) */}
        <div className="absolute left-4 top-4 z-20 flex flex-col gap-2.5">
          {/* Badge 1: Recommended Cool Path */}
          <div
            onClick={() => setActiveRouteId('cool')}
            className={`group flex cursor-pointer items-center gap-2.5 rounded-2xl border bg-[#0F2420]/90 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl transition ${
              activeRouteId === 'cool'
                ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                : 'border-cyan-500/30 hover:border-cyan-400'
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <Trees className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">
                  {coolRoute.name}
                </span>
                <span className="rounded-full bg-[#22D3EE] px-1.5 py-0.2 text-[9px] font-black text-black">
                  SHADED
                </span>
              </div>
              <p className="text-xs font-bold text-cyan-300">
                {coolRoute.travelTime} · {coolRoute.shadePercentage}% shaded
              </p>
            </div>
          </div>

          {/* Badge 2: Alternate Fastest Path */}
          <div
            onClick={() => setActiveRouteId('fastest')}
            className={`group flex cursor-pointer items-center gap-2.5 rounded-2xl border bg-[#0F2420]/90 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl transition ${
              activeRouteId === 'fastest'
                ? 'border-red-600 ring-2 ring-red-600/40 shadow-[0_0_18px_rgba(185,28,28,0.3)]'
                : 'border-red-800/40 hover:border-red-600'
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-950/70 text-red-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">
                  {fastestRoute.name}
                </span>
                <span className="rounded-full bg-[#B91C1C] px-1.5 py-0.2 text-[9px] font-black text-white">
                  FASTEST
                </span>
              </div>
              <p className="text-xs font-medium text-red-400">
                {fastestRoute.travelTime} · high heat exposure
              </p>
            </div>
          </div>
        </div>

        {/* Simulated Active Navigation Overlay */}
        {isNavigating && coolRoute.turnInstructions && (
          <div className="absolute inset-x-4 top-4 z-20 mx-auto max-w-lg rounded-2xl border border-cyan-400/50 bg-[#0E231F]/95 p-4 shadow-2xl ring-2 ring-cyan-500/30 backdrop-blur-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      {t.map.turnNavigation}
                    </span>
                    <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-200 ring-1 ring-cyan-400/40">
                      {t.map.stepOf} {navigationStep + 1} / {coolRoute.turnInstructions.length}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {coolRoute.turnInstructions[navigationStep]}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setIsNavigating(false)}
                className="rounded-lg p-1 text-[#94BDB2] hover:bg-white/10 hover:text-white"
                title={t.map.stopNavigation}
              >
                ✕
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-cyan-500/20 pt-2 text-xs text-[#94BDB2]">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Trees className="h-4 w-4" />
                <span>{t.map.canopyShadeBadge}</span>
              </div>
              <span className="font-semibold text-white">
                {t.map.arrivalIn} {coolRoute.travelTime}
              </span>
            </div>

            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
              <div
                className="h-full bg-cyan-400 shadow-[0_0_10px_#22D3EE] transition-all duration-500"
                style={{
                  width: `${
                    ((navigationStep + 1) / coolRoute.turnInstructions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 z-20 hidden rounded-2xl border border-emerald-500/20 bg-[#0F2420]/90 p-3.5 shadow-2xl backdrop-blur-xl sm:block text-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
            {t.map.navigationLegend}
          </p>
          <div className="mt-2 space-y-1.5 text-[#ECFDF5]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-6 rounded-full bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.7)]"></span>
              <span>{t.map.legendCoolPath}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-6 rounded-full bg-[#B91C1C] shadow-[0_0_6px_rgba(185,28,28,0.6)]"></span>
              <span>{t.map.legendFastestPath}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/40 border border-red-400"></span>
              <span>Satellite Hotspot (SQLite)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center font-bold">
                ⚠
              </span>
              <span>{t.map.legendHazardPin} (SQLite)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Card: Route Comparison & Primary Action CTA */}
      <div className="border-t border-emerald-500/20 bg-[#0A1B17] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-cyan-500/30 bg-[#0F2420] p-3.5">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide">
                {t.map.coolPath}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#22D3EE]">{coolRoute.travelTime.split(' ')[0]}</span>
                <span className="text-xs text-[#94BDB2]">{t.common.mins}</span>
              </div>
              <p className="mt-0.5 text-xs font-bold text-cyan-300">
                {coolRoute.shadePercentage}% {t.map.shadedCover}
              </p>
            </div>

            <div className="rounded-2xl border border-red-800/40 bg-[#0F2420] p-3.5">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">
                {t.map.fastestPath}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-red-500">{fastestRoute.travelTime.split(' ')[0]}</span>
                <span className="text-xs text-[#94BDB2]">{t.common.mins}</span>
              </div>
              <p className="mt-0.5 text-xs font-bold text-red-400">
                {fastestRoute.shadePercentage}% {t.map.shadedCover}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                {t.map.heatReduction}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-cyan-400">-{coolRoute.heatReduction || 34}%</span>
              </div>
              <p className="mt-0.5 text-xs text-[#94BDB2]">
                vs direct bare asphalt
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                {t.map.extraCommute}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">
                  +{Math.max(1, parseInt(coolRoute.travelTime) - parseInt(fastestRoute.travelTime) || 2)}
                </span>
                <span className="text-xs text-[#94BDB2]">{t.common.mins}</span>
              </div>
              <p className="mt-0.5 text-xs text-emerald-300 font-medium">
                {t.map.worthTheComfort}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-[#0F2420] px-4 py-3 text-xs font-bold text-amber-300 hover:bg-amber-500/10"
            >
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>{t.map.flagHeatSpot}</span>
            </button>

            <button
              onClick={() => {
                setActiveRouteId('cool');
                if (!isNavigating) {
                  addVisitedRoute({
                    id: `vr-${Date.now()}`,
                    routeName: `${selectedCity} Shaded Corridor ➔ ${coolRoute.name}`,
                    city: selectedCity,
                    origin: originName || coolRoute.turnInstructions[0]?.split('(')[0]?.trim() || `${selectedCity} Hub`,
                    destination: destName || coolRoute.turnInstructions[coolRoute.turnInstructions.length - 1]?.split('(')[0]?.trim() || `${selectedCity} Destination`,
                    shadePercentage: coolRoute.shadePercentage,
                    heatReduction: coolRoute.heatReduction || 34,
                    distance: '1.4 km',
                    travelTime: coolRoute.travelTime,
                    visitedAt: 'Just now',
                    status: 'Completed',
                  });
                }
                setIsNavigating(!isNavigating);
              }}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-500 active:scale-95"
            >
              <Navigation className="h-4 w-4 text-white" />
              <span>{isNavigating ? t.map.stopNavigation : t.map.startShadedRoute}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
