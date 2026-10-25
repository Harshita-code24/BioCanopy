import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  cityMetrics,
  initialAuthorityZones,
  initialCitizenReports,
} from '../data/mockData';
import type {
  AiConditionPreset,
  AppTab,
  AuthorityZone,
  CityMetric,
  Language,
  Report,
  ReportStatus,
  VisitedRoute,
} from '../types';

type ToastInfo = {
  message: string;
  type: 'success' | 'info';
};

type AppStateValue = {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  currentMetric: CityMetric;
  isLoadingTelemetry: boolean;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  reports: Report[];
  upvotedReportIds: string[];
  hasUserUpvoted: (id: string) => boolean;
  addReport: (
    report: Omit<Report, 'id' | 'submittedAt' | 'status' | 'source'>,
  ) => void;
  upvoteReport: (id: string) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  updateReportStatus: (id: string, status: ReportStatus) => void;
  authorityZones: AuthorityZone[];
  dispatchPlantingTask: (zoneId: string) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  visitedRoutes: VisitedRoute[];
  addVisitedRoute: (route: VisitedRoute) => void;
  selectedPreset: AiConditionPreset;
  setSelectedPreset: (preset: AiConditionPreset) => void;
  isNavigating: boolean;
  setIsNavigating: (nav: boolean) => void;
  activeRouteId: 'cool' | 'fastest';
  setActiveRouteId: (id: 'cool' | 'fastest') => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'info') => void;
};

const THEME_KEY = 'biocanopy_theme_v2';
const LANG_KEY = 'biocanopy_lang_v2';
const REPORTS_KEY = 'biocanopy_reports_v2';
const ZONES_KEY = 'biocanopy_zones_v2';
const CITY_KEY = 'biocanopy_city_v2';
const ROUTES_HISTORY_KEY = 'biocanopy_routes_history_v2';
const API_REPORTS_URL = import.meta.env.VITE_API_REPORTS_URL || 'http://localhost:5000/api/reports';
const API_TELEMETRY_URL = import.meta.env.VITE_API_TELEMETRY_URL || 'http://localhost:5000/api/telemetry';
const API_DISPATCHES_URL = import.meta.env.VITE_API_DISPATCHES_URL || 'http://localhost:5000/api/dispatches';

export const defaultVisitedRoutes: VisitedRoute[] = [
  {
    id: 'vr-01',
    routeName: 'Dadar West Walkway ➔ Shivaji Park Outer Shaded Path',
    city: 'Mumbai',
    origin: 'Dadar West Railway Exit',
    destination: 'Shivaji Park Perimeter Walkway',
    shadePercentage: 82,
    heatReduction: 31,
    distance: '1.2 km',
    travelTime: '14 min',
    visitedAt: 'Today, 09:30 AM',
    status: 'Completed',
  },
  {
    id: 'vr-02',
    routeName: 'Connaught Place Radial ➔ Janpath Green Arch',
    city: 'Delhi',
    origin: 'CP Metro Gate 2',
    destination: 'Janpath Tree Corridor',
    shadePercentage: 85,
    heatReduction: 34,
    distance: '1.8 km',
    travelTime: '18 min',
    visitedAt: 'Yesterday, 04:15 PM',
    status: 'Completed',
  },
  {
    id: 'vr-03',
    routeName: 'Cubbon Park Greenway ➔ MG Road Metro Canopy',
    city: 'Bengaluru',
    origin: 'Cubbon Park East Gate',
    destination: 'MG Road Boulevard',
    shadePercentage: 78,
    heatReduction: 26,
    distance: '1.4 km',
    travelTime: '15 min',
    visitedAt: '12 Oct, 11:20 AM',
    status: 'Completed',
  },
];

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>(() => user?.city || cityMetrics[0].city);
  const [telemetry, setTelemetry] = useState<Record<string, CityMetric>>(() => {
    const map: Record<string, CityMetric> = {};
    for (const m of cityMetrics) {
      map[m.city] = m;
    }
    return map;
  });
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AppTab>('map');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [reports, setReports] = useState<Report[]>(initialCitizenReports);
  const [authorityZones, setAuthorityZones] =
    useState<AuthorityZone[]>(initialAuthorityZones);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const UPVOTES_KEY_PREFIX = 'biocanopy_upvotes_';
  const [upvotedReportIds, setUpvotedReportIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${UPVOTES_KEY_PREFIX}${user?.email || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Synchronize upvoted IDs when active user changes
  useEffect(() => {
    const key = `${UPVOTES_KEY_PREFIX}${user?.email || 'guest'}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setUpvotedReportIds(JSON.parse(saved));
      } else {
        setUpvotedReportIds([]);
      }
    } catch {
      setUpvotedReportIds([]);
    }
  }, [user?.email]);

  const hasUserUpvoted = (id: string) => upvotedReportIds.includes(id);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [visitedRoutes, setVisitedRoutes] = useState<VisitedRoute[]>(() => {
    try {
      const saved = localStorage.getItem(ROUTES_HISTORY_KEY);
      return saved ? JSON.parse(saved) : defaultVisitedRoutes;
    } catch {
      return defaultVisitedRoutes;
    }
  });

  const addVisitedRoute = (newRoute: VisitedRoute) => {
    setVisitedRoutes((prev) => {
      const updated = [newRoute, ...prev.filter((r) => r.id !== newRoute.id)];
      try {
        localStorage.setItem(ROUTES_HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  const [selectedPreset, setSelectedPreset] =
    useState<AiConditionPreset>('peak_heat');
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [activeRouteId, setActiveRouteId] = useState<'cool' | 'fastest'>('cool');
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Load saved state from LocalStorage on mount and anchor to user's registered profile city
  useEffect(() => {
    try {
      const savedCity = localStorage.getItem(CITY_KEY);
      const savedReports = localStorage.getItem(REPORTS_KEY);
      const savedZones = localStorage.getItem(ZONES_KEY);
      const savedTheme = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null;
      const savedLang = localStorage.getItem(LANG_KEY) as Language | null;

      if (user?.city) {
        setSelectedCity(user.city);
      } else if (savedCity) {
        setSelectedCity(savedCity);
      }
      if (savedReports) setReports(JSON.parse(savedReports));
      if (savedZones) setAuthorityZones(JSON.parse(savedZones));
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        setTheme(savedTheme);
      }
      if (savedLang && (savedLang === 'en' || savedLang === 'hi' || savedLang === 'mr')) {
        setLanguage(savedLang);
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
  }, [user?.city]);

  // Synchronize active city when user switches city in Profile
  useEffect(() => {
    if (user?.city && user.city !== selectedCity) {
      setSelectedCity(user.city);
      try {
        localStorage.setItem(CITY_KEY, user.city);
      } catch {}
    }
  }, [user?.city]);

  // Fetch live community hazard reports from SQLite backend with user vote tracking
  useEffect(() => {
    const fetchBackendReports = async () => {
      try {
        const userIdentifier = user?.email || 'guest';
        const res = await fetch(`${API_REPORTS_URL}?userIdentifier=${encodeURIComponent(userIdentifier)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setReports(data);
            const serverVoted = data.filter((r: Report) => r.hasUpvoted).map((r: Report) => r.id);
            if (serverVoted.length > 0) {
              setUpvotedReportIds((prev) => {
                const merged = Array.from(new Set([...prev, ...serverVoted]));
                try {
                  localStorage.setItem(`${UPVOTES_KEY_PREFIX}${user?.email || 'guest'}`, JSON.stringify(merged));
                } catch {}
                return merged;
              });
            }
          }
        }
      } catch (err) {
        console.warn('Backend reports API offline, using cached data:', err);
      }
    };
    fetchBackendReports();
  }, [user?.email]);

  // Fetch live municipal tree-planting dispatches from SQLite backend
  useEffect(() => {
    let isMounted = true;
    const fetchDispatches = async () => {
      try {
        const res = await fetch(`${API_DISPATCHES_URL}?city=${selectedCity}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setAuthorityZones(data);
          }
        }
      } catch (err) {
        console.warn('Backend dispatches API offline, using cached zones:', err);
      }
    };
    fetchDispatches();
    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  // Fetch live telemetry for selected city from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchCityTelemetry = async () => {
      setIsLoadingTelemetry(true);
      try {
        const res = await fetch(`${API_TELEMETRY_URL}/${selectedCity}`);
        if (res.ok) {
          const liveData = await res.json();
          if (isMounted && liveData && liveData.city) {
            setTelemetry((prev) => ({
              ...prev,
              [selectedCity]: liveData,
            }));
          }
        }
      } catch (err) {
        console.warn(`Could not fetch live telemetry for ${selectedCity}:`, err);
      } finally {
        if (isMounted) setIsLoadingTelemetry(false);
      }
    };

    fetchCityTelemetry();
    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  const currentMetric =
    telemetry[selectedCity] ||
    (cityMetrics.find((c) => c.city === selectedCity) ?? cityMetrics[0]);

  // Sync theme class to document root
  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      } else {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
      }
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  // Sync language
  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, language);
    } catch (e) {
      // ignore
    }
  }, [language]);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CITY_KEY, selectedCity);
    } catch (e) {
      // ignore
    }
  }, [selectedCity]);

  useEffect(() => {
    try {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    } catch (e) {
      // ignore
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem(ZONES_KEY, JSON.stringify(authorityZones));
    } catch (e) {
      // ignore
    }
  }, [authorityZones]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3500);
  };

  const addReport = async (
    newReportData: Omit<Report, 'id' | 'submittedAt' | 'status' | 'source'>,
  ) => {
    const tempId = `rep-${Date.now().toString().slice(-4)}`;
    const optimisticReport: Report = {
      ...newReportData,
      id: tempId,
      submittedAt: 'Just now',
      status: 'Pending Review',
      source: 'Citizen Mobile',
      upvotes: 1,
    };

    setReports((prev) => [optimisticReport, ...prev]);

    // Send to backend API
    try {
      const token = localStorage.getItem('biocanopy-token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(API_REPORTS_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(newReportData),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          setReports((prev) =>
            prev.map((r) => (r.id === tempId ? data.report : r)),
          );
        }
      }
    } catch (err) {
      console.warn('Backend server offline, saved report in local state:', err);
    }

    // Also update authority priority queue for matching zone or add a new zone entry
    setAuthorityZones((prevZones) => {
      const existingZone = prevZones.find(
        (z) =>
          z.city === newReportData.city &&
          newReportData.locationName.toLowerCase().includes(z.zoneName.toLowerCase().slice(0, 5)),
      );

      if (existingZone) {
        return prevZones.map((z) =>
          z.id === existingZone.id
            ? {
                ...z,
                complaintCount: z.complaintCount + 1,
                lastReported: 'Just now',
              }
            : z,
        );
      }

      // If new hotspot, add to authority priority queue
      const newZone: AuthorityZone = {
        id: `zone-${Date.now().toString().slice(-4)}`,
        zoneName: newReportData.locationName,
        city: newReportData.city,
        complaintCount: 1,
        canopyDeficit: -24,
        currentCanopy: 12,
        surfaceTemp: 44.0,
        priorityRank: prevZones.length + 1,
        status: 'Needs Dispatch',
        targetSaplings: 150,
        lastReported: 'Just now',
      };

      return [newZone, ...prevZones];
    });

    showToast(
      `Hazard reported: "${newReportData.category}" saved to database & map.`,
      'success',
    );
  };

  const upvoteReport = async (id: string) => {
    // Constraint: One user can cast only one vote per report
    if (upvotedReportIds.includes(id)) {
      showToast('You have already upvoted this report. One vote per citizen.', 'info');
      return;
    }

    const storageKey = `${UPVOTES_KEY_PREFIX}${user?.email || 'guest'}`;
    const nextUpvoted = [...upvotedReportIds, id];
    setUpvotedReportIds(nextUpvoted);
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextUpvoted));
    } catch {}

    // Optimistic UI update: increment count by exactly 1 and mark as voted
    setReports((prev) =>
      prev.map((rep) =>
        rep.id === id ? { ...rep, upvotes: (rep.upvotes || 0) + 1, hasUpvoted: true } : rep,
      ),
    );

    try {
      const userIdentifier = user?.email || 'guest';
      const res = await fetch(`${API_REPORTS_URL}/${id}/upvote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIdentifier }),
      });

      if (res.status === 409) {
        showToast('You have already cast a vote for this report.', 'info');
        return;
      }

      showToast('Report upvoted! Priority boosted.', 'success');
    } catch (err) {
      console.warn('Failed to upvote on server:', err);
    }
  };

  const deleteReport = async (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    try {
      await fetch(`${API_REPORTS_URL}/${id}`, {
        method: 'DELETE',
      });
      showToast('Report deleted from database.', 'info');
    } catch (err) {
      console.warn('Failed to delete on server:', err);
    }
  };

  const updateReportStatus = async (id: string, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((rep) => (rep.id === id ? { ...rep, status } : rep)),
    );
    try {
      await fetch(`http://localhost:5000/api/admin/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      showToast(`Report status updated to "${status}".`, 'info');
    } catch (err) {
      console.warn('Failed to update status on server:', err);
    }
  };

  const dispatchPlantingTask = async (zoneId: string) => {
    const dispatchNum = `ORD-${selectedCity.slice(0, 3).toUpperCase()}-2026-${Math.floor(
      100 + Math.random() * 900,
    )}`;

    setAuthorityZones((prev) =>
      prev.map((zone) =>
        zone.id === zoneId
          ? {
              ...zone,
              status: 'Task Dispatched',
              dispatchId: dispatchNum,
            }
          : zone,
      ),
    );

    // Also update any pending reports in this city
    setReports((prev) =>
      prev.map((rep) =>
        rep.city === selectedCity && rep.status === 'Pending Review'
          ? { ...rep, status: 'Task Dispatched' }
          : rep,
      ),
    );

    // Persist status change to backend SQLite
    try {
      await fetch(`${API_DISPATCHES_URL}/${zoneId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Task Dispatched' }),
      });
    } catch (err) {
      console.warn('Failed to sync dispatch status to backend:', err);
    }

    showToast(
      `Tree-Planting Task Dispatched! Order #${dispatchNum} logged for municipal field squad.`,
      'success',
    );
  };

  const value = useMemo<AppStateValue>(
    () => ({
      selectedCity,
      setSelectedCity,
      currentMetric,
      isLoadingTelemetry,
      activeTab,
      setActiveTab,
      language,
      setLanguage,
      theme,
      setTheme,
      toggleTheme,
      reports,
      upvotedReportIds,
      hasUserUpvoted,
      addReport,
      upvoteReport,
      deleteReport,
      updateReportStatus,
      authorityZones,
      dispatchPlantingTask,
      isReportModalOpen,
      setIsReportModalOpen,
      isProfileOpen,
      setIsProfileOpen,
      visitedRoutes,
      addVisitedRoute,
      selectedPreset,
      setSelectedPreset,
      isNavigating,
      setIsNavigating,
      activeRouteId,
      setActiveRouteId,
      toast,
      showToast,
    }),
    [
      selectedCity,
      currentMetric,
      isLoadingTelemetry,
      activeTab,
      language,
      theme,
      reports,
      upvotedReportIds,
      authorityZones,
      isReportModalOpen,
      isProfileOpen,
      visitedRoutes,
      selectedPreset,
      isNavigating,
      activeRouteId,
      toast,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return context;
}
