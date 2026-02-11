import { useState, useEffect, useCallback } from 'react';
import { Plus, Warehouse, RefreshCw, Search, Eye, MoreVertical, ArrowUpDown } from 'lucide-react';
import DepositRegistrationForm from '../components/dashboard/DepositRegistrationForm';
import TableSkeleton from '../components/common/TableSkeleton';
import StatsSkeleton from '../components/common/StatsSkeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const DepositsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [depositos, setDepositos] = useState([]);
  const [stats, setStats] = useState({
    totalDepositos: 0,
    depositosActivos: 0,
    capacidadTotal: 0,
    vehiculosEnDepositos: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      
      const [depositosRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/depositos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/depositos/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const depositosData = await depositosRes.json();
      const statsData = await statsRes.json();

      if (depositosData.success) {
        setDepositos(depositosData.data);
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormSuccess = () => {
    fetchData();
  };

  const filteredDepositos = depositos.filter(d => 
    d.nombrePropietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.numero.includes(searchTerm)
  );

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVO': 'bg-green-100 text-green-700',
      'INACTIVO': 'bg-gray-100 text-gray-700',
      'SUSPENDIDO': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Depósitos</h1>
          <p className="text-gray-500">Registra y administra depósitos vehiculares.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center font-medium"
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-(--color-primary) hover:bg-violet-900 text-white rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center font-medium"
          >
            <Plus size={20} className="mr-2" />
            Registrar
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {loading ? (
        <StatsSkeleton cards={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-violet-100 rounded-lg">
                <Warehouse className="w-6 h-6 text-(--color-primary)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDepositos}</p>
                <p className="text-sm text-gray-500">Depósitos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Warehouse className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.depositosActivos}</p>
                <p className="text-sm text-gray-500">Activos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Warehouse className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.capacidadTotal}</p>
                <p className="text-sm text-gray-500">Capacidad Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Warehouse className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.vehiculosEnDepositos}</p>
                <p className="text-sm text-gray-500">Vehículos en Depósitos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deposits Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900">Depósitos Registrados</h2>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por concesionario, municipio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none w-full md:w-80"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} columns={6} />
        ) : filteredDepositos.length === 0 ? (
          <div className="p-12 text-center">
            <Warehouse className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'No se encontraron depósitos con esos criterios.' : 'No hay depósitos registrados.'}
            </p>
            <p className="text-sm text-gray-400">Haz clic en "Registrar" para comenzar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                      No. <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concesionario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDepositos.map((deposito) => (
                  <tr key={deposito.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-(--color-primary)">{deposito.numero}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{deposito.nombrePropietario}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{deposito.municipio}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{deposito.direccion}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(deposito.activo ? 'ACTIVO' : 'INACTIVO')}`}>
                        {deposito.activo ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-(--color-primary) hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {filteredDepositos.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Mostrando {filteredDepositos.length} de {depositos.length} depósitos
            </p>
          </div>
        )}
      </div>

      {/* Deposit Registration Form Modal */}
      <DepositRegistrationForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default DepositsPage;
