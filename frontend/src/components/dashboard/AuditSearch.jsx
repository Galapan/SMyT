import { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

const AuditSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    placa: '',
    vin: '',
    fechaInicio: '',
    fechaFin: '',
    estatusLegal: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchParams);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
      <div className="flex items-center mb-4 sm:mb-5">
        <div className="p-2 sm:p-2.5 bg-(--color-secondary)/30 rounded-lg mr-3 shrink-0">
          <Search className="text-(--color-primary) w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Auditoría Global</h2>
          <p className="text-sm text-gray-500">Busca vehículos en todo el inventario de la red.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Placa */}
        <div className="relative">
          <label htmlFor="placa" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Placa
          </label>
          <input
            id="placa"
            type="text"
            name="placa"
            value={searchParams.placa}
            onChange={handleChange}
            placeholder="ABC-123"
            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border-gray-200 border rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none transition-all motion-reduce:transition-none uppercase"
          />
        </div>

        {/* NIV (VIN) */}
        <div className="relative">
          <label htmlFor="vin" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            NIV (VIN)
          </label>
          <input
            id="vin"
            type="text"
            name="vin"
            value={searchParams.vin}
            onChange={handleChange}
            placeholder="17 dígitos..."
            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border-gray-200 border rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none transition-all motion-reduce:transition-none uppercase"
            maxLength={17}
          />
        </div>

        {/* Rango de Fechas */}
        <div className="relative">
          <label htmlFor="fechaInicio" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Fecha de Ingreso
          </label>
          <div className="relative flex items-center bg-gray-50 border-gray-200 border rounded-lg focus-within:ring-2 focus-within:ring-(--color-primary) focus-within:border-transparent transition-all motion-reduce:transition-none">
             <Calendar size={18} className="absolute left-3 text-gray-400 pointer-events-none" />
             <input
              id="fechaInicio"
              type="date"
              name="fechaInicio"
              value={searchParams.fechaInicio}
              onChange={handleChange}
              className="w-full pl-10 pr-2 py-2.5 bg-transparent outline-none text-sm text-gray-700"
            />
          </div>
        </div>

        {/* Estatus Legal */}
        <div className="relative">
          <label htmlFor="estatusLegal" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Estatus Legal
          </label>
          <div className="relative">
            <select 
              id="estatusLegal"
              name="estatusLegal"
              value={searchParams.estatusLegal}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-gray-200 border rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none transition-all motion-reduce:transition-none appearance-none text-gray-600"
            >
              <option value="">Todos</option>
              <option value="ROBADO">Robado</option>
              <option value="DECOMISADO">Decomisado</option>
              <option value="SINIESTRADO">Siniestrado</option>
              <option value="OBSOLETO">Obsoleto</option>
            </select>
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleSearch}
          className="px-6 py-2.5 bg-(--color-primary) hover:opacity-90 text-white font-medium rounded-lg shadow-sm transition-all motion-reduce:transition-none active:scale-95 flex items-center"
        >
          <Search size={18} className="mr-2" />
          Buscar Vehículos
        </button>
      </div>
    </div>
  );
};

export default AuditSearch;
