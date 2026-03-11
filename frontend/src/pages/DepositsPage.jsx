import { useReducer, useEffect, useCallback } from "react";
import {
  Plus,
  Warehouse,
  RefreshCw,
  Search,
  Eye,
  MoreVertical,
  ArrowUpDown,
} from "lucide-react";
import DepositRegistrationForm from "../components/dashboard/DepositRegistrationForm";
import TableSkeleton from "../components/common/TableSkeleton";
import StatsSkeleton from "../components/common/StatsSkeleton";

const API_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : import.meta.env.DEV
      ? "http://localhost:3000"
      : "";

const initialState = {
  isFormOpen: false,
  depositos: [],
  stats: {
    totalDepositos: 0,
    depositosActivos: 0,
    capacidadTotal: 0,
    vehiculosEnDepositos: 0,
  },
  loading: true,
  searchTerm: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_DATA":
      return {
        ...state,
        depositos:
          action.payload.depositos !== undefined
            ? action.payload.depositos
            : state.depositos,
        stats:
          action.payload.stats !== undefined
            ? action.payload.stats
            : state.stats,
      };
    case "SET_FORM_OPEN":
      return { ...state, isFormOpen: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
}

const DepositsPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isFormOpen, depositos, stats, loading, searchTerm } = state;

  const fetchData = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");

      const [depositosRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/depositos`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/depositos/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [depositosData, statsData] = await Promise.all([
        depositosRes.json(),
        statsRes.json()
      ]);

      dispatch({
        type: "SET_DATA",
        payload: {
          depositos: depositosData.success ? depositosData.data : undefined,
          stats: statsData.success ? statsData.data : undefined,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormSuccess = () => {
    fetchData();
  };

  const filteredDepositos = depositos.filter(
    (d) =>
      d.nombrePropietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.numero.includes(searchTerm),
  );

  const getStatusColor = (status) => {
    const colors = {
      ACTIVO: "bg-green-100 text-green-700",
      INACTIVO: "bg-gray-100 text-gray-700",
      SUSPENDIDO: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Depósitos
          </h1>
          <p className="text-gray-500">
            Registra y administra depósitos vehiculares.
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
          <button
            onClick={fetchData}
            className="flex-1 md:flex-none px-3 py-2 sm:px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center font-medium text-sm sm:text-base"
          >
            <RefreshCw
              size={18}
              className={`mr-1.5 sm:mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </button>
          <button
            onClick={() => dispatch({ type: "SET_FORM_OPEN", payload: true })}
            className="flex-1 md:flex-none px-3 py-2 sm:px-4 bg-(--color-primary) hover:bg-violet-900 text-white rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center font-medium text-sm sm:text-base"
          >
            <Plus size={20} className="mr-1.5 sm:mr-2" />
            Registrar
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {loading ? (
        <StatsSkeleton cards={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-violet-100 rounded-lg">
                <Warehouse className="w-6 h-6 text-(--color-primary)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalDepositos}
                </p>
                <p className="text-sm text-gray-500">Depósitos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Warehouse className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.depositosActivos}
                </p>
                <p className="text-sm text-gray-500">Activos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Warehouse className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.capacidadTotal}
                </p>
                <p className="text-sm text-gray-500">Capacidad Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Warehouse className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.vehiculosEnDepositos}
                </p>
                <p className="text-sm text-gray-500">Vehículos en Depósitos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deposits Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900">
              Depósitos Registrados
            </h2>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar por concesionario, municipio..."
                value={searchTerm}
                onChange={(e) =>
                  dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
                }
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
              {searchTerm
                ? "No se encontraron depósitos con esos criterios."
                : "No hay depósitos registrados."}
            </p>
            <p className="text-sm text-gray-400">
              Haz clic en "Registrar" para comenzar.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Table view for md+ screens */}
            <table className="hidden md:table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                      No. <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concesionario
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Municipio
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estatus
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDepositos.map((deposito) => (
                  <tr
                    key={deposito.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-(--color-primary)">
                        {deposito.numero}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {deposito.nombrePropietario}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {deposito.municipio}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <span className="text-sm text-gray-500">
                        {deposito.direccion}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(deposito.activo ? "ACTIVO" : "INACTIVO")}`}
                      >
                        {deposito.activo ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right">
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

            {/* Card view for smaller screens */}
            <div className="md:hidden flex flex-col divide-y divide-gray-100">
              {filteredDepositos.map((deposito) => (
                <div
                  key={deposito.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Top row: Name, Number, Status */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="pr-2">
                      <span className="text-sm font-medium text-(--color-primary) mb-0.5 block">
                        #{deposito.numero}
                      </span>
                      <div className="text-sm font-semibold text-gray-900 leading-tight">
                        {deposito.nombrePropietario}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${getStatusColor(deposito.activo ? "ACTIVO" : "INACTIVO")}`}
                    >
                      {deposito.activo ? "ACTIVO" : "INACTIVO"}
                    </span>
                  </div>

                  {/* Middle row: Info details */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <p className="font-semibold text-gray-500 mb-0.5">
                        Municipio
                      </p>
                      <p
                        className="text-gray-900 truncate"
                        title={deposito.municipio}
                      >
                        {deposito.municipio}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500 mb-0.5">
                        Dirección
                      </p>
                      <p
                        className="text-gray-900 truncate"
                        title={deposito.direccion}
                      >
                        {deposito.direccion}
                      </p>
                    </div>
                  </div>

                  {/* Bottom row: Actions */}
                  <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-gray-50">
                    <button
                      className="p-1.5 text-gray-400 hover:text-(--color-primary) hover:bg-violet-50 rounded-md transition-colors"
                      title="Ver Detalles"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      title="Más opciones"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table Footer */}
        {filteredDepositos.length > 0 && (
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Mostrando {filteredDepositos.length} de {depositos.length}{" "}
              depósitos
            </p>
          </div>
        )}
      </div>

      {/* Deposit Registration Form Modal */}
      <DepositRegistrationForm
        isOpen={isFormOpen}
        onClose={() => dispatch({ type: "SET_FORM_OPEN", payload: false })}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default DepositsPage;
