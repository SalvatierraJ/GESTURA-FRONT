import React from "react";

export default function RoleRow({ rol, onEdit, onAskDelete, onRestore }) {
  const isDeleted = Boolean(rol.delete_state);
  return (
    <tr className="border-b last:border-none hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-700">{rol.id}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {rol.nombre}
        {isDeleted && (
          <span className="ml-2 text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
            Borrado
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {rol.modulos?.length
          ? [...new Set(rol.modulos.map((m) => m?.nombre))].join(", ")
          : "Sin permisos"}
      </td>
      <td className="px-4 py-3 text-center space-x-2">
        {!isDeleted ? (
          <>
            <button className="text-blue-600 hover:text-blue-800" title="Editar" onClick={() => onEdit(rol)}>
              <i className="fas fa-edit" />
            </button>
            <button
              className="text-red-600 hover:text-white hover:bg-red-700 rounded p-1"
              title="Borrar (lógico)"
              onClick={() => onAskDelete(rol)}
            >
              <i className="fas fa-trash" />
            </button>
          </>
        ) : (
          <button
            className="text-green-700 hover:text-white hover:bg-green-700 rounded p-1"
            title="Restaurar"
            onClick={() => onRestore(rol)}
          >
            <i className="fas fa-undo" />
          </button>
        )}
      </td>
    </tr>
  );
}
