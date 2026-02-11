import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Warehouse, Car, Key, Plus, RefreshCw } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import AuditSearch from '../components/dashboard/AuditSearch';
import DepotTable from '../components/dashboard/DepotTable';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalVehiculos: 0,
    ingresosHoy: 0,
    liberadosMes: 0,
    totalDepositos: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/vehiculos/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-500">Bienvenido de vuelta, gestiona los depósitos e inventario.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchStats}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center font-medium"
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button 
            onClick={() => navigate('/admin/vehicles')}
            className="px-4 py-2 bg-(--color-primary) hover:bg-violet-900 text-white rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center font-medium"
          >
            <Plus size={20} className="mr-2" />
            Nuevo Depósito
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <StatCard 
          title="Total de Vehículos" 
          value={stats.totalVehiculos.toString()} 
          icon={Warehouse}
          color="bg-[var(--color-primary)]"
          trend="up"
          trendValue={`${stats.totalDepositos} depósitos`}
          loading={loading}
        />
        <StatCard 
          title="Vehículos Ingresados Hoy" 
          value={stats.ingresosHoy.toString()} 
          icon={Car}
          color="bg-[var(--color-verde)]"
          trend="up"
          trendValue="Nuevos hoy"
          loading={loading}
        />
        <StatCard 
          title="Vehículos Liberados" 
          value={stats.liberadosMes.toString()} 
          icon={Key}
          color="bg-[var(--color-rosa)]"
          trend="down"
          trendValue="Este mes"
          loading={loading}
        />
      </div>

      {/* Global Search Section */}
      <div className="shrink-0">
        <AuditSearch />
      </div>

      {/* Depot Management Section */}
      <div className="flex-1 min-h-0">
        <DepotTable loading={loading} />
      </div>
    </div>
  );

};

export default AdminDashboard;
