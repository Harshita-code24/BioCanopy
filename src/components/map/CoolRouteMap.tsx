import L from 'leaflet';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Eye,
  Layers,
  MapPin,
  Maximize2,
  Navigation,
  RotateCcw,
  ShieldAlert,
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
  cityMetrics,
  cityRoutes,
  thermalPockets,
} from '../../data/mockData';
import { useAppState } from '../../store/AppStateContext';
import type { RouteOverlay } from '../../types';

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
const createRoutePinIcon = (color: string, label: string) =>
  L.divIcon({
    className: 'custom-route-pin',
    html: `<div style="background-color: ${color}; color: #021217; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 800; box-shadow: 0 4px 14px rgba(0,0,0,0.6); white-space: nowrap; border: 2px solid #22D3EE; display: flex; align-items: center; gap: 5px;">
      <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #021217;"></span>
      ${label}
    </div>`,
    iconSize: [100, 30],
    iconAnchor: [50, 15],
  });

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
    theme,
  } = useAppState();

  const [showHeatOverlay, setShowHeatOverlay] = useState(true);
  const [showCitizenPins, setShowCitizenPins] = useState(true);
  const [navigationStep, setNavigationStep] = useState(0);

  const cityCenter = cityCoordinates[selectedCity] || [28.6139, 77.209];
  const routes = cityRoutes[selectedCity] || cityRoutes.Delhi;

  const coolRoute = routes.find((r) => r.id === 'cool') || routes[0];
  const fastestRoute = routes.find((r) => r.id === 'fastest') || routes[1];

  const cityReports = useMemo(
    () => reports.filter((r) => r.city === selectedCity),
    [reports, selectedCity],
  );

  useEffect(() => {
    let timer: any;
    if (isNavigating) {
      timer = setInterval(() => {
        setNavigationStep((prev) => (prev + 1) % coolRoute.turnInstructions.length);
      }, 4000);
    } else {
      setNavigationStep(0);
    }
    return () => clearInterval(timer);
  }, [isNavigating, coolRoute.turnInstructions.length]);

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
              <span>Cool-Route Navigation</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                {selectedCity}
              </span>
            </h3>
            <p className="text-[11px] font-medium text-[#94BDB2]">
              Recommended 82% shaded green corridor vs direct unshaded asphalt
            </p>
          </div>
        </div>

        {/* Layer Toggles & Route Selectors */}
        <div className="flex flex-wrap items-center gap-2">
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
              <span>Cool Path</span>
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
              <span>Fastest Path</span>
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
            <span>Thermal Satellite</span>
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
            <span>Hazard Pins ({cityReports.length})</span>
          </button>
        </div>
      </div>

      {/* Main Leaflet Map View (Dark Cartography) */}
      <div className="relative h-[540px] w-full bg-[#060F0D] sm:h-[600px]">
        <MapContainer
          center={cityCenter}
          zoom={14}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <MapRecenter center={cityCenter} />

          {/* CartoDB Tiles (Dark Matter or Positron Light) */}
          <TileLayer
            key={theme}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={
              theme === 'light'
                ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            }
            maxZoom={19}
          />

          {/* 1. Recommended Cool Path Polyline (Vibrant Light Turquoise Blue) */}
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
                  <span>Recommended Cool Path</span>
                </div>
                <div className="mt-1 font-bold text-white text-sm">
                  14 min · 82% shaded
                </div>
                <p className="mt-1 text-xs text-[#94BDB2]">
                  Dense neem & banyan tree arches lower radiant heat by -34% compared to bare road asphalt.
                </p>
                <div className="mt-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 p-1.5 text-[11px] font-bold text-cyan-300">
                  ✓ Continuous tree canopy protection
                </div>
              </div>
            </Popup>
          </Polyline>

          {/* 2. Alternate Fastest Path Polyline (High-Visibility Solid Dark Red) */}
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
                  <span>Alternate Fastest Path</span>
                </div>
                <div className="mt-1 font-bold text-white text-sm">
                  12 min · high heat exposure
                </div>
                <p className="mt-1 text-xs text-[#94BDB2]">
                  Unshaded concrete overpass with surface temperatures reaching 48°C.
                </p>
                <div className="mt-2 rounded-lg bg-red-950/50 border border-red-700/40 p-1.5 text-[11px] font-bold text-red-300">
                  ⚠ Danger: No pedestrian shade protection
                </div>
              </div>
            </Popup>
          </Polyline>

          {/* Start and Destination Markers */}
          {coolRoute.coordinates.length > 0 && (
            <>
              <Marker
                position={coolRoute.coordinates[0]}
                icon={createRoutePinIcon('#22D3EE', 'Origin')}
              />
              <Marker
                position={coolRoute.coordinates[coolRoute.coordinates.length - 1]}
                icon={createRoutePinIcon('#22D3EE', 'Destination')}
              />
            </>
          )}

          {/* Satellite Thermal Heat Overlays */}
          {showHeatOverlay &&
            thermalPockets.map(([lat, lng, intensity], idx) => (
              <Circle
                key={`thermal-${idx}`}
                center={[lat, lng]}
                radius={300 * intensity}
                pathOptions={{
                  fillColor: intensity > 0.85 ? '#EF4444' : '#F59E0B',
                  fillOpacity: 0.28,
                  stroke: true,
                  color: intensity > 0.85 ? '#F87171' : '#FBBF24',
                  weight: 1.5,
                  opacity: 0.7,
                }}
              >
                <Popup>
                  <div className="p-1 text-white">
                    <p className="text-xs font-bold text-red-400">
                      Satellite Micro-Heat Pocket
                    </p>
                    <p className="text-xs text-[#ECFDF5] mt-0.5 font-semibold">
                      Surface Temp: {(38 + intensity * 8).toFixed(1)}°C
                    </p>
                    <p className="text-[11px] text-[#94BDB2] mt-1">
                      Landsat-9 Thermal Infrared Sensor (TIRS)
                    </p>
                  </div>
                </Popup>
              </Circle>
            ))}

          {/* Citizen Geotagged Hazard Pins */}
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
          {/* Badge 1: Recommended Cool Path (Light Turquoise Blue) */}
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
                14 min · 82% shaded
              </p>
            </div>
          </div>

          {/* Badge 2: Alternate Fastest Path (Dark Red) */}
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
                12 min · high heat exposure
              </p>
            </div>
          </div>
        </div>

        {/* Simulated Active Navigation Overlay */}
        {isNavigating && (
          <div className="absolute inset-x-4 top-4 z-20 mx-auto max-w-lg rounded-2xl border border-cyan-400/50 bg-[#0E231F]/95 p-4 shadow-2xl ring-2 ring-cyan-500/30 backdrop-blur-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      Live Cool Guidance Active
                    </span>
                    <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-200 ring-1 ring-cyan-400/40">
                      Step {navigationStep + 1} of {coolRoute.turnInstructions.length}
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
                title="Stop Navigation"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-cyan-500/20 pt-2 text-xs text-[#94BDB2]">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Trees className="h-4 w-4" />
                <span>+82% Tree Canopy Shade</span>
              </div>
              <span className="font-semibold text-white">
                Arrival in ~14 mins
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

        {/* Map Legend (Bottom-Right overlay) */}
        <div className="absolute bottom-4 right-4 z-20 hidden rounded-2xl border border-emerald-500/20 bg-[#0F2420]/90 p-3.5 shadow-2xl backdrop-blur-xl sm:block text-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
            Navigation Legend
          </p>
          <div className="mt-2 space-y-1.5 text-[#ECFDF5]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-6 rounded-full bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.7)]"></span>
              <span>Recommended Cool Path (Light Turquoise)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-6 rounded-full bg-[#B91C1C] shadow-[0_0_6px_rgba(185,28,28,0.6)]"></span>
              <span>Fastest Path (Dark Red)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/40 border border-red-400"></span>
              <span>Thermal Satellite Hotspot (42°C+)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center font-bold">
                ⚠
              </span>
              <span>Citizen Hazard Pin</span>
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
                Cool Path
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#22D3EE]">14</span>
                <span className="text-xs text-[#94BDB2]">mins</span>
              </div>
              <p className="mt-0.5 text-xs font-bold text-cyan-300">
                82% Shaded Cover
              </p>
            </div>

            <div className="rounded-2xl border border-red-800/40 bg-[#0F2420] p-3.5">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">
                Fastest Path
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-red-500">12</span>
                <span className="text-xs text-[#94BDB2]">mins</span>
              </div>
              <p className="mt-0.5 text-xs font-bold text-red-400">
                High Heat Exposure
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                Heat Reduction
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-cyan-400">-34%</span>
              </div>
              <p className="mt-0.5 text-xs text-[#94BDB2]">
                vs direct bare asphalt
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                Extra Commute
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">+2</span>
                <span className="text-xs text-[#94BDB2]">mins</span>
              </div>
              <p className="mt-0.5 text-xs text-emerald-300 font-medium">
                Worth the comfort
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-[#0F2420] px-4 py-3 text-xs font-bold text-amber-300 hover:bg-amber-500/10"
            >
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Flag Heat Spot</span>
            </button>

            <button
              onClick={() => {
                setActiveRouteId('cool');
                setIsNavigating(!isNavigating);
              }}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-500 active:scale-95"
            >
              <Navigation className="h-4 w-4 text-white" />
              <span>{isNavigating ? 'Stop Navigation' : 'Start Shaded Route'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
