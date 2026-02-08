import { useState, useEffect, useCallback } from 'react';
import { Plus, Car, RefreshCw, Search, Eye, MoreVertical, ArrowUpDown } from 'lucide-react';
import VehicleRegistrationForm from '../components/dashboard/VehicleRegistrationForm';
import TableSkeleton from '../components/common/TableSkeleton';
import StatsSkeleton from '../components/common/StatsSkeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const DepositosPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [vehiculos, setVehiculos] = useState([]);
  const [stats, setStats] = useState({
    totalVehiculos: 0,
    ingresosHoy: 0,
    liberadosMes: 0,
    totalDepositos: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      
      const [vehiculosRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/vehiculos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/vehiculos/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const vehiculosData = await vehiculosRes.json();
      const statsData = await statsRes.json();

      if (vehiculosData.success) {
        setVehiculos(vehiculosData.data);
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

  const filteredVehiculos = vehiculos.filter(v => 
    v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.marcaTipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.folioProceso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      'ROBADO': 'bg-red-100 text-red-700',
      'DECOMISADO': 'bg-orange-100 text-orange-700',
      'OBSOLETO': 'bg-gray-100 text-gray-700',
      'SINIESTRADO': 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Depósitos</h1>
          <p className="text-gray-500">Registra y administra vehículos en depósito.</p>
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
            Nuevo Registro Vehicular
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
                <Car className="w-6 h-6 text-(--color-primary)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVehiculos}</p>
                <p className="text-sm text-gray-500">Vehículos Activos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Car className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.ingresosHoy}</p>
                <p className="text-sm text-gray-500">Ingresos Hoy</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Car className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDepositos}</p>
                <p className="text-sm text-gray-500">Depósitos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Car className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.liberadosMes}</p>
                <p className="text-sm text-gray-500">Bajas Este Mes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicles Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900">Vehículos Registrados</h2>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por placa, VIN, marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none w-full md:w-80"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} columns={7} />
        ) : filteredVehiculos.length === 0 ? (
          <div className="p-12 text-center">
            <Car className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'No se encontraron vehículos con esos criterios.' : 'No hay vehículos registrados.'}
            </p>
            <p className="text-sm text-gray-400">Haz clic en "Nuevo Registro Vehicular" para comenzar.</p>
          </div>
        ) : (

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                      Folio <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca/Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VIN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Ingreso</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVehiculos.map((vehiculo) => (
                  <tr key={vehiculo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-(--color-primary)">{vehiculo.folioProceso}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{vehiculo.placa}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{vehiculo.marcaTipo}</span>
                      <span className="text-xs text-gray-400 ml-2">({vehiculo.anio})</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-mono text-gray-500">{vehiculo.vin}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehiculo.estatusLegal)}`}>
                        {vehiculo.estatusLegal}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(vehiculo.fechaIngreso).toLocaleDateString('es-MX')}
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
        {filteredVehiculos.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Mostrando {filteredVehiculos.length} de {vehiculos.length} vehículos
            </p>
          </div>
        )}
      </div>

      {/* Vehicle Registration Form Modal */}
      <VehicleRegistrationForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default DepositosPage;
