import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Toast from "../common/Toast";

const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

function Verification() {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);
  const codeInputIds = useRef(["d1", "d2", "d3", "d4", "d5", "d6"]);
  
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  useEffect(() => {
    // Si no tenemos el correo desde la navegación, redirigir al login
    if (!location.state?.email) {
      navigate('/login');
    } else {
      setEmail(location.state.email);
    }
  }, [location, navigate]);

  const handleChange = (index, value) => {
    // Solo permitir números
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    // Tomar solo el último caracter si pega varios
    newCode[index] = value.slice(-1); 
    setCode(newCode);

    // Mover foco al siguiente si hay un valor y no es el último
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Borrar y mover foco al anterior si está vacío
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
      setCode(newCode);
      
      // Enfocar el input correspondiente (el siguiente al último pegado, o el último si se llenaron todos)
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    
    if (fullCode.length < 6) {
      setToast({ show: true, message: "Por favor ingresa los 6 dígitos del código", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al verificar la cuenta");
      }

      setToast({ show: true, message: "¡Cuenta verificada exitosamente!", type: "success" });
      
      // Esperar un poco para que el usuario lea el mensaje antes de redirigir
      setTimeout(() => {
        navigate("/login", { state: { message: "Cuenta verificada. Ahora puedes iniciar sesión." } });
      }, 2000);

    } catch (err) {
      setToast({ show: true, message: err.message, type: "error" });
    } finally {
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
      
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl relative z-10 mx-4 animate-slide-up-fade">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-[#572671] text-center leading-tight mb-2">
            Verifica tu cuenta
          </h1>
          <p className="text-sm text-gray-500 text-center px-4">
            Ingresa el código de 6 dígitos que enviamos a
            <br/><strong className="text-gray-700">{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572671] focus:border-[#572671] outline-none transition-all text-[#572671]"
                required
              />
            ))}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || code.some(d => d === "")}
              className="w-full bg-[#572671] text-white py-3 rounded-lg hover:bg-[#451e5a] transition-colors font-medium text-sm flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 duration-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Verificar Código"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center flex flex-col items-center gap-2">
           <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-xs font-medium text-gray-500 hover:text-[#572671] hover:underline transition-colors"
            >
              Volver al inicio de sesión
            </button>
        </div>
      </div>
    </div>
  );
}

export default Verification;
