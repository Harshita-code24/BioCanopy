import { motion } from 'framer-motion';
import { Layers3, Route, ThermometerSun, Trees } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { heatPoints, routeLocations, routeOptions } from '../../data/mockData';
import { useAppState } from '../../store/AppStateContext';
import { GlassCard } from '../shared/GlassCard';
import { HeatLayer } from './HeatLayer';

type Toggle = {
  heat: boolean;
  routes: boolean;
};

export function ThermalMap() {
  const { theme } = useAppState();
  const [start, setStart] = useState(routeLocations[0].value);
  const [end, setEnd] = useState(routeLocations[2].value);
  const [toggles, setToggles] = useState<Toggle>({ heat: true, routes: true });

  const summary = useMemo(() => {
    const cool = routeOptions.find((route) => route.id === 'cool')!;
    return cool;
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
      <GlassCard className="overflow-hidden p-3">
        <div className="mb-4 flex flex-col gap-4 px-2 pt-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-canopy-teal">
              Urban Heat Overlay
            </p>
            <h3 className="mt-1 text-xl font-semibold text-canopy-text">
              Full-city thermal view with route comparison
            </h3>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-canopy-muted">
            <label className="flex items-center gap-2 rounded-full border border-canopy-border/60 bg-canopy-base/70 px-3 py-2">
              <input
                type="checkbox"
                checked={toggles.heat}
                onChange={() =>
                  setToggles((current) => ({ ...current, heat: !current.heat }))
                }
              />
              Heat layer
            </label>
            <label className="flex items-center gap-2 rounded-full border border-canopy-border/60 bg-canopy-base/70 px-3 py-2">
              <input
                type="checkbox"
                checked={toggles.routes}
                onChange={() =>
                  setToggles((current) => ({
                    ...current,
                    routes: !current.routes,
                  }))
                }
              />
              Routes
            </label>
          </div>
        </div>
        <div className="h-[540px] overflow-hidden rounded-[1.25rem] border border-canopy-border/60">
          <MapContainer center={[22.7, 78.9]} zoom={5} scrollWheelZoom className="h-full">
            <TileLayer
              key={theme}
              attribution='&copy; OpenStreetMap &copy; CARTO'
              url={
                theme === 'light'
                  ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              }
            />
            <HeatLayer points={heatPoints} visible={toggles.heat} />
            {toggles.routes &&
              routeOptions.map((route) => (
                <Polyline
                  key={route.id}
                  positions={route.coordinates}
                  pathOptions={{
                    color: route.color,
                    weight: route.id === 'cool' ? 7 : 5,
                    opacity: route.id === 'cool' ? 0.9 : 0.75,
                    dashArray: route.id === 'fastest' ? '12 12' : undefined,
                  }}
                />
              ))}
            {routeLocations.map((location) => (
              <Marker key={location.value} position={location.coordinates}>
                <Popup>{location.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </GlassCard>

      <div className="space-y-6">
        <GlassCard>
          <div className="flex items-center gap-3">
            <Route className="h-5 w-5 text-canopy-teal" />
            <h3 className="text-lg font-semibold">Mock Cool-Route Planner</h3>
          </div>
          <div className="mt-5 grid gap-4">
            <label className="space-y-2 text-sm text-canopy-muted">
              Start point
              <select
                value={start}
                onChange={(event) => setStart(event.target.value)}
                className="w-full rounded-2xl border border-canopy-border/60 bg-canopy-base px-4 py-3 text-canopy-text"
              >
                {routeLocations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-canopy-muted">
              End point
              <select
                value={end}
                onChange={(event) => setEnd(event.target.value)}
                className="w-full rounded-2xl border border-canopy-border/60 bg-canopy-base px-4 py-3 text-canopy-text"
              >
                {routeLocations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-4 text-sm text-canopy-muted">
            Showing mock route comparison for {start} to {end}. Demo highlights
            canopy-aware routing instead of shortest-time-only navigation.
          </p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3">
            <Layers3 className="h-5 w-5 text-canopy-green" />
            <h3 className="text-lg font-semibold">Legend</h3>
          </div>
          <div className="mt-5 space-y-3 text-sm">
            {toggles.heat && (
              <>
                <LegendItem label="Cool zone" color="bg-canopy-green" />
                <LegendItem label="Moderate heat" color="bg-canopy-amber" />
                <LegendItem label="High heat" color="bg-canopy-red" />
              </>
            )}
            {toggles.routes && (
              <>
                <LegendItem label="Fastest route" color="bg-canopy-red" />
                <LegendItem label="Cool route" color="bg-canopy-teal" />
              </>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold">Animated Route Comparison</h3>
          <div className="mt-5 grid gap-3">
            <AnimatedStat
              icon={<ThermometerSun className="h-5 w-5 text-canopy-red" />}
              label="Heat exposure reduction"
              value={`${summary.heatReduction}%`}
            />
            <AnimatedStat
              icon={<Trees className="h-5 w-5 text-canopy-green" />}
              label="Tree canopy coverage"
              value={`+${summary.canopyBoost}%`}
            />
            <AnimatedStat
              icon={<Route className="h-5 w-5 text-canopy-teal" />}
              label="Time difference"
              value="+1.5 min"
            />
          </div>
          <p className="mt-4 text-sm text-canopy-muted">
            Cool Route: {summary.travelTime}, {summary.badge}, +40% tree canopy
            coverage.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-canopy-muted">
      <span className={`h-3 w-8 rounded-full ${color}`} />
      {label}
    </div>
  );
}

function AnimatedStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="flex items-center justify-between rounded-2xl border border-canopy-border/60 bg-canopy-base/60 px-4 py-4"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm text-canopy-muted">{label}</span>
      </div>
      <span className="text-lg font-semibold text-canopy-text">{value}</span>
    </motion.div>
  );
}
