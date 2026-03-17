import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#572671]">
          SMyT Seguridad
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#572671] mb-4"></div>
              <p className="text-gray-600">Procesando solicitud de seguridad...</p>
            </div>
          )}

          {status === 'success-confirm' && (
            <div className="flex flex-col items-center animate-fade-in">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Cambio Confirmado</h3>
              <p className="text-gray-600 mb-6">Hemos verificado que fuiste tú quien realizó el cambio de contraseña. Tu cuenta está segura.</p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-[#572671] text-white py-2 px-4 rounded hover:bg-[#451e5a] transition-colors"
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          )}

          {status === 'success-reject' && (
            <div className="flex flex-col items-center animate-fade-in">
              <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Cuenta Asegurada</h3>
              <p className="text-gray-600 mb-6">Hemos bloqueado y desactivado tu cuenta inmediatamente para proteger tu información. Por favor, contacta a un Super Usuario o administrador del sistema SMyT para recuperar el acceso a tu cuenta.</p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
              >
                Volver al Inicio
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="h-16 w-16 text-red-500 mb-4 flex items-center justify-center border-4 border-red-500 rounded-full">
                <span className="text-4xl font-bold">!</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Error de Verificación</h3>
              <p className="text-red-500 mb-6">{errorMessage}</p>
              <p className="text-gray-500 text-sm mb-6">El enlace puede haber expirado (son válidos por 24 horas) o ya fue utilizado.</p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-[#572671] text-white py-2 px-4 rounded hover:bg-[#451e5a] transition-colors"
              >
                Volver al Inicio
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default SecurityAlert;
