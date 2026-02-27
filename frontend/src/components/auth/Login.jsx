import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoTlax from "../../assets/LogoTlax.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          usuario.rol === "ADMINISTRADOR_SMYT"
        ) {
          navigate("/admin");
        } else {
          navigate("/concesionario");
        }
      } catch (err) {
        // Si hay error en el parseo, el usuario se queda en el login
        console.error("Error parseando usuario guardado:", err);
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Guardar token y usuario
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", data.data.token);
      storage.setItem("user", JSON.stringify(data.data.usuario));

      // Redirigir según rol
      const usuario = data.data.usuario;
      if (
        usuario.rol === "SUPER_USUARIO" ||
        usuario.rol === "ADMINISTRADOR_SMYT"
      ) {
        navigate("/admin");
      } else {
        navigate("/concesionario"); // Futuro: dashboard de concesionario
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
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
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Correo Institucional
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@tlaxcala.gob.mx"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#572671] focus:border-[#572671] outline-none transition-all text-gray-700 text-sm placeholder-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#572671] focus:border-[#572671] outline-none transition-all text-gray-700 text-sm placeholder-gray-300"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
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
            <a
              href="#"
              className="text-xs font-medium text-[#572671] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100 text-center">
              {error}
            </div>
          )}

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
