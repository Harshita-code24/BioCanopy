import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  cityMetrics,
  initialAuthorityZones,
  initialCitizenReports,
} from '../data/mockData';
import type {
  AiConditionPreset,
  AppTab,
  AuthorityZone,
  Language,
  Report,
  ReportStatus,
} from '../types';

type ToastInfo = {
  message: string;
  type: 'success' | 'info';
};

type AppStateValue = {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  reports: Report[];
  addReport: (
    report: Omit<Report, 'id' | 'submittedAt' | 'status' | 'source'>,
  ) => void;
  updateReportStatus: (id: string, status: ReportStatus) => void;
  authorityZones: AuthorityZone[];
  dispatchPlantingTask: (zoneId: string) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
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

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<string>(cityMetrics[0].city);
  const [activeTab, setActiveTab] = useState<AppTab>('map');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [reports, setReports] = useState<Report[]>(initialCitizenReports);
  const [authorityZones, setAuthorityZones] =
    useState<AuthorityZone[]>(initialAuthorityZones);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] =
    useState<AiConditionPreset>('peak_heat');
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [activeRouteId, setActiveRouteId] = useState<'cool' | 'fastest'>('cool');
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Load saved state from LocalStorage on mount
  useEffect(() => {
    try {
      const savedCity = localStorage.getItem(CITY_KEY);
      const savedReports = localStorage.getItem(REPORTS_KEY);
      const savedZones = localStorage.getItem(ZONES_KEY);
      const savedTheme = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null;
      const savedLang = localStorage.getItem(LANG_KEY) as Language | null;

      if (savedCity) setSelectedCity(savedCity);
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
  }, []);

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

  const addReport = (
    newReportData: Omit<Report, 'id' | 'submittedAt' | 'status' | 'source'>,
  ) => {
    const newReport: Report = {
      ...newReportData,
      id: `rep-${Date.now().toString().slice(-4)}`,
      submittedAt: 'Just now',
      status: 'Pending Review',
      source: 'Citizen Mobile',
      upvotes: 1,
    };

    setReports((prev) => [newReport, ...prev]);

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
      `Hazard reported: "${newReportData.category}" added to public map & priority queue.`,
      'success',
    );
  };

  const updateReportStatus = (id: string, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((rep) => (rep.id === id ? { ...rep, status } : rep)),
    );
    showToast(`Report status updated to "${status}".`, 'info');
  };

  const dispatchPlantingTask = (zoneId: string) => {
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

    showToast(
      `Tree-Planting Task Dispatched! Order #${dispatchNum} logged for municipal field squad.`,
      'success',
    );
  };

  const value = useMemo<AppStateValue>(
    () => ({
      selectedCity,
      setSelectedCity,
      activeTab,
      setActiveTab,
      language,
      setLanguage,
      theme,
      setTheme,
      toggleTheme,
      reports,
      addReport,
      updateReportStatus,
      authorityZones,
      dispatchPlantingTask,
      isReportModalOpen,
      setIsReportModalOpen,
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
      activeTab,
      language,
      theme,
      reports,
      authorityZones,
      isReportModalOpen,
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
