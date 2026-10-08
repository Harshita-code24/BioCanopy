import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Flame,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  ThumbsUp,
  Trash2,
  Trees,
  User,
  Users,
  Wind,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAppState } from '../store/AppStateContext';
import { useAuth } from '../store/AuthContext';
import type { HazardCategory, ReportStatus } from '../types';

type AdminReport = {
  id: string;
  city: string;
  locationName: string;
  coordinates: [number, number];
  category: HazardCategory;
  description: string;
  photoUrl?: string;
  status: ReportStatus;
  source: string;
  upvotes: number;
  reporterName?: string;
  reporterEmail?: string;
  submittedAt: string;
  createdAt?: string;
};

type AdminStats = {
  totalReports: number;
  pendingReports: number;
  dispatchedReports: number;
  resolvedReports: number;
  totalUsers: number;
};

export function AdminPage() {
  const { user } = useAuth();
  const { selectedCity, setSelectedCity, showToast } = useAppState();

  const [reports, setReports] = useState<AdminReport[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalReports: 0,
    pendingReports: 0,
    dispatchedReports: 0,
    resolvedReports: 0,
    totalUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filterCity, setFilterCity] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch reports and stats from backend
  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [reportsRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/reports'),
        fetch('http://localhost:5000/api/admin/stats'),
      ]);

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.warn('Could not connect to admin backend, using offline fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Handle status update
  const handleStatusChange = async (id: string, newStatus: ReportStatus) => {
    // Optimistic update
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    try {
      const res = await fetch(`http://localhost:5000/api/admin/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        showToast(`Report ${id} status updated to "${newStatus}".`, 'success');
        // Refresh stats
        const statsRes = await fetch('http://localhost:5000/api/admin/stats');
        if (statsRes.ok) setStats(await statsRes.json());
      }
    } catch (err) {
      console.error('Failed to update status on server:', err);
    }
  };

  // Handle report deletion
  const handleDeleteReport = async (id: string) => {
    if (!window.confirm(`Are you sure you want to dismiss and delete report ${id}?`)) {
      return;
    }

    setReports((prev) => prev.filter((r) => r.id !== id));

    try {
      const res = await fetch(`http://localhost:5000/api/admin/reports/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast(`Report ${id} deleted by Admin.`, 'info');
        const statsRes = await fetch('http://localhost:5000/api/admin/stats');
        if (statsRes.ok) setStats(await statsRes.json());
      }
    } catch (err) {
      console.error('Failed to delete report on server:', err);
    }
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchCity = filterCity === 'All' || r.city === filterCity;
      const matchStatus = filterStatus === 'All' || r.status === filterStatus;
      const matchCategory = filterCategory === 'All' || r.category === filterCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        r.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.reporterName && r.reporterName.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCity && matchStatus && matchCategory && matchSearch;
    });
  }, [reports, filterCity, filterStatus, filterCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Admin Top Header Banner */}
      <div className="rounded-3xl border border-cyan-500/30 bg-[#0A1B17] p-6 sm:p-8 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 ring-1 ring-cyan-500/40">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span>Authority Command Center</span>
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                Admin: {user?.name || 'BioCanopy Team'}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black text-white sm:text-4xl tracking-tight">
              Citizen Hazard & Greening Triage
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94BDB2] max-w-2xl leading-relaxed">
              Review community-flagged heat traps, verify citizen identities, and dispatch municipal shade interventions across Indian metropolitan centers.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-xs font-bold text-white shadow-glow hover:bg-cyan-500 transition active:scale-95 shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Live Queue</span>
          </button>
        </div>

        {/* Top High-Level KPI Summary Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5 border-t border-cyan-500/20 pt-6">
          <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
              Total Reports
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{stats.totalReports}</span>
              <span className="text-xs text-emerald-400 font-bold">Logged</span>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-[#0F2420] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Pending Review
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400">{stats.pendingReports}</span>
              <span className="text-xs text-[#94BDB2]">Awaiting triage</span>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-[#0F2420] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
              Dispatched Tasks
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-cyan-400">{stats.dispatchedReports}</span>
              <span className="text-xs text-[#94BDB2]">In field</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-[#0F2420] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Resolved Issues
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400">{stats.resolvedReports}</span>
              <span className="text-xs text-[#94BDB2]">Mitigated</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3.5 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
              Registered Citizens
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{stats.totalUsers}</span>
              <span className="text-xs text-cyan-400 font-bold">Users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-5 shadow-card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-emerald-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location, citizen name, or keywords..."
              className="w-full rounded-xl border border-emerald-500/30 bg-[#081412] py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-[#94BDB2]/50 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Quick Filter Counts */}
          <div className="flex items-center gap-2 text-xs text-[#94BDB2]">
            <span>Showing</span>
            <strong className="text-white">{filteredReports.length}</strong>
            <span>of {reports.length} total reports</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 border-t border-emerald-500/10 pt-3">
          {/* City Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase text-[#94BDB2]">City:</span>
            <div className="flex flex-wrap gap-1">
              {['All', 'Delhi', 'Mumbai', 'Bengaluru', 'Ahmedabad'].map((c) => (
                <button
                  key={c}
                  onClick={() => setFilterCity(c)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                    filterCity === c
                      ? 'bg-cyan-600 text-white shadow-glow'
                      : 'bg-[#081412] text-[#94BDB2] hover:text-white border border-emerald-500/20'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] font-bold uppercase text-[#94BDB2]">Status:</span>
            <div className="flex flex-wrap gap-1">
              {['All', 'Pending Review', 'Reviewed', 'Task Dispatched', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                    filterStatus === st
                      ? 'bg-emerald-600 text-white shadow-glow'
                      : 'bg-[#081412] text-[#94BDB2] hover:text-white border border-emerald-500/20'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reports Triage Feed */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-12 text-center text-[#94BDB2]">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 opacity-60" />
            <h3 className="mt-3 text-base font-bold text-white">No Matching Reports</h3>
            <p className="mt-1 text-xs">
              All community hazard reports matching the current filters have been resolved or triaged.
            </p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-5 shadow-card transition hover:border-cyan-400/40"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                {/* Left: Hazard details & Reporter Info */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      report.category === 'Unshaded Hotspot'
                        ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40'
                        : report.category === 'Illegal Burning'
                        ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40'
                        : report.category === 'Construction Dust'
                        ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40'
                    }`}
                  >
                    {report.category === 'Illegal Burning' ? (
                      <Flame className="h-5 w-5" />
                    ) : report.category === 'Construction Dust' ? (
                      <Wind className="h-5 w-5" />
                    ) : report.category === 'No Tree Cover' ? (
                      <Trees className="h-5 w-5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    {/* Reporter Pill & City Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                        {report.id} · {report.city}
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-[#ECFDF5]">
                        {report.category}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-300 ring-1 ring-cyan-500/30">
                        <User className="h-3 w-3 text-cyan-400" />
                        <span>Reported by: <strong>{report.reporterName}</strong> ({report.reporterEmail})</span>
                      </span>
                    </div>

                    <h3 className="mt-1 text-sm font-bold text-white">
                      {report.locationName}
                    </h3>
                    <p className="mt-1 text-xs text-[#94BDB2] max-w-3xl leading-relaxed">
                      {report.description}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[11px] text-[#94BDB2]/80">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-emerald-400" />
                        {report.submittedAt}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-300 font-bold">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {report.upvotes} Community Upvotes
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                        GPS: {report.coordinates[0].toFixed(4)}, {report.coordinates[1].toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Status Pill & Action Buttons */}
                <div className="flex flex-col items-start lg:items-end gap-3 shrink-0 border-t border-emerald-500/10 pt-3 lg:border-t-0 lg:pt-0">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold border ${
                      report.status === 'Resolved'
                        ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                        : report.status === 'Task Dispatched'
                        ? 'border-cyan-500/40 bg-cyan-500/20 text-cyan-300'
                        : report.status === 'Reviewed'
                        ? 'border-blue-500/40 bg-blue-500/20 text-blue-300'
                        : 'border-amber-500/40 bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    ● {report.status}
                  </span>

                  {/* Quick Action Progression Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {report.status === 'Pending Review' && (
                      <button
                        onClick={() => handleStatusChange(report.id, 'Reviewed')}
                        className="rounded-xl bg-blue-600/80 hover:bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white transition active:scale-95"
                      >
                        Accept & Review
                      </button>
                    )}

                    {(report.status === 'Pending Review' || report.status === 'Reviewed') && (
                      <button
                        onClick={() => handleStatusChange(report.id, 'Task Dispatched')}
                        className="rounded-xl bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 text-[11px] font-bold text-white shadow-glow transition active:scale-95"
                      >
                        Dispatch Squad 🚀
                      </button>
                    )}

                    {report.status !== 'Resolved' && (
                      <button
                        onClick={() => handleStatusChange(report.id, 'Resolved')}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white transition active:scale-95"
                      >
                        Mark Resolved ✅
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="rounded-xl border border-red-500/30 bg-red-950/40 hover:bg-red-900/60 p-1.5 text-red-400 hover:text-red-300 transition"
                      title="Dismiss & Delete Report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
