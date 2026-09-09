import { cityMetrics } from '../../data/mockData';
import { useAppState } from '../../store/AppStateContext';

export function CitySelector() {
  const { selectedCity, setSelectedCity } = useAppState();

  return (
    <label className="flex w-full items-center justify-between gap-3 rounded-2xl border border-canopy-border/60 bg-canopy-surface/60 px-4 py-3 text-sm text-canopy-muted shadow-glow backdrop-blur sm:inline-flex sm:w-auto sm:justify-start">
      <span className="uppercase tracking-[0.25em] text-canopy-teal">City</span>
      <select
        value={selectedCity}
        onChange={(event) => setSelectedCity(event.target.value)}
        className="min-w-[140px] rounded-xl border border-canopy-border/60 bg-canopy-base px-3 py-2 text-canopy-text"
      >
        {cityMetrics.map((metric) => (
          <option key={metric.city} value={metric.city}>
            {metric.city}
          </option>
        ))}
      </select>
    </label>
  );
}
