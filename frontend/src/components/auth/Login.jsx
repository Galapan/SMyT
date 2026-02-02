import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Login() {
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

      // Guardar token
      if (rememberMe) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.usuario));
      } else {
        sessionStorage.setItem('token', data.data.token);
        sessionStorage.setItem('user', JSON.stringify(data.data.usuario));
      }

      console.log('Login exitoso:', data.data.usuario);
      alert(`¡Bienvenido, ${data.data.usuario.nombre}!`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Panel izquierdo - Imagen */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #572671 0%, #3d1a50 100%)'
        }}
      >
        {/* Imagen de fondo con overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80')`,
          }}
        />
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(135deg, rgba(87, 38, 113, 0.85) 0%, rgba(170, 3, 101, 0.7) 100%)'
          }}
        />
        
        {/* Contenido sobre la imagen */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-light mb-4" style={{ color: '#FEE6C4' }}>
              Sistema de Gestión
            </h2>
            <h1 className="text-5xl font-bold mb-6">
              Depósitos Vehiculares
            </h1>
            <p className="text-lg opacity-80 max-w-md" style={{ color: '#91ABA5' }}>
              Plataforma integral para el control y administración de inventarios vehiculares del Estado de Tlaxcala.
            </p>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div 
        className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16"
        style={{ backgroundColor: '#FAFAFA' }}
      >
        <div className="w-full max-w-md animate-slide-up">
          {/* Logo / Header */}
          <div className="text-center mb-10">
            <h1 
              className="text-3xl font-light mb-2"
              style={{ color: '#572671' }}
            >
              Sistema de Control de
            </h1>
            <h2 
              className="text-3xl font-bold"
              style={{ color: '#572671' }}
            >
              Inventarios SMyT
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex mb-8 border-b" style={{ borderColor: '#E5E5E5' }}>
            <button
              onClick={() => setIsLogin(true)}
              className="flex-1 pb-4 text-center font-medium transition-all duration-300 relative"
              style={{ 
                color: isLogin ? '#572671' : '#999',
              }}
            >
              Iniciar Sesión
              {isLogin && (
                <span 
                  className="absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300"
                  style={{ backgroundColor: '#572671' }}
                />
              )}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className="flex-1 pb-4 text-center font-medium transition-all duration-300 relative"
              style={{ 
                color: !isLogin ? '#572671' : '#999',
              }}
            >
              Registrarse
              {!isLogin && (
                <span 
                  className="absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300"
                  style={{ backgroundColor: '#572671' }}
                />
              )}
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campos de registro */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#333' }}
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none"
                    style={{ 
                      borderColor: '#DDD',
                      backgroundColor: '#FFF'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#572671'}
                    onBlur={(e) => e.target.style.borderColor = '#DDD'}
                    placeholder="Juan"
                    required={!isLogin}
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#333' }}
                  >
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none"
                    style={{ 
                      borderColor: '#DDD',
                      backgroundColor: '#FFF'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#572671'}
                    onBlur={(e) => e.target.style.borderColor = '#DDD'}
                    placeholder="Pérez"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#333' }}
              >
                Correo Institucional
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none"
                style={{ 
                  borderColor: '#DDD',
                  backgroundColor: '#FFF'
                }}
                onFocus={(e) => e.target.style.borderColor = '#572671'}
                onBlur={(e) => e.target.style.borderColor = '#DDD'}
                placeholder="usuario@tlaxcala.gob.mx"
                required
              />
            </div>

            {/* Password */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#333' }}
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none"
                style={{ 
                  borderColor: '#DDD',
                  backgroundColor: '#FFF'
                }}
                onFocus={(e) => e.target.style.borderColor = '#572671'}
                onBlur={(e) => e.target.style.borderColor = '#DDD'}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Remember me y Forgot password */}
            {isLogin && (
              <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 mr-2 cursor-pointer"
                    style={{ accentColor: '#572671' }}
                  />
                  <span className="text-sm" style={{ color: '#666' }}>Recordarme</span>
                </label>
                <a 
                  href="#" 
                  className="text-sm hover:underline transition-colors"
                  style={{ color: '#572671' }}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div 
                className="p-3 rounded-lg text-sm animate-fade-in"
                style={{ 
                  backgroundColor: 'rgba(170, 3, 101, 0.1)',
                  border: '1px solid rgba(170, 3, 101, 0.3)',
                  color: '#AA0365'
                }}
              >
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: '#572671',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#6b2f8a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#572671'}
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                isLogin ? 'Iniciar Sesión' : 'Registrarse'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <a 
              href="#" 
              className="text-sm hover:underline transition-colors"
              style={{ color: '#572671' }}
            >
              Gobierno del Estado de Tlaxcala
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
