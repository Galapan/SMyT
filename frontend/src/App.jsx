import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/LandingPage';
import Login from './components/auth/Login';
import Verification from './components/auth/Verification';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import SecurityAlert from './pages/SecurityAlert';
import AdminLayout from './layouts/AdminLayout';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AuditDashboard = lazy(() => import('./pages/AuditDashboard'));
const AuditConcesionarioDetail = lazy(() => import('./pages/AuditConcesionarioDetail'));
const VehicleAdminDetail = lazy(() => import('./pages/VehicleAdminDetail'));
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
      <BrowserRouter>
        <Suspense fallback={suspenseFallback}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/security" element={<SecurityAlert />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            
            {/* Deposits */}
            <Route path="deposits" element={<DepositsPage />} />
            
            {/* Vehicles with multi-step form */}
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="auditoria" element={<AuditDashboard />} />
            <Route path="auditoria/:id" element={<AuditConcesionarioDetail />} />
            <Route path="auditoria/vehiculo/:id" element={<VehicleAdminDetail />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
