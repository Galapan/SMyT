import { useState, useEffect } from 'react';
import { RefreshCw, Search, Warehouse, Users, Car } from 'lucide-react';
import AuditConcesionarioCard from '../components/dashboard/Audit/AuditConcesionarioCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AuditDashboard = () => {
  const [depositos, setDepositos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAuditData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/depositos/audit`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDepositos(data.data);
      }
    } catch (error) {
      console.error('Error fetching audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  const filteredDepositos = depositos.filter(dep => 
    dep.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dep.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dep.nombrePropietario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auditoría Global</h1>
          <p className="text-gray-500 text-sm mt-1">Supervisión en tiempo real de concesionarios y cuentas vinculadas.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Buscar concesionario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) transition-all"
            />
          </div>
          <button 
            onClick={fetchAuditData}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center font-medium shadow-sm active:scale-95"
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refrescar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-full h-64 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between animate-pulse">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="w-20 h-6 bg-gray-200 rounded-md"></div>
                  </div>
                  <div className="w-3/4 h-6 bg-gray-200 rounded-md mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded-md"></div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                  <div>
                    <div className="w-16 h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="w-24 h-5 bg-gray-200 rounded"></div>
                  </div>
                  <div>
                    <div className="w-16 h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="w-24 h-5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDepositos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <Warehouse size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No hay concesionarios</h3>
            <p className="text-gray-500 max-w-sm">No se encontraron depósitos que coincidan con tu búsqueda actual.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepositos.map(deposito => (
              <AuditConcesionarioCard key={deposito.id} deposito={deposito} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditDashboard;
