import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, UserPlus, Loader2, Check, AlertCircle, Search, Link as LinkIcon, User } from "lucide-react";
import FormInput from "../VehicleRegistrationForm/components/FormFields/FormInput";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const AddAccountModal = ({ isOpen, onClose, onSuccess, depositoId, depositoNombre }) => {
  const [activeTab, setActiveTab] = useState("nuevo"); // 'nuevo' o 'existente'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  // Tab: Nuevo
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Tab: Existente
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === 'existente') {
      fetchAvailableUsers();
    }
  }, [isOpen, activeTab]);

  const fetchAvailableUsers = async () => {
    setLoadingUsers(true);
    setError("");
    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/concesionarios/disponibles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAvailableUsers(data.data);
      } else {
        throw new Error(data.message || "Error al obtener usuarios disponibles");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido";

    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setError("");
    setSelectedUserId(null);
    setSearchTerm("");
    setActiveTab("nuevo");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === "nuevo" && !validateForm()) return;
    if (activeTab === "existente" && !selectedUserId) {
      setError("Por favor selecciona un concesionario de la lista");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      if (!token) throw new Error("Sesión expirada. Inicie sesión nuevamente.");

      if (activeTab === "nuevo") {
        const response = await fetch(`${API_URL}/api/users/concesionario`, {
          method: "POST",
          headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...formData, depositoId, rol: "USUARIO_CONCESIONARIO" }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al crear la cuenta");
      } else {
        const response = await fetch(`${API_URL}/api/users/${selectedUserId}/deposito`, {
          method: "PUT",
          headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ depositoId }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al vincular la cuenta");
      }

      resetForm();
      onClose();
      if (onSuccess) onSuccess();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const filteredUsers = availableUsers.filter(u => 
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-800/40 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up-fade flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 text-(--color-primary) rounded-xl">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Añadir Cuenta</h2>
              <p className="text-xs text-gray-500 font-medium truncate max-w-50 sm:max-w-xs " title={depositoNombre}>
                Para: {depositoNombre}
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-gray-100 flex gap-4">
          <button
            type="button"
            onClick={() => { setActiveTab('nuevo'); setError(''); }}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'nuevo' ? 'border-(--color-primary) text-(--color-primary)' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Crear Nueva
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('existente'); setError(''); }}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'existente' ? 'border-(--color-primary) text-(--color-primary)' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
             <LinkIcon size={16} /> Vincular Existente
          </button>
        </div>

        {/* Global Error */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto w-full custom-scrollbar max-h-[60vh]">
          {activeTab === 'nuevo' ? (
            <form id="add-account-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Nombre(s) *"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  error={errors.nombre}
                  placeholder="Ej. Juan"
                />
                <FormInput
                  label="Apellido(s) *"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  error={errors.apellido}
                  placeholder="Ej. Pérez"
                />
              </div>
              
              <FormInput
                label="Correo Electrónico *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="usuario@ejemplo.com"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Contraseña *"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="••••••••"
                />
                <FormInput
                  label="Confirmar *"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                />
              </div>
            </form>
          ) : (
             <form id="add-account-form" onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
                <div className="relative mb-2">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar concesionario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-(--color-primary) focus:border-(--color-primary) text-sm outline-none"
                  />
                </div>

                <div className="flex-1 overflow-y-auto border border-gray-200 rounded-xl bg-gray-50/30 p-2 min-h-62.5">
                  {loadingUsers ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                       <Loader2 size={24} className="animate-spin" />
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg border border-dashed border-gray-200 mt-0">
                       <User size={32} className="text-gray-300 mb-2" />
                       <p className="text-sm font-medium text-gray-900">No hay concesionarios disponibles</p>
                       <p className="text-xs text-gray-500 mt-1">Todos los concesionarios registrados ya tienen un depósito asignado.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                       {filteredUsers.map(u => (
                         <label key={u.id} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${selectedUserId === u.id ? 'border-(--color-primary) bg-violet-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                           <input 
                             type="radio" 
                             name="selectedUser" 
                             value={u.id}
                             checked={selectedUserId === u.id}
                             onChange={() => setSelectedUserId(u.id)}
                             className="w-4 h-4 text-(--color-primary) border-gray-300 focus:ring-(--color-primary) mr-3"
                           />
                           <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 overflow-hidden mr-3">
                              <img 
                                src={(u.fotoUrl && !u.fotoUrl.includes('name=User')) 
                                  ? u.fotoUrl 
                                  : `https://ui-avatars.com/api/?background=random&color=fff&size=200&name=${encodeURIComponent(u.nombre + ' ' + u.apellido)}`} 
                                alt="avatar" 
                                className="w-full h-full object-cover"
                              />
                           </div>
                           <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-gray-900 truncate">{u.nombre} {u.apellido}</p>
                              <p className="text-xs text-gray-500 truncate">{u.email}</p>
                           </div>
                         </label>
                       ))}
                    </div>
                  )}
                </div>
             </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="add-account-form"
            disabled={loading || (activeTab === 'existente' && !selectedUserId && !loadingUsers && filteredUsers.length > 0)}
            className="px-5 py-2 min-w-35 text-sm font-medium text-white bg-(--color-primary) hover:bg-violet-900 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                {activeTab === 'nuevo' ? <Check size={16} /> : <LinkIcon size={16} />}
                {activeTab === 'nuevo' ? 'Crear Cuenta' : 'Vincular Cuenta'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default AddAccountModal;
