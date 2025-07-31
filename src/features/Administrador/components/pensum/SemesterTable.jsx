// components/pensum/SemesterTable.jsx
import EstadoChip from "./EstadoChip";

export default function SemesterTable({
  sem,
  materias,
  accordion,
  toggleAccordion,
  todasAprobadas,
  contarAprobadas,
  editable = false,
  onEditPrereq, 
  onDeletePrereq, 
  onEditEquiv, 
  onDeleteEquiv, 
}) {
  const { aprobadas, total } = contarAprobadas(materias);
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
        <span>
          {aprobadas}/{total} Materias
        </span>
        <span>{accordion[sem] ? "▲" : "▼"}</span>
      </button>
      {accordion[sem] && (
        <div className="overflow-x-auto max-w-full">
          <table className="min-w-[700px] w-full mt-0 bg-white">
            <thead>
              <tr className="bg-red-100">
                <th className="text-black p-2 border-b border-black">Código</th>
                <th className="text-black p-2 border-b border-black">
                  Materia
                </th>
                <th className="text-black p-2 border-b border-black">Estado</th>
                <th className="text-black p-2 border-b border-black">
                  Prerrequisitos
                </th>
                <th className="text-black p-2 border-b border-black">
                  Equivalencias
                </th>
                <th className="text-black p-2 border-b border-black">
                  Veces cursada
                </th>
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
                  <td className="p-2 border-b border-black text-black">
                    {mat.siglas}
                  </td>
                  <td className="p-2 border-b border-black text-black">
                    {mat.nombre}
                  </td>
                  <td className="p-2 border-b border-black text-center font-bold">
                    <EstadoChip
                      estado={mat.estado}
                      puedeCursar={mat.puedeCursar}
                    />
                  </td>
                  <td className="p-2 border-b border-black text-black">
                    {mat.prerrequisitos?.length > 0 ? (
                      mat.prerrequisitos.map((pr, prIndex) => (
                        <span
                          key={prIndex}
                          className="inline-flex items-center mr-2"
                        >
                          {pr.nombre
                            ? `${pr.nombre} (${pr.sigla ?? ""})`
                            : pr.total_materia
                            ? `Aprobar ${pr.total_materia} materias`
                            : ""}
                          {editable && (
                            <>
                              <button
                                className="ml-1 px-1 rounded text-blue-600 hover:bg-blue-100"
                                title="Editar prerrequisito"
                                onClick={() =>
                                  onEditPrereq && onEditPrereq(mat, prIndex)
                                }
                              >
                                ✎
                              </button>
                            </>
                          )}
                        </span>
                      ))
                    ) : editable ? (
                      <button
                        className="px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
                        onClick={() => onEditPrereq && onEditPrereq(mat, null)}
                        title="Agregar prerrequisito"
                      >
                        + Agregar
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2 border-b border-black text-black">
                    {mat.equivalencias?.length > 0 ? (
                      mat.equivalencias.map((eq, eqIndex) => (
                        <span
                          key={eq.id || eqIndex || eq}
                          className="inline-flex items-center mr-2"
                        >
                          {/* Si es objeto muestra nombre/sigla, si es string solo el string */}
                          {typeof eq === "object" && eq !== null
                            ? `${eq.nombre}${eq.sigla ? ` (${eq.sigla})` : ""}`
                            : eq}
                          {editable && (
                            <>
                              <button
                                className="ml-1 px-1 rounded text-blue-600 hover:bg-blue-100"
                                title="Editar equivalencia"
                                onClick={() =>
                                  onEditEquiv && onEditEquiv(mat, eqIndex)
                                }
                              >
                                ✎
                              </button>
                            </>
                          )}
                        </span>
                      ))
                    ) : editable ? (
                      <button
                        className="px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
                        onClick={() => onEditEquiv && onEditEquiv(mat, null)}
                        title="Agregar equivalencia"
                      >
                        + Agregar
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2 border-b border-black text-black">
                    {mat.vecesCursada}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
