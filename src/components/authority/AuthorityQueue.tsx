import {
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  Filter,
  Flame,
  Layers,
  MapPin,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Trees,
  TrendingUp,
  Wind,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { cityMetrics } from '../../data/mockData';
import { useAppState } from '../../store/AppStateContext';
import type { AuthorityZone } from '../../types';

export function AuthorityQueue() {
  const { authorityZones, dispatchPlantingTask, selectedCity, setSelectedCity, reports } =
    useAppState();

  const [cityFilter, setCityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter zones
  const filteredZones = useMemo(() => {
    return authorityZones.filter((zone) => {
      const matchCity = cityFilter === 'All' || zone.city === cityFilter;
      const matchStatus = statusFilter === 'All' || zone.status === statusFilter;
      return matchCity && matchStatus;
    });
  }, [authorityZones, cityFilter, statusFilter]);

  // Municipal Overview KPIs
  const totalComplaints = authorityZones.reduce((acc, z) => acc + z.complaintCount, 0);
  const totalSaplingsTargeted = authorityZones.reduce((acc, z) => acc + z.targetSaplings, 0);
  const activeDispatches = authorityZones.filter((z) => z.status === 'Task Dispatched').length;

  return (
    <div className="space-y-6">
      {/* Authority Header Banner */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-md bg-[#14532D] px-2 py-0.5 text-xs font-bold text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Municipal Command Center
              </span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs font-semibold text-gray-600">
                Urban Policy & Planning Portal
              </span>
            </div>
            <h2 className="mt-1.5 text-2xl font-black text-gray-900 sm:text-3xl">
              Heat Priority Queue & Tree-Planting Dispatch
            </h2>
            <p className="mt-1 text-xs text-gray-600 sm:text-sm">
              Automatically ranking high-vulnerability urban blocks by combining citizen hazard density with satellite canopy deficit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-900">
              Active Municipal Sync: LIVE
            </span>
          </div>
        </div>

        {/* 4 Quick Stat Metric Tiles */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Ranked Hotspot Zones
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">
                {authorityZones.length}
              </span>
              <span className="text-xs font-semibold text-red-600">Targeted</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Citizen Hazard Reports
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">
                {totalComplaints}
              </span>
              <span className="text-xs font-semibold text-amber-600">Verified</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Saplings Targeted
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-700">
                {totalSaplingsTargeted}
              </span>
              <span className="text-xs font-semibold text-emerald-600">Ready</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Active Dispatches
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#14532D]">
                {activeDispatches}
              </span>
              <span className="text-xs font-semibold text-emerald-700">Dispatched</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Queue Table Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Table Filters & Header */}
        <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/70 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Spatial Heat Priority Queue
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              {filteredZones.length} Zones
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by City */}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-2xs"
            >
              <option value="All">All Cities</option>
              {cityMetrics.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-2xs"
            >
              <option value="All">All Statuses</option>
              <option value="Needs Dispatch">Needs Dispatch</option>
              <option value="Task Dispatched">Task Dispatched</option>
              <option value="Planting In Progress">Planting In Progress</option>
            </select>
          </div>
        </div>

        {/* Priority Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-200 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3">Rank & Zone</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Citizen Complaint Density</th>
                <th className="px-4 py-3">Canopy Deficit</th>
                <th className="px-4 py-3">Surface Heat</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Municipal Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {filteredZones.map((zone, idx) => {
                const isDispatched =
                  zone.status === 'Task Dispatched' ||
                  zone.status === 'Planting In Progress';

                return (
                  <tr
                    key={zone.id}
                    className="transition hover:bg-emerald-50/30"
                  >
                    {/* Rank & Zone */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[11px] font-bold text-white">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {zone.zoneName}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Targeting {zone.targetSaplings} native shade saplings
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* City */}
                    <td className="px-4 py-4">
                      <span className="rounded-md bg-gray-100 px-2 py-1 font-semibold text-gray-800">
                        {zone.city}
                      </span>
                    </td>

                    {/* Citizen Complaint Density */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-red-100 px-2 py-1 font-bold text-red-700">
                          {zone.complaintCount} Reports
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {zone.lastReported}
                        </span>
                      </div>
                    </td>

                    {/* Canopy Deficit */}
                    <td className="px-4 py-4">
                      <div>
                        <span className="font-bold text-red-600 text-sm">
                          {zone.canopyDeficit}% Deficit
                        </span>
                        <p className="text-[11px] text-gray-500">
                          Current cover: {zone.currentCanopy}%
                        </p>
                      </div>
                    </td>

                    {/* Surface Heat */}
                    <td className="px-4 py-4">
                      <span className="font-bold text-amber-700 text-sm">
                        {zone.surfaceTemp}°C
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      {isDispatched ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            {zone.status}
                          </span>
                          {zone.dispatchId && (
                            <p className="text-[10px] font-mono text-gray-500">
                              #{zone.dispatchId}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                          <Clock className="h-3 w-3" />
                          Needs Dispatch
                        </span>
                      )}
                    </td>

                    {/* Actionable Button: "Dispatch Tree-Planting Task" */}
                    <td className="px-5 py-4 text-right">
                      {isDispatched ? (
                        <button
                          disabled
                          className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3.5 py-2 text-xs font-semibold text-gray-400 cursor-not-allowed"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-gray-400" />
                          <span>Squad Dispatched</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => dispatchPlantingTask(zone.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#14532D] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#166534] active:scale-95"
                        >
                          <Trees className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Dispatch Tree-Planting Task</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Closed-Loop Workflow Explanation Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#14532D] text-emerald-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950">
              Closed-Loop Municipal Planning Workflow (Proto-type Implementation)
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-emerald-900">
              When a citizen flags an unshaded hotspot or dust corridor, the pin appears instantly on the public map and dynamically increments the zone's complaint density score. Municipal officers clicking <strong>"Dispatch Tree-Planting Task"</strong> automatically issue work orders to horticulture squads, fulfilling <strong>UN SDG Target 13.2</strong> for integrated urban climate resilience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
