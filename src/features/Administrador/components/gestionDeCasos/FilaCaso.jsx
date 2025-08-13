import TogglePill from "@/features/Administrador/components/common/TogglePill";

export default function FilaCaso({
  caso, onPreview, onToggle, onAskDelete, onEdit,
}) {
  return (
    <tr className="border-b last:border-none hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-700">{caso.id_casoEstudio}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{caso.Nombre_Archivo}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{caso.areaName}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{caso.Tema}</td>
      <td className="px-4 py-3">
        <TogglePill active={!!caso.estado} onClick={onToggle} />
      </td>
      <td className="px-4 py-3 text-center space-x-2">
        <button className="text-black hover:text-white hover:bg-black rounded p-1" title="Editar" onClick={onEdit}>
          <i className="fas fa-edit"></i>
        </button>
        <button className="text-red-600 hover:text-white hover:bg-red-700 rounded p-1" title="Borrar (lógico)" onClick={onAskDelete}>
          <i className="fas fa-trash"></i>
        </button>
        <button className="text-blue-600 hover:text-blue-800" title="Previsualizar" onClick={()=>onPreview(caso.url)}>
          <i className="fas fa-eye"></i>
        </button>
      </td>
    </tr>
  );
}
