import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEstudiantesStore } from '@/store/estudiantes.store';

const getBadgeColor = (type) => {
  if (!type || typeof type !== 'string') {
    return 'bg-gray-100 text-gray-600';
  }
  const lastWord = type.trim().split(' ').pop().toLowerCase();
  switch (lastWord) {
    case 'interna': return 'bg-green-100 text-green-600';
    case 'externa': return 'bg-blue-100 text-blue-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

// Componente para la insignia (Badge)
function Badge({ children }) {
  if (!children || typeof children !== 'string') {
    return null;
  }
  
  const lastWord = children.trim().split(' ').pop();
  const colorClass = getBadgeColor(children);
  
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${colorClass}`}
    >
      {lastWord.charAt(0).toUpperCase() + lastWord.slice(1)}
    </span>
  );
}

function DefenseCard({ defense }) {
  const formattedDate = defense.fecha_defensa ? new Date(defense.fecha_defensa).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric'
  }) : 'Fecha no asignada';

  const formattedTime = defense.fecha_defensa ? new Date(defense.fecha_defensa).toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit'
  }) : 'Hora no asignada';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 min-w-[325px] max-w-[350px] w-full flex flex-col mb-3 border border-gray-100 transition hover:shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg text-gray-800 leading-tight">
          Defensa de {defense.tipo}
        </span>
        <Badge>{defense.tipo}</Badge>
      </div>
      <div className="flex flex-col gap-1 mb-3 mt-1">
        <div className="flex items-center text-sm text-gray-700">
          <i className="far fa-calendar-alt text-red-500 mr-2"></i>
          <span>
            <span className="font-medium">Fecha:</span> {formattedDate}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <i className="far fa-clock text-red-500 mr-2"></i>
          <span>
            <span className="font-medium">Hora:</span> {formattedTime}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <i className="fas fa-map-marker-alt text-red-500 mr-2"></i>
          <span>
            <span className="font-medium">Lugar:</span> {defense.aula || 'No asignado'}
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200 my-2"></div>
      <div className="flex justify-end">
        <Link
          to={`/estudiante/misDefensas/detallesDefensa/${defense.id_defensa}`}
          className="text-red-600 font-medium text-sm hover:underline flex items-center"
        >
          Ver Detalles <span className="ml-1">&#8594;</span>
        </Link>
      </div>
    </div>
  );
}

function MisDefensas() {
  const {misDefensas, loading, error, cargarMisDefensas } = useEstudiantesStore();
  
  useEffect(() => {
    cargarMisDefensas();
  }, [cargarMisDefensas]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        Cargando defensas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center text-red-600 mt-10">
        Hubo un error al cargar las defensas: {error.message}
      </div>
    );
  }

  if (misDefensas.length === 0) {
    return (
      <div className="w-full text-center text-gray-500 mt-10">
        No tienes defensas programadas en este momento.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Mis Defensas Programadas
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-7">
          {misDefensas.map((defense) => (
            <DefenseCard defense={defense} key={defense.id_defensa} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MisDefensas;