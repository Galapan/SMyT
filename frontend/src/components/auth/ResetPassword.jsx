import { useReducer, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logoTlax from "../../assets/LogoTlax.png";
import Toast from "../common/Toast";

const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

const initialState = {
  step: 1, // 1: Verify Code, 2: New Password
  email: "",
  code: ["", "", "", "", "", ""],
  newPassword: "",
  confirmPassword: "",
  loading: false,
  toast: { show: false, message: "", type: "error" },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_CODE":
      return { ...state, code: action.payload };
    case "SET_NEW_PASSWORD":
      return { ...state, newPassword: action.payload };
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SHOW_TOAST":
      return { ...state, toast: { show: true, message: action.payload.message, type: action.payload.type } };
    case "HIDE_TOAST":
      return { ...state, toast: { ...state.toast, show: false } };
    case "RESET_TOAST":
      return { ...state, toast: { show: false, message: "", type: "error" } };
    default:
      return state;
  }
}

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);
  const codeInputIds = useRef(["d1", "d2", "d3", "d4", "d5", "d6"]);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { step, email, code, newPassword, confirmPassword, loading, toast } = state;

  useEffect(() => {
    if (location.state?.email) {
      dispatch({ type: "SET_EMAIL", payload: location.state.email });
    } else {
      // Si no hay email, no podemos resetear, volver a forgot-password o login
      navigate("/forgot-password");
    }
    
    if (location.state?.message) {
      dispatch({ type: "SHOW_TOAST", payload: { message: location.state.message, type: "success" } });
      // Limpiar state para evitar que salga en cada recarga
      window.history.replaceState({ email: location.state?.email }, document.title);
    }
  }, [location.state, navigate]);

  // Manejo de los 6 inputs de código
  const handleCodeChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); 
    dispatch({ type: "SET_CODE", payload: newCode });

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, 6);
    
    if (pastedData) {
      const newCode = [...code];
      for (let i = 0; i < pastedData.length; i++) {
        newCode[i] = pastedData[i];
      }
      dispatch({ type: "SET_CODE", payload: newCode });
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex].focus();
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) return;

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "RESET_TOAST" });

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Código inválido");
      }

      // Pasar al siguiente paso
      dispatch({ type: "SET_STEP", payload: 2 });
    } catch (err) {
      dispatch({ type: "SHOW_TOAST", payload: { message: err.message, type: "error" } });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      dispatch({ type: "SHOW_TOAST", payload: { message: "Las contraseñas no coinciden", type: "error" } });
      return;
    }

    if (newPassword.length < 8) {
      dispatch({ type: "SHOW_TOAST", payload: { message: "La contraseña debe tener al menos 8 caracteres", type: "error" } });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "RESET_TOAST" });

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          code: code.join(""), 
          newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al restablecer contraseña");
      }

      dispatch({ type: "SHOW_TOAST", payload: { message: "Contraseña actualizada exitosamente", type: "success" } });
      
      setTimeout(() => {
        navigate("/login", { 
          state: { message: "Contraseña actualizada exitosamente. Ya puedes iniciar sesión." } 
        });
      }, 2000);

    } catch (err) {
      dispatch({ type: "SHOW_TOAST", payload: { message: err.message, type: "error" } });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div className="h-dvh w-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => dispatch({ type: "HIDE_TOAST" })}
      />
      
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl relative z-10 mx-4 animate-slide-up-fade">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4 flex items-center justify-center">
            <img
              src={logoTlax}
              alt="Logo Tlaxcala"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-[#572671] text-center mb-2">
            {step === 1 ? "Verificar Código" : "Nueva Contraseña"}
          </h2>
          <p className="text-xs text-center text-gray-500 max-w-xs mx-auto">
            {step === 1 
              ? <>Ingresa el código de 6 dígitos enviado a <br/><strong className="break-all text-gray-700">{email}</strong></>
              : "Define tu nueva contraseña de acceso al sistema."
            }
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div 
              className="flex justify-between gap-2 px-2"
              onPaste={handlePaste}
            >
              {codeInputIds.current.map((slotId, idx) => (
                <input
                  key={slotId}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={code[idx]}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572671] focus:border-[#572671] outline-none transition-all text-[#572671]"
                  required
                  disabled={loading}
                />
              ))}
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading || code.some(d => d === "")}
                className="w-full bg-[#572671] text-white py-3 rounded-lg hover:bg-[#451e5a] transition-colors font-medium text-sm flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 duration-200"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Continuar"
                )}
              </button>
              <Link
                to="/forgot-password"
                className="w-full text-center text-xs font-medium text-gray-500 hover:text-[#572671] hover:underline"
              >
                Volver a solicitar código
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="password-input" className="block text-xs font-semibold text-gray-600 mb-1">
                Nueva Contraseña
              </label>
              <input
                id="password-input"
                type="password"
                value={newPassword}
                onChange={(e) => dispatch({ type: "SET_NEW_PASSWORD", payload: e.target.value })}
                placeholder="Min. 8 caracteres"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#572671] focus:border-[#572671] outline-none transition-all text-gray-700 text-sm placeholder-gray-300"
                required
                disabled={loading}
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirm-password-input" className="block text-xs font-semibold text-gray-600 mb-1">
                Confirmar Nueva Contraseña
              </label>
              <input
                id="confirm-password-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => dispatch({ type: "SET_CONFIRM_PASSWORD", payload: e.target.value })}
                placeholder="Repite tu contraseña"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#572671] focus:border-[#572671] outline-none transition-all text-gray-700 text-sm placeholder-gray-300"
                required
                disabled={loading}
                minLength={8}
              />
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full bg-[#572671] text-white py-3 rounded-lg hover:bg-[#451e5a] transition-colors font-medium text-sm flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 duration-200"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Restablecer Contraseña"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
