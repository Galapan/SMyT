import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Core layout
import DashboardLayout from './layouts/Layout';

// Refactoring all pages to use React.lazy for automatic code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./components/auth/Login'));
const Verification = lazy(() => import('./components/auth/Verification'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword'));
const SecurityAlert = lazy(() => import('./pages/SecurityAlert'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const AuditDashboard = lazy(() => import('./pages/AuditDashboard'));
const AuditConcesionarioDetail = lazy(() => import('./pages/AuditConcesionarioDetail'));
const VehicleDetail = lazy(() => import('./pages/VehicleDetail'));
const VehiclesPage = lazy(() => import('./pages/VehiclesPage'));
const DepositsPage = lazy(() => import('./pages/DepositsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AccountsPage = lazy(() => import('./pages/AccountsPage'));

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
  const suspenseFallback = (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-900"></div>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Suspense fallback={suspenseFallback}>
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
      </Suspense>
    </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
