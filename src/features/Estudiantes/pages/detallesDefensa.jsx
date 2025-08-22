import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEstudiantesStore } from '@/store/estudiantes.store';
import ModalDocumento from "@/features/Administrador/components/gestionDeCasos/modal_Prev_PDF";
import { toast } from 'react-hot-toast'; // Importa el toast

// Componente para la insignia (Badge)
function Badge({ children }) {
  const getBadgeColor = () => {
    if (!children || typeof children !== 'string') {
      return 'bg-gray-100 text-gray-600';
    }
  
    const lastWord = children.trim().split(' ').pop().toLowerCase();
    
    switch (lastWord) {
      case 'interna':
        return 'bg-green-100 text-green-600';
      case 'externa':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const colorClass = getBadgeColor();
  const lastWord = children.trim().split(' ').pop();
  if (lastWord !== 'Interna' && lastWord !== 'Externa') {
    return children;
  }
  
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${colorClass}`}
    >
      {lastWord}
    </span>
  );
}

// Componente para el resumen de la defensa
function DefenseSummaryCard({ defense }) {
  if (!defense) return null;

  const formattedDate = defense.fecha_defensa ? new Date(defense.fecha_defensa).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric'
  }) : 'Fecha no asignada';

  const formattedTime = defense.fecha_defensa ? new Date(defense.fecha_defensa).toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit'
  }) : 'Hora no asignada';

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6 w-full max-w-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-lg text-gray-800 leading-tight">
          Defensa de {defense.Tipo_Defensa?.Nombre || 'N/A'}
        </div>
        <Badge>{defense.tipo || 'Sin Área'}</Badge>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        <div className="flex items-center text-sm text-gray-700">
          <i className="far fa-calendar-alt text-red-500 mr-2 text-lg"></i>
          <div>
            <span className="font-medium">Fecha</span>
            <div className="ml-0">{formattedDate}</div>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <i className="far fa-clock text-red-500 mr-2 text-lg"></i>
          <div>
            <span className="font-medium">Hora</span>
            <div className="ml-0">{formattedTime}</div>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <i className="fas fa-map-marker-alt text-red-500 mr-2 text-lg"></i>
          <div>
            <span className="font-medium">Lugar</span>
            <div className="ml-0">{defense.aula || 'Lugar no asignado'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para el caso de estudio
function StudyCaseCard({ defense, onPreview }) {
  if (!defense || !defense.casos_de_estudio) return null;

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6 min-w-[270px] max-w-[270px]">
      <div className="font-medium text-gray-900 mb-3">Caso de Estudio</div>
      <div className="bg-[#f7f8fa] border border-gray-200 rounded-xl px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <i className="far fa-file-pdf text-2xl text-red-400"></i>
          <div>
            <div className="font-semibold text-sm text-gray-800">
              {defense.casos_de_estudio.Nombre_Archivo}
            </div>
            <div className="text-xs text-gray-500">
              Subido: {new Date(defense.casos_de_estudio.fecha_Subida).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button 
            className="bg-white border border-gray-300 rounded-lg px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition"
            onClick={() => onPreview(defense.casos_de_estudio.url)}
          >
            <i className="far fa-eye mr-2"></i> Ver
          </button>
          <a 
            href={defense.casos_de_estudio.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-red-600 text-white rounded-lg px-4 py-1.5 text-sm hover:bg-red-700 font-medium transition"
          >
            <i className="fas fa-download mr-2"></i> Descargar
          </a>
        </div>
      </div>
    </div>
  );
}

// Componente para la sección de documentación
function ProjectDocsSection({ defense }) {
  const { subirDocumentos, loading } = useEstudiantesStore();
  const tieneDocumentosSubidos = defense.archivos_defensa && defense.archivos_defensa.length > 0;
  const plazoExpirado = defense.plazo_expirado;

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const uploadToast = toast.loading('Subiendo archivo...');
      try {
        await subirDocumentos(defense.id_defensa, file);
        toast.success('¡Archivo subido con éxito!', { id: uploadToast });
      } catch (error) {
        toast.error('Error al subir el archivo.', { id: uploadToast });
      }
    }
  };

  const fileInfoCard = (file) => (
    <div className="bg-[#f7f8fa] border border-gray-200 rounded-xl px-4 py-3 flex flex-col gap-2 mb-4">
      <div className="flex items-center gap-2">
        <i className={`fas ${file.nombre_Archivo.endsWith('.pdf') ? 'fa-file-pdf' : 'fa-file'} text-2xl text-red-400`}></i>
        <div>
          <div className="font-semibold text-sm text-gray-800">
            {file.nombre_Archivo || 'Documento sin nombre'}
          </div>
          <div className="text-xs text-gray-500">
            Subido: {new Date(file.fecha_subida).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <a 
          href={file.ruta_archivo} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-red-600 text-white rounded-lg px-4 py-1.5 text-sm hover:bg-red-700 font-medium transition"
        >
          <i className="fas fa-download mr-2"></i> Descargar
        </a>
      </div>
    </div>
  );
  
  const uploadArea = (
    <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 bg-[#f7f8fa] rounded-xl">
      <i className="fas fa-upload text-gray-400 text-4xl mb-3"></i>
      <div className="text-gray-500 text-sm">
        Arrastra y suelta tu archivo aquí o haz clic para subir.
      </div>
      <input 
        type="file" 
        onChange={handleFileUpload} 
        className="hidden" 
        id="file-upload" 
        disabled={loading}
      />
      <label 
        htmlFor="file-upload" 
        className={`mt-2 px-4 py-2 text-sm font-medium rounded-md text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 cursor-pointer'}`}
      >
        {loading ? 'Subiendo...' : 'Subir Archivo'}
      </label>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6 w-full">
      <div className="font-medium text-gray-900 mb-3">
        Documentos de la Defensa
      </div>
      {plazoExpirado && (
        <div className="bg-red-100 text-red-700 text-sm p-3 rounded-lg mb-4">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          El plazo para subir documentos ha expirado. No se permiten nuevas subidas.
        </div>
      )}
      <div className="mb-2 text-sm text-gray-700 font-semibold">
        Documento del Proyecto
      </div>
      {defense.archivos_defensa.map((file) => (
        <React.Fragment key={file.id_archivo_defensa}>
          {fileInfoCard(file)}
        </React.Fragment>
      ))}
    {!plazoExpirado && uploadArea}
    </div>
  );
}

// Componente principal de los detalles de la defensa
function DefenseDetails() {
  const { id } = useParams();
  const { defensaActual, loading, error, cargarDetalleDefensa } = useEstudiantesStore();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    cargarDetalleDefensa(id);
  }, [id, cargarDetalleDefensa]);
  
  const handlePreview = (url) => {
    setPdfUrl(url);
    setModalVisible(true);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!defensaActual) return <div>Selecciona una defensa para ver sus detalles.</div>;

  return (
    <div className="min-h-screen bg-[#f7f8fa] py-7 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Detalles de la Defensa
          </h2>
          <Link
            to="/estudiante/misDefensas"
            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
          >
            <span className="mr-1">&#8592;</span> Volver a Mis Defensas
          </Link>
        </div>
        <div className="flex gap-6 mb-6 flex-wrap">
          <DefenseSummaryCard defense={defensaActual} />
          <StudyCaseCard defense={defensaActual} onPreview={handlePreview} />
        </div>
        <ProjectDocsSection defense={defensaActual} />
      </div>
      <ModalDocumento
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        url={pdfUrl}
      />
    </div>
  );
}
export default DefenseDetails;