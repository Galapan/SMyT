import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AuditDashboard from './pages/AuditDashboard';
import AuditConcesionarioDetail from './pages/AuditConcesionarioDetail';
import VehicleAdminDetail from './pages/VehicleAdminDetail';
import VehiclesPage from './pages/VehiclesPage';
import DepositsPage from './pages/DepositsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
