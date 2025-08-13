import React from "react";
import RoleRow from "./RoleRow";

export default function RolesTable({ roles, onEdit, onAskDelete, onRestore }) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permisos</th>
          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {roles.map((r) => (
          <RoleRow
            key={r.id}
            rol={r}
            onEdit={onEdit}
            onAskDelete={onAskDelete}
            onRestore={onRestore}
          />
        ))}
      </tbody>
    </table>
  );
}
