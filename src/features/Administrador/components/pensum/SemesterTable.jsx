// components/pensum/SemesterTable.jsx
import EstadoChip from "./EstadoChip";

export default function SemesterTable({
  sem,
  materias,
  accordion,
  toggleAccordion,
  todasAprobadas,
  contarAprobadas
}) {
  const {aprobadas, total} = contarAprobadas(materias);
  return (
    <div className="mb-2 border-b border-black">
      <button
        className={`w-full flex justify-between items-center py-2 px-4 ${
          todasAprobadas(materias) ? "bg-gray-600" : "bg-black"
        } text-white rounded-t hover:bg-red-800 transition font-semibold`}
        onClick={() => toggleAccordion(sem)}
        type="button"
      >
        <span>Semestre {sem}</span>
        <span>{aprobadas}/{total} Materias</span>
        <span>{accordion[sem] ? "▲" : "▼"}</span>
      </button>
      {accordion[sem] && (
        <div className="overflow-x-auto max-w-full">
          <table className="min-w-[700px] w-full mt-0 bg-white">
            <thead>
              <tr className="bg-red-100">
                <th className="text-black p-2 border-b border-black">Código</th>
                <th className="text-black p-2 border-b border-black">Materia</th>
                <th className="text-black p-2 border-b border-black">Estado</th>
                <th className="text-black p-2 border-b border-black">Prerrequisitos</th>
                <th className="text-black p-2 border-b border-black">Equivalencias</th>
                <th className="text-black p-2 border-b border-black">Veces cursada</th>
              </tr>
            </thead>
            <tbody>
              {materias.map((mat) => (
                <tr
                  key={mat.siglas}
                  className={
                    mat.estado === "aprobada"
                      ? "bg-green-50 border-l-4 border-green-700"
                      : mat.puedeCursar
                      ? "bg-blue-50 border-l-4 border-blue-600"
                      : "bg-white"
                  }
                >
                  <td className="p-2 border-b border-black text-black">{mat.siglas}</td>
                  <td className="p-2 border-b border-black text-black">{mat.nombre}</td>
                  <td className="p-2 border-b border-black text-center font-bold">
                    <EstadoChip estado={mat.estado} puedeCursar={mat.puedeCursar} />
                  </td>
                  <td className="p-2 border-b border-black text-black">
                    {mat.prerrequisitos?.length > 0
                      ? mat.prerrequisitos
                          .map((pr) =>
                            pr.nombre
                              ? `${pr.nombre} (${pr.sigla ?? ""})`
                              : pr.total_materia
                              ? `Aprobar ${pr.total_materia} materias`
                              : ""
                          )
                          .join(", ")
                      : "-"}
                  </td>
                  <td className="p-2 border-b border-black text-black">
                    {mat.equivalencias?.length > 0 ? mat.equivalencias.join(", ") : "-"}
                  </td>
                  <td className="p-2 border-b border-black text-black">{mat.vecesCursada}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
