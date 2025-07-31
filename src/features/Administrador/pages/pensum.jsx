import React, { useState } from "react";

const semesters = [
  "1ER. Semestre", "2DO. Semestre", "3ER. Semestre", "4TO. Semestre",
  "5TO. Semestre", "6TO. Semestre", "7MO. Semestre", "8VO. Semestre", "9NO. Semestre",
];
const legend = [
  { label: "Formación Básica", color: "bg-sky-400" },
  { label: "Formación Complementaria", color: "bg-red-600" },
  { label: "Especialidad", color: "bg-yellow-400" },
  { label: "Electiva", color: "bg-lime-400" },
];
const courses = [
  [ { code: "BMS-300", name: "Introducción a las Matemáticas", type: "Formación Básica" },
    { code: "BFG-300", name: "Física I", type: "Formación Básica" },
    { code: "TRBA-330", name: "Introducción a la Vida Universitaria TEC", type: "Formación Básica" },
    { code: "SAI-304", name: "Matemáticas Discretas", type: "Especialidad" },
    { code: "SCC-300", name: "Ciencias de la Computación", type: "Especialidad" },
  ],
  [ { code: "BMS-301", name: "Cálculo I", type: "Formación Básica" },
    { code: "BMA-302", name: "Álgebra Lineal", type: "Formación Básica" },
    { code: "TRBA-933", name: "Expresión oral y Escrita TEC", type: "Formación Básica" },
    { code: "BMA303", name: "Probabilidad y Estadística", type: "Formación Complementaria" },
    { code: "SOI-301", name: "Organización y Arquitectura de Computadoras", type: "Especialidad" },
    { code: "SAL-301", name: "Algoritmos y Programación", type: "Especialidad" },
  ],
[
    { code: "BMS-302", name: "Cálculo II", type: "Formación Básica" },
    {
      code: "TDCO-301",
      name: "Constitución y Ciudadanía TEC",
      type: "Formación Básica",
    },
    {
      code: "BMA-304",
      name: "Investigación Operativa",
      type: "Formación Complementaria",
    },
    {
      code: "SDA-301",
      name: "Fundamentos del Diseño Interactivo",
      type: "Especialidad",
    },
    { code: "SOI-302", name: "Sistemas Operativos", type: "Especialidad" },
    { code: "SIS-301", name: "Base de Datos", type: "Especialidad" },
    {
      code: "SAL-302",
      name: "Algoritmos y Estructura de Datos",
      type: "Especialidad",
    },
  ],
  [
    { code: "SAL-303", name: "Algoritmos y Complejidad", type: "Especialidad" },
    {
      code: "SDA-302",
      name: "Desarrollo de Videojuegos",
      type: "Especialidad",
    },
    { code: "SRF-301", name: "Redes I", type: "Especialidad" },
    {
      code: "SIS-302",
      name: "Administración y Programación de Base de Datos",
      type: "Especialidad",
    },
  ],
  [
    {
      code: "TRBA-337",
      name: "Metodología de Investigación Tecnológica",
      type: "Formación Básica",
    },
    { code: "SRA-304", name: "Redes Inalámbricas", type: "Especialidad" },
    {
      code: "SOI-303",
      name: "Computación Paralela y Distribuida",
      type: "Especialidad",
    },
    {
      code: "SIS-303",
      name: "Análisis y Modelado de Sistemas",
      type: "Especialidad",
    },
    {
      code: "SIS-303",
      name: "Análisis y Modelado de Sistemas",
      type: "Especialidad",
    },
    {
      code: "SIS-303",
      name: "Analisis y Modelado de Sistemas",
      type: "Especialidad",
    },
  ],
  [
    {
      code: "TPMA-301",
      name: "Medio Ambiente TEC",
      type: "Formación Complementaria",
    },

    {
      code: "SOI-304",
      name: "Administración de Sistemas Operativos",
      type: "Especialidad",
    },
    {
      code: "SOI-305",
      name: "Sistema de Información Geográfica",
      type: "Especialidad",
    },
    { code: "SIS-304", name: "Ingeniería de Software", type: "Especialidad" },
    {
      code: "SCC-302",
      name: "Lenguajes Formales y Autómatas",
      type: "Especialidad",
    },
    { code: "SCC-304", name: "Inteligencia Artificial", type: "Especialidad" },
  ],
  [
    {
      code: "RIG-360",
      name: "Inglés Técnico I",
      type: "Formación Complementaria",
    },
    {
      code: "TDCO-312",
      name: "Legislación para Ingenieros TEC",
      type: "Formación Complementaria",
    },
    { code: "SES-301", name: "Electiva I (Sistemas)", type: "Electiva" },
    {
      code: "SRF-304",
      name: "Seguridad de la Información",
      type: "Especialidad",
    },
    {
      code: "SIS-305",
      name: "Calidad y Prueba de Software",
      type: "Especialidad",
    },
    {
      code: "SDA-304",
      name: "Proyecto de Aplicaciones Móviles",
      type: "Especialidad",
    },
  ],
  [
    {
      code: "RIG-362",
      name: "Inglés Técnico II",
      type: "Formación Complementaria",
    },
    {
      code: "TPPY-301",
      name: "Desarrollo Empresarial Tecnológico",
      type: "Formación Complementaria",
    },
    { code: "SES-302", name: "Electiva II (Sistemas)", type: "Electiva" },
    {
      code: "SOI-306",
      name: "Infraestructura de TI y Tecnologías Emergentes",
      type: "Especialidad",
    },

    {
      code: "SOI-307",
      name: "Gestión de Servicios de TI",
      type: "Especialidad",
    },
    { code: "SCC-305", name: "Análisis de datos", type: "Especialidad" },
    { code: "SCC-303", name: "Diseño de Compiladores", type: "Especialidad" },
  ],
  [
    { code: "SES-303", name: "Electiva III (Sistemas)", type: "Electiva" },
    {
      code: "STS-300",
      name: "Taller de Graduación (Sistemas)",
      type: "Especialidad",
    },
    {
      code: "SIS-306",
      name: "Proyecto Integrado de Desarrollo de Soluciones Empresariales",
      type: "Especialidad",
    },
  ], 
];

const colorMap = {
  "Formación Básica": "bg-sky-400 text-white",
  "Formación Complementaria": "bg-red-600 text-white",
  Especialidad: "bg-yellow-300 text-black",
  Electiva: "bg-lime-400 text-black",
};

const Legend = () => (
  <div className="flex space-x-8 mt-3 mb-5 ml-2">
    {legend.map((item, idx) => (
      <div key={idx} className="flex items-center space-x-2">
        <span className={`inline-block w-6 h-4 rounded ${item.color}`}></span>
        <span className="text-xs text-gray-700">{item.label}</span>
      </div>
    ))}
  </div>
);

// Modal flotante para mostrar información de la materia
function CourseInfoModal({ course, open, onClose }) {
  if (!open || !course) return null;
  // Simulamos info aleatoria cada vez que abres el modal
  const isApproved = Math.random() > 0.5;
  const canTake = Math.random() > 0.3;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl px-6 py-5 min-w-[320px] max-w-[96vw] border"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          {course.name} <span className="text-xs text-gray-500 ml-2">{course.code}</span>
        </h3>
        <p className="mb-1">
          <span className="font-medium">Tipo:</span>{" "}
          <span className={colorMap[course.type] + " px-2 py-0.5 rounded"}>{course.type}</span>
        </p>
        <p className="mb-1">
          <span className="font-medium">¿Aprobada?</span>{" "}
          <span className={isApproved ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
            {isApproved ? "Sí" : "No"}
          </span>
        </p>
        <p className="mb-4">
          <span className="font-medium">¿Puede cursarla?</span>{" "}
          <span className={canTake ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
            {canTake ? "Sí" : "No"}
          </span>
        </p>
        <button
          className="mt-1 px-4 py-1 rounded bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold transition"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

function CourseCard({ code, name, type, onClick }) {
  return (
    <div
      className={`rounded px-2 py-2 mb-4 shadow border text-xs font-medium min-w-[165px] max-w-[190px] cursor-pointer hover:scale-105 transition ${colorMap[type]} text-left`}
      onClick={onClick}
    >
      <span className="font-bold tracking-wide">{code}</span>
      <div className="text-[11px] leading-tight font-normal mt-0.5">{name}</div>
    </div>
  );
}

function SemesterColumn({ semester, courses, index, onCourseClick }) {
  return (
    <div className="flex flex-col items-center mx-3 flex-shrink-0" style={{ minWidth: 180 }}>
      <span className="font-bold text-xs text-gray-700 mb-3 whitespace-nowrap">{semester}</span>
      {courses.map((course, idx) => (
        <CourseCard
          key={course.code + idx}
          {...course}
          onClick={() => onCourseClick(course)}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  return (
    <div className="bg-white py-4 px-2 min-h-screen flex flex-col items-center relative">
      <div className="w-full max-w-[1550px]">
        <Legend />
        <div className="relative">
          <div className="flex relative overflow-x-auto pt-2 pb-10 no-scrollbar" style={{ minHeight: 570, minWidth: 1550, paddingBottom: 70 }}>
            {courses.map((matList, idx) => (
              <SemesterColumn
                key={idx}
                semester={semesters[idx]}
                courses={matList}
                index={idx}
                onCourseClick={handleCourseClick}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4 pr-6">
          <span className="text-xs text-gray-600">
            *Diagrama referencial de malla curricular
          </span>
        </div>
      </div>
      {/* Modal */}
      <CourseInfoModal course={selectedCourse} open={showModal} onClose={handleCloseModal} />
    </div>
  );
}
