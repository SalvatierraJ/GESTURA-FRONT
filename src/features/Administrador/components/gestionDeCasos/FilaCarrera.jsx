import TogglePill from "@/features/Administrador/components/common/TogglePill";

export default function FilaCarrera({ carrera, onEdit, onToggle, onAskDelete }) {
  return (
    <tr className="border-b last:border-none hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-700">{carrera.id_carrera}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{carrera.nombre_carrera}</td>
      <td className="px-4 py-3">
        <TogglePill active={!!carrera.estado} onClick={onToggle} />
      </td>
      <td className="px-4 py-3 text-center space-x-3">
        <button className="text-black hover:text-white hover:bg-black rounded p-1" title="Editar" onClick={onEdit}>
          <i className="fas fa-edit"></i>
        </button>
        <button className="text-red-600 hover:text-red-800" title="Borrar (lógico)" onClick={onAskDelete}>
          <i className="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  );
}
