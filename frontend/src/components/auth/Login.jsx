import { useReducer, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoTlax from "../../assets/LogoTlax.png";
import Toast from "../common/Toast";

// IMPORTANTE: En producción (Vercel), VITE_API_URL estará vacío para que las peticiones vayan al mismo dominio (/api/...) 
// En desarrollo, usará localhost:3000 si no se especifica.
const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

const initialState = {
  email: "",
  password: "",
  rememberMe: false,
  loading: false,
  error: ""
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'LOGIN_START':
      return { ...state, error: "", loading: true };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false };
    case 'LOGIN_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: "" };
    default:
      return state;
  }
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { email, password, rememberMe, loading, error } = state;
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  useEffect(() => {
    if (error) {
      setToast({ show: true, message: error, type: "error" });
    }
  }, [error]);

  // Redirigir automáticamente si hay una sesión activa
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const usuario = JSON.parse(storedUser);
        if (
          usuario.rol === "SUPER_USUARIO" ||
          usuario.rol === "ADMINISTRADOR" ||
          usuario.rol === "ADMINISTRADOR_CONCESIONARIO"
        ) {
          navigate("/admin");
        } else {
          navigate("/admin"); // temporal mapping since there is no concesionario dashboard yet
        }
      } catch (err) {
        // Si hay error en el parseo, el usuario se queda en el login
        console.error("Error parseando usuario guardado:", err);
      }
    }
    
    // Check if coming back from successful verification
    if (location.state?.message) {
      setToast({ show: true, message: location.state.message, type: "success" });
      // Clean up the state so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if unverified
        if (data.unverified) {
            dispatch({ type: 'LOGIN_SUCCESS' }); // Stop loading
            navigate("/verify", { state: { email: data.email || email } });
            return;
        }

        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Guardar token y usuario
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", data.data.token);
      storage.setItem("user", JSON.stringify(data.data.usuario));

      // Redirigir según rol
      const usuario = data.data.usuario;
      dispatch({ type: 'LOGIN_SUCCESS' });
      if (
        usuario.rol === "SUPER_USUARIO" ||
        usuario.rol === "ADMINISTRADOR" ||
        usuario.rol === "ADMINISTRADOR_CONCESIONARIO"
      ) {
        navigate("/admin");
      } else {
        navigate("/admin"); // Futuro: dashboard de concesionario
      }
    } catch (err) {
      dispatch({ type: 'LOGIN_ERROR', payload: err.message });
    }
  };

  return (
    <div className="h-dvh w-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => {
            setToast({ ...toast, show: false });
            dispatch({ type: 'CLEAR_ERROR' });
        }}
      />
      {/* Card Formulario */}
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl relative z-10 mx-4 animate-slide-up-fade">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 mb-4 flex items-center justify-center">
            <img
              src={logoTlax}
              alt="Logo Tlaxcala"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-[#572671] text-center leading-tight">
            Sistema de Control de
          </h1>
          <h2 className="text-2xl font-bold text-[#572671] text-center">
            Inventarios SMyT
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Gobierno del Estado de Tlaxcala
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email-input" className="block text-xs font-semibold text-gray-600 mb-1">
              Correo Institucional
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
              placeholder="usuario@tlaxcala.gob.mx"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#572671] focus:border-[#572671] outline-none transition-all text-gray-700 text-sm placeholder-gray-300"
              required
            />
          </div>

          <div>
            <label htmlFor="password-input" className="block text-xs font-semibold text-gray-600 mb-1">
              Contraseña
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#572671] focus:border-[#572671] outline-none transition-all text-gray-700 text-sm placeholder-gray-300"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label htmlFor="remember-me" className="flex items-center cursor-pointer">
              <div className="relative flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'rememberMe', value: e.target.checked })}
                  className="peer h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-400 checked:border-[#572671] checked:bg-[#572671] transition-all"
                />
                <svg
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <span className="ml-2 text-xs font-medium text-gray-600">
                Recordarme
              </span>
            </label>
            <button
              type="button"
              className="text-xs font-medium text-[#572671] hover:underline bg-transparent border-none p-0 cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Error manejado por Toast ahora */}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#572671] text-white py-3 rounded hover:bg-[#451e5a] transition-colors font-medium text-sm flex justify-center items-center gap-2 shadow-md hover:shadow-lg transform active:scale-95 duration-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-400">
            © 2026 Gobierno del Estado de Tlaxcala
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
