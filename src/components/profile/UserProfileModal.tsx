import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  Eye,
  EyeOff,
  FileText,
  Flame,
  KeyRound,
  Mail,
  MapPin,
  Navigation,
  Pencil,
  ShieldCheck,
  ThumbsUp,
  Trees,
  User as UserIcon,
  Wind,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppState } from '../../store/AppStateContext';
import { useAuth } from '../../store/AuthContext';
import type { HazardCategory, ReportStatus } from '../../types';

export function UserProfileModal() {
  const {
    isProfileOpen,
    setIsProfileOpen,
    reports,
    visitedRoutes,
    setIsReportModalOpen,
    selectedCity,
    setSelectedCity,
    showToast,
  } = useAppState();
  const { user, updateProfile } = useAuth();
  const { t, language } = useTranslation();

  const [activeTab, setActiveTab] = useState<'account' | 'reports' | 'routes'>('account');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fallback defaults for user info if not logged in
  const userName = user?.name || 'Neha Resident';
  const userEmail = user?.email || 'neha.resident@biocanopy.demo';
  const userPassword = user?.password || 'citizen123';
  const userRole = user?.role === 'admin' ? t.common.admin : t.common.citizen;
  const memberSince = user?.memberSince || 'September 2026';
  const userCity = user?.city || selectedCity || 'Delhi';

  // Password edit state
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // City edit state
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [newCity, setNewCity] = useState(userCity);
  const [isSavingCity, setIsSavingCity] = useState(false);

  const handleSavePassword = async () => {
    if (newPassword.trim().length < 6) {
      setPasswordError(t.profile.passwordMinLength);
      return;
    }
    setIsSavingPassword(true);
    setPasswordError(null);
    try {
      const res = await updateProfile({ password: newPassword.trim() });
      if (res.success) {
        setIsEditingPassword(false);
        setNewPassword('');
        showToast(t.profile.passwordUpdated, 'success');
      } else {
        setPasswordError(res.message || 'Failed to update password');
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleSaveCity = async () => {
    setIsSavingCity(true);
    try {
      const res = await updateProfile({ city: newCity });
      if (res.success) {
        setSelectedCity(newCity);
        setIsEditingCity(false);
        showToast(t.profile.cityUpdated, 'success');
      }
    } finally {
      setIsSavingCity(false);
    }
  };

  // Filter reports submitted by this user
  const userReports = useMemo(() => {
    return reports.filter((r) => {
      if (r.reporterEmail && userEmail) {
        return r.reporterEmail.toLowerCase() === userEmail.toLowerCase();
      }
      if (r.reporterName && userName) {
        return r.reporterName.toLowerCase() === userName.toLowerCase();
      }
      // If mock report matches citizen
      return (
        userName.toLowerCase().includes('neha') &&
        (r.id === 'rep-01' || r.id === 'rep-03')
      );
    });
  }, [reports, userEmail, userName]);

  if (!isProfileOpen) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Resolved':
        return {
          label: language === 'hi' ? 'समाधान संपन्न' : language === 'mr' ? 'निवारण झाले' : 'Resolved',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'Task Dispatched':
        return {
          label: t.reports.statusDispatched,
          color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        };
      case 'Reviewed':
        return {
          label: t.reports.statusReviewed,
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        };
      default:
        return {
          label: t.reports.statusPending,
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
    }
  };

  const getCategoryIcon = (category: HazardCategory) => {
    switch (category) {
      case 'Illegal Burning':
        return <Flame className="h-4 w-4 text-amber-400" />;
      case 'Construction Dust':
        return <Wind className="h-4 w-4 text-blue-400" />;
      case 'No Tree Cover':
        return <Trees className="h-4 w-4 text-emerald-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Dimmed Blurred Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsProfileOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Main Profile Modal Card */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#0A1B17] shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
      >
        {/* Header with Avatar & User Identity */}
        <div className="relative border-b border-emerald-500/20 bg-gradient-to-r from-[#0F2420] via-[#0A1B17] to-[#081412] p-5 sm:p-6">
          <button
            onClick={() => setIsProfileOpen(false)}
            className="absolute right-4 top-4 rounded-xl border border-emerald-500/20 bg-[#081412] p-2 text-[#94BDB2] transition hover:bg-emerald-500/10 hover:text-white"
            title={t.profile.closeBtn}
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-4">
            {/* Glowing Avatar */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-xl font-black text-white shadow-glow ring-2 ring-emerald-400/50">
              {userName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-[#0A1B17]">
                <Check className="h-2.5 w-2.5 text-black stroke-[3]" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                  {userName}
                </h2>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                  {userRole}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#94BDB2]">
                {t.profile.subtitle}
              </p>
            </div>
          </div>

          {/* Top Tabs: Account / Reports / Routes */}
          <div className="mt-5 flex gap-1 rounded-2xl border border-emerald-500/20 bg-[#081412] p-1">
            <button
              onClick={() => setActiveTab('account')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition ${
                activeTab === 'account'
                  ? 'bg-emerald-600 text-white shadow-glow'
                  : 'text-[#94BDB2] hover:text-white'
              }`}
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>{t.profile.tabAccount}</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition ${
                activeTab === 'reports'
                  ? 'bg-emerald-600 text-white shadow-glow'
                  : 'text-[#94BDB2] hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{t.profile.tabReports}</span>
              <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
                {userReports.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('routes')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition ${
                activeTab === 'routes'
                  ? 'bg-emerald-600 text-white shadow-glow'
                  : 'text-[#94BDB2] hover:text-white'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>{t.profile.tabRoutes}</span>
              <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
                {visitedRoutes.length}
              </span>
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <AnimatePresence mode="wait">
            {/* TAB 1: Account Info (Name, Email, Password, Role, City) */}
            {activeTab === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                {/* 1. Name Card (Strictly Read-Only) */}
                <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#94BDB2]">
                        {t.profile.nameLabel}
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-[#94BDB2] border border-white/10">
                        {t.profile.readOnlyBadge}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(userName, 'name')}
                      className="text-[#94BDB2] hover:text-white transition"
                      title="Copy Name"
                    >
                      {copiedField === 'name' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2.5 text-sm font-bold text-white">
                    <UserIcon className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{userName}</span>
                  </div>
                </div>

                {/* 2. Email Address Card (Strictly Read-Only) */}
                <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#94BDB2]">
                        {t.profile.emailLabel}
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        ✓ Verified
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-[#94BDB2] border border-white/10">
                        {t.profile.readOnlyBadge}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(userEmail, 'email')}
                      className="text-[#94BDB2] hover:text-white transition"
                      title="Copy Email"
                    >
                      {copiedField === 'email' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2.5 text-sm font-bold text-white">
                    <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="font-mono text-xs sm:text-sm">{userEmail}</span>
                  </div>
                </div>

                {/* 3. Password Card with EDIT / SAVE / CANCEL */}
                <div className="rounded-2xl border border-emerald-500/30 bg-[#0F2420] p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#94BDB2]">
                        {t.profile.passwordLabel}
                      </span>
                      {isEditingPassword && (
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                          {t.profile.editPassword}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!isEditingPassword ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-[#081412] px-2 py-1 text-[11px] font-bold text-emerald-300 hover:text-white transition"
                          >
                            {showPassword ? (
                              <>
                                <EyeOff className="h-3 w-3" />
                                <span>{t.profile.hidePassword}</span>
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3" />
                                <span>{t.profile.showPassword}</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(userPassword, 'password')}
                            className="text-[#94BDB2] hover:text-white transition p-1"
                            title="Copy Password"
                          >
                            {copiedField === 'password' ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingPassword(true);
                              setNewPassword('');
                              setPasswordError(null);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-500/20 transition ml-1"
                          >
                            <Pencil className="h-3 w-3" />
                            <span>{t.profile.editBtn}</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isSavingPassword}
                            onClick={handleSavePassword}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-glow hover:bg-emerald-500 transition disabled:opacity-60"
                          >
                            <Check className="h-3 w-3" />
                            <span>{t.profile.saveBtn}</span>
                          </button>
                          <button
                            type="button"
                            disabled={isSavingPassword}
                            onClick={() => {
                              setIsEditingPassword(false);
                              setPasswordError(null);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-[#94BDB2] hover:text-white transition"
                          >
                            <X className="h-3 w-3" />
                            <span>{t.profile.cancelBtn}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isEditingPassword ? (
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 font-mono text-sm">
                        <KeyRound className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span className="font-bold tracking-wider text-white">
                          {showPassword ? userPassword : '••••••••••••'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#94BDB2]">
                        AES-256 / Bcrypt Hash
                      </span>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t.profile.newPasswordPlaceholder}
                        className="w-full rounded-xl border border-emerald-400/50 bg-[#081412] px-3.5 py-2 text-xs font-mono font-medium text-white focus:border-cyan-400 focus:outline-none"
                        autoFocus
                      />
                      {passwordError && (
                        <p className="text-[11px] font-bold text-red-400">
                          {passwordError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 4. City Hub Card with EDIT / SAVE / CANCEL */}
                <div className="rounded-2xl border border-emerald-500/30 bg-[#0F2420] p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#94BDB2]">
                      {t.profile.cityLabel}
                    </span>

                    {!isEditingCity ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingCity(true);
                          setNewCity(userCity);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
                      >
                        <Pencil className="h-3 w-3" />
                        <span>{t.profile.editBtn}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={isSavingCity}
                          onClick={handleSaveCity}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-glow hover:bg-emerald-500 transition disabled:opacity-60"
                        >
                          <Check className="h-3 w-3" />
                          <span>{t.profile.saveBtn}</span>
                        </button>
                        <button
                          type="button"
                          disabled={isSavingCity}
                          onClick={() => setIsEditingCity(false)}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-[#94BDB2] hover:text-white transition"
                        >
                          <X className="h-3 w-3" />
                          <span>{t.profile.cancelBtn}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {!isEditingCity ? (
                    <div className="mt-2 flex items-center gap-2 text-sm font-bold text-white">
                      <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span>{userCity}</span>
                      <span className="text-[11px] font-normal text-[#94BDB2] ml-1">
                        (Active Climate Telemetry Node)
                      </span>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <select
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full rounded-xl border border-emerald-400/50 bg-[#081412] px-3.5 py-2 text-xs font-medium text-white focus:border-cyan-400 focus:outline-none"
                      >
                        {['Delhi', 'Mumbai', 'Bengaluru', 'Ahmedabad'].map((c) => (
                          <option key={c} value={c} className="bg-[#081412] text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* 5. Role & Registration Date Grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
                      {t.profile.roleLabel}
                    </span>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-white">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{userRole}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
                      {t.profile.memberSince}
                    </span>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-white">
                      <Calendar className="h-3.5 w-3.5 text-teal-400" />
                      <span>{memberSince}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: User Hazard Reports */}
            {activeTab === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-[#94BDB2] pb-1">
                  <span>
                    <strong>{userReports.length}</strong> {t.profile.reportedHazardsCount}
                  </span>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsReportModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    + {t.reports.reportNewHazard}
                  </button>
                </div>

                {userReports.length === 0 ? (
                  <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-8 text-center text-[#94BDB2]">
                    <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400 opacity-60 mb-2" />
                    <p className="text-sm font-bold text-white">{t.profile.noReportsTitle}</p>
                    <p className="mt-1 text-xs max-w-sm mx-auto">{t.profile.noReportsDesc}</p>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsReportModalOpen(true);
                      }}
                      className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-glow hover:bg-emerald-500 transition"
                    >
                      {t.reports.reportNewHazard}
                    </button>
                  </div>
                ) : (
                  userReports.map((report) => {
                    const statusInfo = getStatusBadge(report.status);
                    return (
                      <div
                        key={report.id}
                        className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-4 space-y-2.5 transition hover:border-emerald-400/40"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#081412] ring-1 ring-emerald-500/30">
                              {getCategoryIcon(report.category)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                                  {report.id} · {report.city}
                                </span>
                                <span className="rounded-full bg-white/10 px-2 py-0.2 text-[10px] font-bold text-white">
                                  {report.category}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-white mt-0.5">
                                {report.locationName}
                              </h4>
                            </div>
                          </div>

                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold shrink-0 ${statusInfo.color}`}
                          >
                            ● {statusInfo.label}
                          </span>
                        </div>

                        <p className="text-xs text-[#94BDB2] leading-relaxed">
                          {report.description}
                        </p>

                        <div className="flex items-center justify-between border-t border-emerald-500/10 pt-2 text-[11px] text-[#94BDB2]/80">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-emerald-400" />
                            {report.submittedAt}
                          </span>
                          <span className="flex items-center gap-1 font-bold text-emerald-300">
                            <ThumbsUp className="h-3 w-3" />
                            {report.upvotes || 1} {t.common.upvote}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {/* TAB 3: Visited Routes History */}
            {activeTab === 'routes' && (
              <motion.div
                key="routes"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                <div className="text-xs text-[#94BDB2] pb-1">
                  <span>
                    <strong>{visitedRoutes.length}</strong> {t.profile.visitedRoutesCount}
                  </span>
                </div>

                {visitedRoutes.length === 0 ? (
                  <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-8 text-center text-[#94BDB2]">
                    <Navigation className="mx-auto h-10 w-10 text-cyan-400 opacity-60 mb-2" />
                    <p className="text-sm font-bold text-white">{t.profile.noRoutesTitle}</p>
                    <p className="mt-1 text-xs max-w-sm mx-auto">{t.profile.noRoutesDesc}</p>
                  </div>
                ) : (
                  visitedRoutes.map((route) => (
                    <div
                      key={route.id}
                      className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-4 space-y-3 transition hover:border-cyan-400/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 ring-1 ring-cyan-500/30">
                            <Navigation className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/25">
                              {route.city}
                            </span>
                            <h4 className="text-xs font-bold text-white mt-1">
                              {route.routeName}
                            </h4>
                          </div>
                        </div>

                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 shrink-0">
                          ✓ {t.profile.completed}
                        </span>
                      </div>

                      {/* Route metrics row */}
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-center">
                        <div className="rounded-xl bg-[#081412] p-2 border border-emerald-500/10">
                          <p className="text-[10px] uppercase font-bold text-[#94BDB2]">
                            {t.profile.shadedCoverage}
                          </p>
                          <p className="text-xs font-bold text-emerald-400 mt-0.5">
                            {route.shadePercentage}%
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#081412] p-2 border border-emerald-500/10">
                          <p className="text-[10px] uppercase font-bold text-[#94BDB2]">
                            {t.profile.heatAvoided}
                          </p>
                          <p className="text-xs font-bold text-cyan-400 mt-0.5">
                            -{route.heatReduction}%
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#081412] p-2 border border-emerald-500/10">
                          <p className="text-[10px] uppercase font-bold text-[#94BDB2]">
                            Distance
                          </p>
                          <p className="text-xs font-bold text-white mt-0.5">
                            {route.distance}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#081412] p-2 border border-emerald-500/10">
                          <p className="text-[10px] uppercase font-bold text-[#94BDB2]">
                            Duration
                          </p>
                          <p className="text-xs font-bold text-white mt-0.5">
                            {route.travelTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-emerald-500/10 pt-2 text-[11px] text-[#94BDB2]">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-cyan-400" />
                          {route.origin}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <Clock className="h-3 w-3 text-emerald-400" />
                          {route.visitedAt}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-emerald-500/20 bg-[#081412] px-6 py-3.5 flex items-center justify-between">
          <span className="text-[11px] text-[#94BDB2]">
            BioCanopy Identity & Resilience Vault
          </span>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-glow hover:bg-emerald-500 transition active:scale-95"
          >
            {t.profile.closeBtn}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
