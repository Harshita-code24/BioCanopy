import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AdminPage } from './pages/AdminPage';
import { AdvisorPage } from './pages/AdvisorPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { OpenDataPage } from './pages/OpenDataPage';
import { ReportsPage } from './pages/ReportsPage';
import { UserAuthPage } from './pages/UserAuthPage';
import { AppStateProvider } from './store/AppStateContext';
import { AuthProvider, useAuth } from './store/AuthContext';

function ProtectedRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
}

function RootRedirect() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Dedicated Auth Route */}
        <Route path="/login" element={<UserAuthPage />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route path="/admin-login" element={<Navigate to="/login" replace />} />

        {/* Protected App Routes under AppLayout */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/open-data" element={<OpenDataPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/advisor" element={<AdvisorPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* Root and Fallback */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <AppRoutes />
      </AppStateProvider>
    </AuthProvider>
  );
}
