import TogglePill from "@/features/Administrador/components/common/TogglePill";

export default function FilaArea({ area, onEdit, onToggle, onAskDelete }) {
  return (
    <tr className="border-b last:border-none hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-700">{area.id_area}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{area.nombre_area}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{(area.carreras || []).join(", ")}</td>
      <td className="px-4 py-3">
        <TogglePill active={!!area.estado} onClick={onToggle} />
      </td>
      <td className="px-4 py-3 text-center space-x-3">
        <button className="text-black hover:text-white hover:bg-black rounded p-1" title="Editar" onClick={onEdit}>
          <i className="fas fa-edit"></i>
        </button>
        <button className="text-red-600 hover:text-white hover:bg-red-700 rounded p-1" title="Borrar (lógico)" onClick={onAskDelete}>
          <i className="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  );
}
