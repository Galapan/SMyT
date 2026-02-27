import { useState, useEffect } from 'react';
import FormInput from '../FormFields/FormInput';
import FormSelect from '../FormFields/FormSelect';
import { Upload } from 'lucide-react';

const Step1AdministrativeData = ({ formData, errors, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [depositos, setDepositos] = useState([]);
  
  const user = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || '{}');
  const isAdmin = user.rol === 'SUPER_USUARIO' || user.rol === 'ADMINISTRADOR_SMYT';

  useEffect(() => {
    if (isAdmin) {
      const fetchDepositos = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const token = sessionStorage.getItem('token') || localStorage.getItem('token');
          const res = await fetch(`${API_URL}/api/depositos`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await res.json();
          if (result.success) {
            setDepositos(result.data.map(d => ({ value: d.id, label: `${d.nombre} - ${d.municipio}` })));
          }
        } catch (err) {
          console.error('Error fetching depositos:', err);
        }
      };
      fetchDepositos();
    }
  }, [isAdmin]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setUploadError('Solo se permiten imágenes y archivos PDF');
      return;
    }

    // Validar tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('El archivo es demasiado grande (máx. 10MB)');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      const result = await response.json();

      if (result.success) {
        const currentFotos = formData.fotos || [];
        onChange({
          target: {
            name: 'fotos',
            value: [...currentFotos, result.data.url]
          }
        });
      } else {
        setUploadError(result.message || 'Error al subir el archivo');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setUploadError('Error de conexión al subir el archivo');
    } finally {
      setUploading(false);
      // Limpiar el input
      e.target.value = '';
    }
  };

  const removeFoto = (indexToRemove) => {
    const currentFotos = formData.fotos || [];
    const newFotos = currentFotos.filter((_, index) => index !== indexToRemove);
    onChange({
      target: {
        name: 'fotos',
        value: newFotos
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-(--color-primary) mb-4">
        Paso 1: Datos Administrativos
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Folio de Proceso *"
          name="folioProceso"
          value={formData.folioProceso}
          onChange={onChange}
          error={errors.folioProceso}
          placeholder="Ej. SMT-2026-001234"
          helperText="Folio único de identificación del proceso"
        />
        <FormInput
          label="Fecha de Ingreso *"
          name="fechaIngreso"
          type="date"
          value={formData.fechaIngreso}
          onChange={onChange}
          error={errors.fechaIngreso}
        />
      </div>

      <FormInput
        label="Autoridad Responsable *"
        name="autoridad"
        value={formData.autoridad}
        onChange={onChange}
        error={errors.autoridad}
        placeholder="Ej. Fiscalía General del Estado de Tlaxcala"
      />

      {isAdmin && (
        <FormSelect
          label="Asignar a Concesionario / Corralón *"
          name="depositoId"
          value={formData.depositoId}
          onChange={onChange}
          options={depositos}
          error={errors.depositoId}
          placeholder={depositos.length === 0 ? "Cargando corralones..." : "Seleccione un concesionario"}
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fotografías del Vehículo</label>
        
        {/* Lista de fotos subidas */}
        {formData.fotos && formData.fotos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {formData.fotos.map((url, index) => (
              <div key={index} className="relative group border rounded-lg overflow-hidden h-24 bg-gray-100">
                <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFoto(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-(--color-primary) transition-colors relative">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center pointer-events-none">
            {uploading ? (
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-(--color-primary) mb-3"></div>
            ) : (
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
            )}
            <p className="text-sm text-gray-600">
              {uploading ? 'Subiendo archivo...' : 'Haz clic para cargar fotos o arrástralas aquí'}
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG (máx. 10MB)</p>
          </div>
        </div>
        
        {uploadError && (
          <p className="text-xs text-red-500 mt-2">{uploadError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Documentos Adjuntos (Opcional)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50">
           <p className="text-sm text-gray-500">Funcionalidad de documentos en desarrollo...</p>
        </div>
      </div>
    </div>
  );
};

export default Step1AdministrativeData;
