export default function EstadoChip({ estado, puedeCursar }) {
  if (estado === "aprobada")
    return (
      <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded text-xs font-bold">
        Aprobada
      </span>
    );
  if (puedeCursar)
    return (
      <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">
        Puede cursar
      </span>
    );
  return (
    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">
      Pendiente
    </span>
  );
}
