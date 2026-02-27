import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Warehouse, Users, Car, Phone, Mail, User, ShieldCheck, MapPin, Search } from 'lucide-react';
import dayjs from 'dayjs';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AuditConcesionarioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deposito, setDeposito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper de ocupación
  const ocupacion = deposito && deposito.capacidad > 0 
    ? Math.round((deposito.vehiculos?.length / deposito.capacidad) * 100) 
    : 0;

  const getOcupacionColor = (pct) => {
    if (pct >= 90) return 'text-red-600 bg-red-50 border-red-200';
    if (pct >= 75) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  useEffect(() => {
    const fetchDepositoInfo = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/depositos/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setDeposito(data.data);
        } else {
          navigate('/admin/auditoria');
        }
      } catch (error) {
        console.error('Error fetching deposito detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDepositoInfo();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="h-full flex flex-col space-y-6">
        {/* Skeleton Header */}
        <div className="h-16 w-full bg-white rounded-xl border border-gray-100 flex items-center px-6 animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-md mr-4"></div>
            <div className="w-48 h-6 bg-gray-200 rounded-md"></div>
        </div>
        {/* Skeleton Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 h-96 bg-white rounded-xl border border-gray-100 animate-pulse"></div>
            <div className="lg:col-span-2 h-full bg-white rounded-xl border border-gray-100 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!deposito) return null;

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      
      {/* Header */}
      <div className="shrink-0 bg-white rounded-xl border border-gray-200 p-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/auditoria')}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            title="Volver a la Auditoría Global"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{deposito.nombre}</h1>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getOcupacionColor(ocupacion)}`}>
                {ocupacion}% Ocupado
              </span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
              <MapPin size={14} className="text-gray-400" />
              {deposito.direccion}, {deposito.municipio}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-y-auto pb-6 custom-scrollbar">
        
        {/* Columna Izquierda: Detalles del Depósito y Propietario */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card Propietario / Representante Legal */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
              <User size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-800">Representante Legal</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Nombre</p>
                <p className="font-medium text-gray-900">{deposito.nombrePropietario}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">RFC</p>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded inline-block border border-gray-100">{deposito.rfc}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Teléfono</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                    <Phone size={14} className="text-gray-400" />
                    {deposito.telefonoPropietario}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Cuentas Digitales Vinculadas */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-(--color-primary)" />
                <h3 className="font-semibold text-gray-800">Cuentas Digitales</h3>
              </div>
              <span className="bg-white border border-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {deposito.usuarios?.length || 0}
              </span>
            </div>
            <div className="p-3 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {!deposito.usuarios || deposito.usuarios.length === 0 ? (
                <p className="text-sm text-center text-gray-500 py-4">Sin cuentas vinculadas</p>
              ) : (
                deposito.usuarios.map(user => (
                   <div key={user.id} className="flex items-center p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                    <div className="h-10 w-10 shrink-0 rounded-full border border-gray-200 bg-white overflow-hidden">
                      <img 
                        src={(user.fotoUrl && !user.fotoUrl.includes('name=User')) ? user.fotoUrl : `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(user.nombre + ' ' + user.apellido)}`} 
                        alt="avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.nombre} {user.apellido}</p>
                      <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                        <Mail size={12} /> {user.email}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Inventario de Vehículos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gray-50/30">
              <div className="flex items-center gap-2">
                <Car size={20} className="text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Inventario Registrado</h3>
                <span className="text-sm text-gray-500 font-medium ml-2">
                  <span className="text-gray-900 font-bold">{deposito.vehiculos?.length || 0}</span> / {deposito.capacidad} max
                </span>
              </div>
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Buscar por placa, VIN o marca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) transition-all"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-x-auto min-h-75">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                    <th className="px-6 py-4 font-semibold">Folio SMyT</th>
                    <th className="px-6 py-4 font-semibold">Vehículo</th>
                    <th className="px-6 py-4 font-semibold">Info Legal</th>
                    <th className="px-6 py-4 font-semibold">Ingreso</th>
                    <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {!deposito.vehiculos || deposito.vehiculos.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <Car size={32} className="text-gray-300 mb-3" />
                          <p className="font-medium text-gray-900">No hay vehículos registrados</p>
                          <p className="text-sm text-gray-500 mt-1">Este concesionario no cuenta con inventario activo.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    deposito.vehiculos
                      .filter(v => 
                        (v.placa && v.placa.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (v.vin && v.vin.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (v.marcaTipo && v.marcaTipo.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (v.folioProceso && v.folioProceso.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .map(v => (
                      <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="inline-flex font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 border border-gray-200 rounded">
                            {v.folioProceso}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{v.marcaTipo}</div>
                          <div className="text-xs text-gray-500 mt-0.5">Placa: <span className="font-semibold text-gray-700">{v.placa || 'N/A'}</span></div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              v.estatusLegal === 'ROBADO' ? 'bg-red-100 text-red-700 border border-red-200' :
                              v.estatusLegal === 'DECOMISADO' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                              v.estatusLegal === 'SINIESTRADO' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                              'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            {v.estatusLegal}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 font-medium">
                            {dayjs(v.fechaIngreso).format('DD MMM YYYY')}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {dayjs(v.fechaIngreso).format('HH:mm a')}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => navigate(`/admin/auditoria/vehiculo/${v.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 hover:text-(--color-primary) hover:bg-violet-50 hover:border-violet-200 border border-gray-200 rounded-lg text-xs font-semibold transition-colors focus:ring-2 focus:ring-(--color-primary)/20 outline-none"
                            title="Ver Expediente de Registro"
                          >
                            <Search size={14} />
                            <span>Ver Expediente</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuditConcesionarioDetail;
