import React from "react";

export default function UserRow({ user, onEdit, onAskDelete, onRestore }) {
  const isDeleted = Boolean(user.delete_state);
  return (
    <tr className="border-b last:border-none hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-700">{user.id}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {user.nombres || "Sin nombre"}
        {isDeleted && (
          <span className="ml-2 text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
            Borrado
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{user.correo || "Sin correo"}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {user.roles?.length ? user.roles.map((r) => r.nombre).join(", ") : "Sin roles"}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {user.carreras?.length ? user.carreras.map((c) => c.nombre).join(", ") : "Sin carreras"}
      </td>
      <td className="px-4 py-3 text-center space-x-2">
        {!isDeleted ? (
          <>
            <button className="text-blue-600 hover:text-blue-800" title="Editar" onClick={() => onEdit(user)}>
              <i className="fas fa-edit" />
            </button>
            <button
              className="text-red-600 hover:text-white hover:bg-red-700 rounded p-1"
              title="Borrar (lógico)"
              onClick={() => onAskDelete(user)}
            >
              <i className="fas fa-trash" />
            </button>
          </>
        ) : (
          <button
            className="text-green-700 hover:text-white hover:bg-green-700 rounded p-1"
            title="Restaurar"
            onClick={() => onRestore(user)}
          >
            <i className="fas fa-undo" />
          </button>
        )}
      </td>
    </tr>
  );
}
