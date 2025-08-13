import React from "react";
import { Checkbox } from "primereact/checkbox";
import DefensaCellTipo from "./DefensaCellTipo";

export default function StudentRow({
  student,
  selected,
  onToggle,
  setModalVisible,
  setEstudianteAEditar,
  cargarEstudiantes,
  page,
  pageSize,
  onAskDelete,
}) {
  const checked = selected.includes(student.id_estudiante);

  return (
    <tr className="border-b last:border-none hover:bg-gray-50">
      <td className="px-4 py-3">
        <Checkbox
          inputId={`chk-${student.id_estudiante}`}
          checked={checked}
          onChange={() => onToggle(student.id_estudiante)}
        />
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.id_estudiante}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {student.nombre}, {student.apellido1}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.correo}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.telefono}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.carrera}</td>

      <td className="px-4 py-3">
        <DefensaCellTipo
          tipo="Examen de grado Interna"
          defensas={student.defensas}
          estudianteId={student.id_estudiante}
          cargarEstudiantes={cargarEstudiantes}
          page={page}
          pageSize={pageSize}
        />
      </td>

      <td className="px-4 py-3">
        <DefensaCellTipo
          tipo="Examen de grado Externa"
          defensas={student.defensas}
          estudianteId={student.id_estudiante}
          cargarEstudiantes={cargarEstudiantes}
          page={page}
          pageSize={pageSize}
        />
      </td>

      <td className="px-4 py-3 text-center space-x-2">
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => {
            setModalVisible(true);
            setEstudianteAEditar(student);
          }}
          title="Editar"
        >
          <i className="fas fa-edit" />
        </button>

        <button
          className="text-red-600 hover:text-white hover:bg-red-700 rounded p-1"
          title="Borrar (lógico)"
          onClick={() =>
            onAskDelete(
              `${student.nombre} ${student.apellido1}${
                student.apellido2 ? " " + student.apellido2 : ""
              }`,
              student.id_estudiante
            )
          }
        >
          <i className="fas fa-trash" />
        </button>
      </td>
    </tr>
  );
}
