import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoGob from '../../assets/GOB DE TLAXCALA CUADRADO.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar token y usuario
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', data.data.token);
      storage.setItem('user', JSON.stringify(data.data.usuario));

      // Redirigir según rol
      const usuario = data.data.usuario;
      if (usuario.rol === 'SUPER_USUARIO' || usuario.rol === 'ADMINISTRADOR_SMYT') {
        navigate('/admin');
      } else {
        navigate('/concesionario'); // Futuro: dashboard de concesionario
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      {/* Panel izquierdo - Logo centrado */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-white">
        <img 
          src={logoGob} 
          alt="Gobierno del Estado de Tlaxcala"
          className="max-w-[80%] max-h-[80%] object-contain"
        />
      </div>

      {/* Panel derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 lg:px-24 h-screen">
        <div className="w-full max-w-[420px] mx-auto flex flex-col justify-center h-full max-h-[800px]">
          
          {/* Header del Formulario */}
          <div className="mb-10">
            <h1 className="text-3xl font-normal text-[#572671] leading-tight">
              Sistema de Control de
            </h1>
            <div className="inline-block relative">
              <h2 className="text-3xl font-bold text-[#572671] pb-2">
                Inventarios SMT
              </h2>
              {/* Línea morada gruesa bajo el título */}
              <div className="absolute bottom-0 left-0 w-24 h-1.5 bg-[#AA0365] rounded-full"></div>
            </div>
          </div>

          {/* Tabs Login/Registro */}
          <div className="flex w-full mb-8 border-b border-gray-200">
            <button
              onClick={() => setIsLogin(true)}
              className={`pb-3 px-4 text-base font-medium transition-colors relative ${
                isLogin ? 'text-[#572671]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Iniciar Sesión
              {isLogin && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#572671]"></div>
              )}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`pb-3 px-4 text-base font-medium transition-colors relative ${
                !isLogin ? 'text-[#572671]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Registrarse
              {!isLogin && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#572671]"></div>
              )}
            </button>
          </div>

          {/* Formulario con animación de cambio */}
          <div className="relative overflow-visible w-full">
            <form 
              key={isLogin ? 'login' : 'register'}
              onSubmit={handleSubmit} 
              className={`space-y-5 w-full ${isLogin ? 'animate-slide-right' : 'animate-slide-left'}`}
            >
              
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#572671] focus:border-[#572671] outline-none transition-all text-sm"
                      required={!isLogin}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#572671] focus:border-[#572671] outline-none transition-all text-sm"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Correo Institucional
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@tlaxcala.gob.mx"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#572671] focus:border-[#572671] outline-none transition-all text-gray-700 text-sm placeholder-gray-300"
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
                  className="w-full px-3 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#572671] focus:border-[#572671] outline-none transition-all text-gray-700 text-sm placeholder-gray-300"
                  required
                />
              </div>

              {isLogin && (
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-600">Recordarme</span>
                  </label>
                  <a href="#" className="text-xs font-medium text-[#572671] hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-100">
                  {error}
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#572671] text-white py-3 rounded hover:bg-[#451e5a] transition-colors font-medium text-sm flex justify-center items-center gap-2 shadow-md hover:shadow-lg transform active:scale-95 duration-200"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    isLogin ? 'Iniciar Sesión' : 'Registrarse'
                  )}
                </button>
              </div>

            </form>
          </div>
          
          {/* Footer fijo al fondo del container */}
          <div className="mt-12 text-center pt-8">
            <p className="text-xs text-gray-400 hover:text-[#572671] transition-colors cursor-pointer">
              Gobierno del Estado de Tlaxcala
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
