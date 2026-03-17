import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import logoTlax from '../assets/LogoTlax.png';

const API_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? "http://localhost:3000" : "");

function SecurityAlert() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success-confirm, success-reject, error
  const [errorMessage, setErrorMessage] = useState('');

  const action = searchParams.get('action');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!action || !token) {
      setStatus('error');
      setErrorMessage('Enlace inválido o incompleto.');
      return;
    }

    const processAction = async () => {
      try {
        const endpoint = action === 'confirm' ? '/api/auth/security-alert/confirm' : '/api/auth/security-alert/reject';
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al procesar la solicitud');
        }

        if (action === 'confirm') {
          setStatus('success-confirm');
        } else {
          // If deactivated successfully, ensure local storage is cleared
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          setStatus('success-reject');
        }

      } catch (err) {
        setStatus('error');
        setErrorMessage(err.message);
      }
    };

    processAction();
  }, [action, token]);

  return (
    <div className="h-dvh w-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Background Decorators if desired (like Login later) */}
      
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
            Gestión de Seguridad
          </h1>
          <h2 className="text-2xl font-bold text-[#572671] text-center">
            SMyT
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Gobierno del Estado de Tlaxcala
          </p>
        </div>

        <div className="text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#572671] mb-6"></div>
              <p className="text-sm font-medium text-gray-600">Procesando solicitud de seguridad...</p>
            </div>
          )}

          {status === 'success-confirm' && (
            <div className="flex flex-col items-center animate-fade-in py-2">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-6 drop-shadow-sm" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Cambio Confirmado</h3>
              <p className="text-sm text-gray-600 mb-8 px-2">Hemos verificado que fuiste tú quien realizó el cambio de contraseña. Tu cuenta está segura.</p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-[#572671] text-white py-3 rounded hover:bg-[#451e5a] transition-colors font-medium text-sm shadow-md hover:shadow-lg transform active:scale-95 duration-200"
              >
                Volver al Inicio
              </button>
            </div>
          )}

          {status === 'success-reject' && (
            <div className="flex flex-col items-center animate-fade-in py-2">
              <ShieldAlert className="h-16 w-16 text-red-500 mb-6 drop-shadow-sm" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Cuenta Asegurada</h3>
              <p className="text-sm text-gray-600 mb-8 px-2 leading-relaxed">Hemos bloqueado y desactivado tu cuenta de inmediato por precaución. Por favor, contacta a un administrador para recuperar el acceso a tu sistema.</p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-gray-100 border border-gray-200 text-gray-700 py-3 rounded hover:bg-gray-200 transition-colors font-medium text-sm shadow-sm hover:shadow transform active:scale-95 duration-200"
              >
                Entendido
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center animate-fade-in py-2">
              <div className="h-16 w-16 text-red-500 mb-6 flex items-center justify-center border-4 border-red-500 rounded-full shadow-sm bg-red-50">
                <span className="text-4xl font-bold">!</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Error de Verificación</h3>
              <p className="text-sm font-medium text-red-600 mb-4">{errorMessage}</p>
              <p className="text-xs text-gray-500 mb-8 px-4">Este enlace de seguridad puede haber expirado por superar las 24 horas, o ya fue utilizado por ti u otra persona.</p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-[#572671] text-white py-3 rounded hover:bg-[#451e5a] transition-colors font-medium text-sm shadow-md hover:shadow-lg transform active:scale-95 duration-200"
              >
                Volver a Iniciar Sesión
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[10px] text-gray-400">
            © 2026 Gobierno del Estado de Tlaxcala
          </p>
        </div>
      </div>
    </div>
  );
}

export default SecurityAlert;
