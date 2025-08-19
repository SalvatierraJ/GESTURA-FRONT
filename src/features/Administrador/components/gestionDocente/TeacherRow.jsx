import React from "react";
import Horario from "@/features/Administrador/components/gestionDocente/modal-horario";
import TogglePill from "@/features/Administrador/components/common/TogglePill";

export default function TeacherRow({
  docente,
  page,
  pageSize,
  onEdit,
  onToggleEstado,
  onAskDelete,
}) {
  const nombreCompleto = `${docente.Nombre || ""} ${docente.Apellido || ""}${
    docente.Apellido2 ? " " + docente.Apellido2 : ""
  }`.trim();

  return (
    <tr className="border-b last:border-none hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-700">{docente.id_tribunal}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{docente.Nombre}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {docente.Apellido}
        {docente.Apellido2 ? `, ${docente.Apellido2}` : ""}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {(docente.areas || []).map((a) => a.nombre_area).join(", ")}
      </td>
      <td className="px-4 py-3">
        <TogglePill
          active={docente.estado === true}
          onClick={() => onToggleEstado(docente.id_tribunal, !docente.estado)}
          onLabel="Activo Para jurado"
          offLabel="Inactivo Para jurado"
        />
      </td>
      <td className="px-4 py-3 text-center space-x-3">
        <button
          className="text-black hover:text-white hover:bg-black rounded p-1"
          title="Editar"
          onClick={() => onEdit(docente)}
        >
          <i className="fas fa-edit"></i>
        </button>
        <button
          className="text-red-600 hover:text-white hover:bg-red-700 rounded p-1"
          title="Borrar (lógico)"
          onClick={() => onAskDelete(nombreCompleto, docente.id_tribunal)}
        >
          <i className="fas fa-trash"></i>
        </button>
        <Horario
          materiasHorarios={docente.materias_horarios}
          docenteNombre={docente.Nombre}
        />
      </td>
    </tr>
  );
}
