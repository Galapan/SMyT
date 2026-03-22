import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Core layout
import DashboardLayout from './layouts/Layout';

// Static imports for instant navigation
import LandingPage from './pages/LandingPage';
import Login from './components/auth/Login';
import Verification from './components/auth/Verification';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import SecurityAlert from './pages/SecurityAlert';

import Dashboard from './pages/Dashboard';
import AuditDashboard from './pages/AuditDashboard';
import AuditConcesionarioDetail from './pages/AuditConcesionarioDetail';
import VehicleDetail from './pages/VehicleDetail';
import VehiclesPage from './pages/VehiclesPage';
import DepositsPage from './pages/DepositsPage';
import SettingsPage from './pages/SettingsPage';
import AccountsPage from './pages/AccountsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent refetching when switching tabs
      retry: 1, // Optional: only retry once
      staleTime: 5 * 60 * 1000, // Optional: data is fresh for 5 mins
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/security" element={<SecurityAlert />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />

            {/* Deposits */}
            <Route path="deposits" element={<DepositsPage />} />

            {/* Vehicles with multi-step form */}
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="auditoria" element={<AuditDashboard />} />
            <Route path="auditoria/:id" element={<AuditConcesionarioDetail />} />
            <Route path="auditoria/vehiculo/:id" element={<VehicleDetail />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
