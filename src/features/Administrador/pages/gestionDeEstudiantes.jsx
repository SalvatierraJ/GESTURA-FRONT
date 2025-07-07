import React, { useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import ManagementLayout from "@/components/administradorContenido";
import FechaDefensa from "@/features/Administrador/components/modal-fechaDefensa";
import RegistrarEstudiante from "@/features/Administrador/components/modal-registroEstudiante";
import ImportarEstudiantesExcel from "@/features/Administrador/components/importarEstudiante";
const getDefensaEstado = (defensa) => {
  if (!defensa.fecha && !defensa.area && !defensa.caso) return "SIN_ASIGNAR";
  if (defensa.fecha && defensa.area && defensa.caso) return "ASIGNADO";
  if (defensa.fecha && (!defensa.area || !defensa.caso)) return "PENDIENTE";
  return "SIN_ASIGNAR";
};

const DefensaCell = ({ defensa, estudianteId }) => {
  const estado = getDefensaEstado(defensa);

  if (estado === "ASIGNADO")
    return (
      <span className="text-xs font-semibold text-green-800 bg-green-200 px-2 py-1 rounded-full">
        Asignado
      </span>
    );

  if (estado === "PENDIENTE")
    return (
      <FechaDefensa
        estudianteIds={[estudianteId]}
        triggerLabel="Pendiente"
        triggerIcon="pi pi-plus"
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    );

  return (
    <FechaDefensa
      estudianteIds={[estudianteId]}
      triggerLabel="Sin Asignar"
      triggerIcon="pi pi-calendar-plus"
      onSubmit={(data) => {
        console.log(data);
      }}
    />
  );
};

const StudentRow = ({ student, selected, onToggle }) => {
  const checked = selected.includes(student.id);
  return (
    <tr className="border-b last:border-none hover:bg-gray-50">
      <td className="px-4 py-3">
        <Checkbox
          inputId={`chk-${student.id}`}
          checked={checked}
          onChange={() => onToggle(student.id)}
        />
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.id}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {student.firstName}, {student.lastName}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.email}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.celular}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.Facultad}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.carrera}</td>
      <td className="px-4 py-3">
        <DefensaCell
          defensa={student.defensaInterna}
          estudianteId={student.id}
        />
      </td>
      <td className="px-4 py-3">
        <DefensaCell
          defensa={student.defensaExterna}
          estudianteId={student.id}
        />
      </td>
      <td className="px-4 py-3 text-center space-x-2">
        <button className="text-blue-600 hover:text-blue-800">
          <i className="fas fa-edit"></i>
        </button>
      </td>
    </tr>
  );
};

const MainContent = () => {
  const [activeTab, setActiveTab] = useState("ExamendeGrado");
  const [selected, setSelected] = useState([]);

  const students = [
    {
      id: "01",
      firstName: "hernesto",
      lastName: "salaz",
      email: "Ingeniería de software",
      Facultad: "Activo",
      carrera: "Redes",
      celular: "123456789",
      defensaInterna: {
        fecha: null,
        area: null,
        caso: null,
      },
      defensaExterna: {
        fecha: "2025-07-18 10:00",
        area: "IA",
        caso: "Caso de prueba",
      },
    },
    {
      id: "02",
      firstName: "hernesto",
      lastName: "salaz",
      email: "Ingeniería de software",
      Facultad: "Activo",
      carrera: "Redes",
      celular: "123456789",
      defensaInterna: {
        fecha: null,
        area: null,
        caso: null,
      },
      defensaExterna: {
        fecha: "2025-07-18 10:00",
        area: "IA",
        caso: null,
      },
    },
    {
      id: "03",
      firstName: "hernesto",
      lastName: "salaz",
      email: "Ingeniería de software",
      Facultad: "Activo",
      carrera: "Redes",
      celular: "123456789",
      defensaInterna: {
        fecha: null,
        area: null,
        caso: null,
      },
      defensaExterna: {
        fecha: "2025-07-18 10:00",
        area: "IA",
        caso: null,
      },
    },
  ];

  const tabs = [
    { key: "ExamendeGrado", label: "Examen de Grado", count: students.length },
    {
      key: "ProyectodeGrado",
      label: "Proyecto de Grado",
      count: students.length,
    },
    { key: "Tesis", label: "Tesis", count: students.length },
  ];

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const actions = [
    <div key="search" className="relative">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
        <i className="fas fa-search"></i>
      </span>
      <input
        type="text"
        placeholder="Search"
        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>,
    <RegistrarEstudiante />,
   <ImportarEstudiantesExcel
  onImport={(estudiantesImportados) => {
    // Aquí puedes hacer setStudents([...students, ...estudiantesImportados]);
    // O llamar a tu backend para registrar en lote, etc.
    console.log("Estudiantes importados:", estudiantesImportados);
    // Si quieres añadirlos a tu lista local, tendrás que tener students como useState
  }}
/>
,
    <FechaDefensa
      estudianteIds={selected}
      triggerLabel="Asignar Defensa"
      onSubmit={(data) => {
        console.log(data);
      }}
      disabled={selected.length <= 1}
    />,
  ];

  return (
    <ManagementLayout
      title="Gestión de Estudiantes"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      actions={actions}
    >
      {activeTab === "ExamendeGrado" && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombres Completo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Celular
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facultad
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Carrera
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Defensa Interna
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Defensa Externa
              </th>

              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                selected={selected}
                onToggle={toggleSelect}
              />
            ))}
          </tbody>
        </table>
      )}
    </ManagementLayout>
  );
};

export default MainContent;
