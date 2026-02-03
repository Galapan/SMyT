import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import DepositosPage from './pages/DepositosPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          
          {/* Depositos with multi-step form */}
          <Route path="depositos" element={<DepositosPage />} />
          <Route path="auditoria" element={<div className="p-8"><h2 className="text-2xl font-bold mb-4">Auditoría Global</h2><p>Módulo en desarrollo...</p></div>} />
          <Route path="settings" element={<div className="p-8"><h2 className="text-2xl font-bold mb-4">Configuración</h2><p>Módulo en desarrollo...</p></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
