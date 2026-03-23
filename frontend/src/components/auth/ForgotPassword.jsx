import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoTlax from "../../assets/LogoTlax.png";
import Toast from "../common/Toast";

const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setToast({ show: false, message: "", type: "error" });

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al solicitar recuperación");
      }

      // Ir a la pantalla de resetear y pasar el correo
      navigate("/reset-password", { 
        state: { 
          email, 
          message: data.message 
        } 
      });
    } catch (err) {
      setToast({ show: true, message: err.message, type: "error" });
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh w-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      {/* Botón regresar */}
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="absolute top-4 left-4 z-10 flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Regresar
      </button>
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl relative z-10 mx-4 animate-slide-up-fade">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 mb-4 flex items-center justify-center">
            <img
              src={logoTlax}
              alt="Logo Tlaxcala"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-primary text-center mb-2">
            Recuperar Contraseña
          </h2>
          <p className="text-xs text-center text-gray-500 max-w-xs mx-auto">
            Ingresa tu correo institucional y te enviaremos un código de 6 dígitos para restablecer tu contraseña.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email-input" className="block text-xs font-semibold text-gray-600 mb-1">
              Correo Institucional
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@tlaxcala.gob.mx"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-gray-700 text-sm placeholder-gray-300"
              required
              disabled={loading}
            />
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-primary text-white py-3 rounded hover:bg-primary/85 transition-colors font-medium text-sm flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 duration-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Enviar Código"
              )}
            </button>
            <Link
              to="/login"
              className="w-full text-center text-xs font-medium text-gray-500 hover:text-primary hover:underline"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
