import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Login from './components/auth/Login';
import AdminLayout from './layouts/AdminLayout';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AuditDashboard = lazy(() => import('./pages/AuditDashboard'));
const AuditConcesionarioDetail = lazy(() => import('./pages/AuditConcesionarioDetail'));
const VehicleAdminDetail = lazy(() => import('./pages/VehicleAdminDetail'));
const VehiclesPage = lazy(() => import('./pages/VehiclesPage'));
const DepositsPage = lazy(() => import('./pages/DepositsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function App() {
  const suspenseFallback = (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-900"></div>
    </div>
  );

  return (
    <BrowserRouter>
      <Suspense fallback={suspenseFallback}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
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
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
