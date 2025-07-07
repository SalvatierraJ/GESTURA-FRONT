import React, { useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import ManagementLayout from "@/components/administradorContenido";
import ModalAsignarJurados from "@/features/Administrador/components/modal-asignarJurado";

const DefenseRow = ({ student, selected, onToggle }) => {
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
        {student.firstName},{student.lastName}{" "}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.tipoDefensa}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.dateDefense}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.timeDefense}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.classroom}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.jurado}</td>
      <td className="px-4 py-3">
        {student.status === "Asignado" && (
          <span className="text-xs font-semibold text-green-800 bg-green-200 px-2 py-1 rounded-full">
            {student.status}
          </span>
        )}
        {student.status === "Pendiente" && (
          <span className="text-xs font-semibold text-yellow-800 bg-yellow-200 px-2 py-1 rounded-full">
            {student.status}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.notaFinal}</td>

      <td className="px-4 py-3 text-center space-x-2">
        <button className="text-blue-600 hover:text-blue-800">
          <i className="fas fa-edit"></i>
        </button>
      </td>
    </tr>
  );
};

const MainContent = () => {
  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState("Interna");

  const students = [
    {
      id: "01",
      firstName: "hernesto",
      lastName: "salaz",
      tipoDefensa: "Examen de Grado",
      dateDefense: "2023-10-26",
      timeDefense: "10:00 AM",
      classroom: "Aula 101",
      jurado: "Dr. Salaz",
      status: "Asignado",
      notaFinal: "8.5",
      typeContract: "Tiempo completo",
    },
    {
      id: "02",
      firstName: "judair",
      lastName: "salaz",
      tipoDefensa: "Examen de Grado",
      dateDefense: "2023-10-26",
      timeDefense: "10:00 AM",
      classroom: "Aula 102",
      jurado: "Dr. Salaz",
      status: "Pendiente",
      notaFinal: "8.0",
      typeContract: "Medio tiempo",
    },
    {
      id: "03",
      firstName: "elmepp",
      lastName: "salaz",
      tipoDefensa: "Examen de Grado",
      dateDefense: "2023-10-26",
      timeDefense: "10:00 AM",
      classroom: "Aula 103",
      jurado: "Dr. Salaz",
      status: "Asignado",
      notaFinal: "9.0",
    },
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
    <ModalAsignarJurados
      estudianteIds={selected}
      triggerLabel="Asignar Jurados"
      onSubmit={(data) => {
        console.log(data);
      }}
    />,
  ];
  const tabs = [
    {
      key: "Interna",
      label: "Examen de Grado Interna",
      count: students.length,
    },
    {
      key: "Externa",
      label: "Examen de Grado Externa",
      count: students.length,
    },
  ];

  return (
    <ManagementLayout
      title="Defensas Programadas"
      actions={actions}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "Interna" && (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3"></th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estudiante
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo de Defensa
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Defensa
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hora de Defensa
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aula
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jurado
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nota Final
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <DefenseRow
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
