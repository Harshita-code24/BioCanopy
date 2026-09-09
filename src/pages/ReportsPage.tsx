import L from 'leaflet';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Filter,
  Flame,
  MapPin,
  Plus,
  ThumbsUp,
  Trees,
  Wind,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { cityCoordinates } from '../data/mockData';
import { useAppState } from '../store/AppStateContext';
import type { HazardCategory } from '../types';

export function ReportsPage() {
  const { reports, selectedCity, setIsReportModalOpen, updateReportStatus } =
    useAppState();
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const cityCoords = cityCoordinates[selectedCity] || [28.6139, 77.209];

  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      const matchCity = rep.city === selectedCity;
      const matchCat = filterCategory === 'All' || rep.category === filterCategory;
      return matchCity && matchCat;
    });
  }, [reports, selectedCity, filterCategory]);

  return (
    <div className="space-y-6">
      {/* Sleek Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white sm:text-2xl">
            Hazard Reporting · {selectedCity}
          </h1>
          <p className="text-xs text-[#94BDB2]">
            {filteredReports.length} active crowdsourced community reports in {selectedCity}
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-glow transition hover:bg-emerald-500 active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Report New Hazard</span>
        </button>
      </div>

      {/* Main Split Interface: Map on Left, Feed on Right */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: Interactive Public Hazard Map */}
        <div className="rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-4 shadow-card flex flex-col">
          <div className="flex items-center justify-between pb-3 px-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Live Geotagged Hazard Map
              </h3>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              {filteredReports.length} Active Pins
            </span>
          </div>

          <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#060F0D]">
            <MapContainer
              center={cityCoords}
              zoom={13}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                maxZoom={19}
              />

              {filteredReports.map((report) => (
                <Marker
                  key={report.id}
                  position={report.coordinates}
                  icon={L.divIcon({
                    className: 'hazard-pin',
                    html: `<div style="background-color: ${
                      report.category === 'Unshaded Hotspot'
                        ? '#EF4444'
                        : report.category === 'Illegal Burning'
                        ? '#F59E0B'
                        : '#38BDF8'
                    }; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 0 14px rgba(239,68,68,0.7); border: 2px solid white;">
                      ⚠
                    </div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                  })}
                >
                  <Popup>
                    <div className="p-2 text-white max-w-[240px]">
                      <span className="text-[10px] font-bold uppercase text-red-400">
                        {report.category}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-0.5">
                        {report.locationName}
                      </h4>
                      <p className="text-xs text-[#94BDB2] mt-1 line-clamp-3">
                        {report.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between border-t border-emerald-500/20 pt-1.5 text-[10px]">
                        <span className="font-semibold text-emerald-300">
                          {report.status}
                        </span>
                        <span className="text-gray-400">{report.submittedAt}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Right: Filterable Community Feed */}
        <div className="rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-5 shadow-card flex flex-col">
          {/* Feed Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Community Reports Feed
              </h3>
            </div>

            <div className="flex flex-wrap gap-1">
              {(['All', 'Unshaded Hotspot', 'Illegal Burning', 'Construction Dust'] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition ${
                      filterCategory === cat
                        ? 'bg-emerald-600 text-white shadow-glow'
                        : 'bg-[#081412] text-[#94BDB2] hover:text-white border border-emerald-500/20'
                    }`}
                  >
                    {cat}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Cards List */}
          <div className="mt-4 space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl border border-emerald-500/20 bg-[#0A1B17] p-4 transition hover:border-emerald-400/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        report.category === 'Unshaded Hotspot'
                          ? 'bg-red-500/20 text-red-400'
                          : report.category === 'Illegal Burning'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {report.category === 'Illegal Burning' ? (
                        <Flame className="h-4 w-4" />
                      ) : report.category === 'Construction Dust' ? (
                        <Wind className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        {report.category}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-0.5">
                        {report.locationName}
                      </h4>
                      <p className="text-[11px] text-[#94BDB2] mt-1 leading-relaxed">
                        {report.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                      report.status === 'Task Dispatched'
                        ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                        : report.status === 'Reviewed'
                        ? 'border-blue-500/40 bg-blue-500/20 text-blue-300'
                        : 'border-amber-500/40 bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                {/* Footer Metadata & Upvoting */}
                <div className="mt-3 flex items-center justify-between border-t border-emerald-500/10 pt-2 text-[10px] text-[#94BDB2]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {report.submittedAt} · {report.source}
                  </span>

                  <button className="flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300">
                    <ThumbsUp className="h-3 w-3" />
                    <span>Upvote ({report.upvotes || 1})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
