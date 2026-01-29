import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Tailwind CSS + Vite</div>
          <h1 className="block mt-1 text-3xl leading-tight font-bold text-white">
            ¡Funciona perfectamente!
          </h1>
          <p className="mt-2 text-gray-400">
            Ahora estás usando Tailwind CSS v4. No necesitas configurar nada más.
            Solo escribe tus clases directamente en los componentes.
          </p>
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
              Contador: {count}
            </button>
            <button className="bg-transparent border border-indigo-600 text-indigo-400 hover:bg-indigo-900/50 font-bold py-2 px-4 rounded transition-colors duration-300">
              Botón Secundario
            </button>
          </div>
        </div>
        <div className="bg-gray-700/50 px-8 py-4">
          <p className="text-sm text-gray-300">
            Edita <code className="text-indigo-400 font-mono">src/App.jsx</code> para ver cambios.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
