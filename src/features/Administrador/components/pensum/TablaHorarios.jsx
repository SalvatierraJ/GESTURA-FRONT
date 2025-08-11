// components/TablaHorarios.jsx
import React from "react";

export default function TablaHorarios({
  materiaData,
  materiaSeleccionada,
  acordeon,
  horariosApertura,
  modulosSeleccion,
  estudiantesSeleccion,
  cantidadGrupo,
  getEstudiantesPorTurno,
  handleApertura,
  toggleAcordeon,
  setModulosSeleccion,
  setCantidadGrupo,
  setEstudiantesSeleccion,
  handleCrearGrupo,
  MODULOS,
}) {
  if (!materiaData) return null;
  const semestreMateria = parseInt(materiaData.materia.semestre);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-2 border-red-700 rounded-xl bg-white shadow text-black">
        <thead className="bg-red-700 text-white font-semibold uppercase">
          <tr>
            <th className="p-2 border border-red-700">Turno</th>
            <th className="p-2 border border-red-700"># Estudiantes</th>
            <th className="p-2 border border-red-700">Grupos</th>
            <th className="p-2 border border-red-700">Rezagados</th>
            <th className="p-2 border border-red-700">Abrir</th>
            <th className="p-2 border border-red-700">Estudiantes</th>
            <th className="p-2 border border-red-700"></th>
          </tr>
        </thead>
        <tbody>
          {(materiaData?.horarios || []).map((h, idx) => {
            const key = `${materiaSeleccionada}-${idx}`;
            const estudiantesTurno = getEstudiantesPorTurno(h, key);
            const moduloSel = modulosSeleccion[key] || "";
            const seleccionados = estudiantesSeleccion[key] || [];
            const cantidad = Number(cantidadGrupo[key]) || 0;
            const rezagadosCount = estudiantesTurno.filter(
              (est) => est.semestre_actual > semestreMateria
            ).length;

            return (
              <React.Fragment key={h.turno}>
                <tr className={acordeon[key] ? "bg-red-50" : ""}>
                  <td className="p-2 border border-red-700 font-extrabold">
                    {h.turno}
                  </td>
                  <td className="p-2 border border-red-700 text-center">
                    {h.estudiantes}
                  </td>
                  <td className="p-2 border border-red-700 text-center">
                    {h.grupos_sugeridos}
                  </td>
                  <td className="p-2 border border-red-700 text-center">
                    {rezagadosCount}
                  </td>
                  <td className="p-2 border border-red-700 text-center">
                    <input
                      type="checkbox"
                      className="accent-red-700 h-5 w-5"
                      checked={!!horariosApertura[key]}
                      onChange={(e) => handleApertura(idx, e.target.checked)}
                    />
                  </td>
                  <td className="p-2 border border-red-700 text-center">
                    <details>
                      <summary className="cursor-pointer text-sm text-red-700 underline">
                        Ver estudiantes ({estudiantesTurno.length})
                      </summary>
                      <ul className="pl-5 mt-1 text-xs text-gray-700 max-h-24 overflow-y-auto">
                        {estudiantesTurno.map((est, i2) => (
                          <li key={i2}>
                            {est.nombre} ({est.registro})
                            <span className="ml-1 text-gray-500">
                              – Semestre: {est.semestre_actual}
                            </span>
                            {est.semestre_actual > semestreMateria && (
                              <span className="ml-2 px-2 bg-yellow-100 text-yellow-800 rounded">
                                Rezagado
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </td>
                  <td className="p-2 border border-red-700 text-center">
                    <button
                      className="px-2 py-1 rounded bg-white border-2 border-red-700 text-red-700 font-bold hover:bg-red-700 hover:text-white transition"
                      onClick={() => toggleAcordeon(idx)}
                    >
                      {acordeon[key] ? "Ocultar" : "Configurar grupo"}
                    </button>
                  </td>
                </tr>
                {acordeon[key] && horariosApertura[key] && (
                  <tr>
                    <td colSpan={7} className="p-4 border-t-0 bg-red-50 border-b-2 border-red-700">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1">
                          <div className="mb-2 font-bold text-black">Asignar módulo:</div>
                          <div className="flex gap-3 mb-4">
                            {MODULOS.map((mod) => (
                              <button
                                key={mod}
                                className={`px-4 py-2 rounded font-bold border-2 ${
                                  moduloSel === mod
                                    ? "bg-red-700 text-white border-red-700"
                                    : "border-red-300 bg-white text-red-700 hover:bg-red-100"
                                }`}
                                onClick={() =>
                                  setModulosSeleccion((prev) => ({
                                    ...prev,
                                    [key]: mod,
                                  }))
                                }
                              >
                                {mod}
                              </button>
                            ))}
                          </div>
                          <div className="mb-2 font-bold text-black">Cantidad de estudiantes:</div>
                          <input
                            type="number"
                            className="border p-2 rounded mb-4 w-24"
                            min="1"
                            max={estudiantesTurno.length}
                            value={cantidadGrupo[key] || ""}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, "");
                              if (val > estudiantesTurno.length)
                                val = estudiantesTurno.length;
                              setCantidadGrupo((prev) => ({
                                ...prev,
                                [key]: val,
                              }));
                              // Selección automática: prioriza rezagados
                              if (val > 0) {
                                const rezagados = estudiantesTurno.filter(
                                  (est) => est.semestre_actual > semestreMateria
                                );
                                const noRezagados = estudiantesTurno.filter(
                                  (est) => est.semestre_actual <= semestreMateria
                                );
                                const seleccionAutomatica = [
                                  ...rezagados,
                                  ...noRezagados,
                                ]
                                  .slice(0, Number(val))
                                  .map((e) => e.registro);
                                setEstudiantesSeleccion((prev) => ({
                                  ...prev,
                                  [key]: seleccionAutomatica,
                                }));
                              } else {
                                setEstudiantesSeleccion((prev) => ({
                                  ...prev,
                                  [key]: [],
                                }));
                              }
                            }}
                          />
                          <div className="mb-2 font-bold text-black">Selecciona estudiantes:</div>
                          {cantidad > 0 && seleccionados.length > cantidad && (
                            <div className="text-red-500 font-semibold mb-2">
                              ¡No puedes seleccionar más de {cantidad} estudiantes!
                            </div>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto bg-white p-2 rounded border border-red-200">
                            {estudiantesTurno.map((est) => (
                              <label
                                key={est.registro}
                                className={`flex items-center gap-2 ${
                                  est.semestre_actual > semestreMateria ? "font-bold text-yellow-900" : ""
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="accent-red-700"
                                  checked={seleccionados.includes(est.registro)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      if (
                                        cantidad > 0 &&
                                        seleccionados.length >= cantidad
                                      )
                                        return;
                                      setEstudiantesSeleccion((prev) => ({
                                        ...prev,
                                        [key]: [...seleccionados, est.registro],
                                      }));
                                    } else {
                                      setEstudiantesSeleccion((prev) => ({
                                        ...prev,
                                        [key]: seleccionados.filter(
                                          (id) => id !== est.registro
                                        ),
                                      }));
                                    }
                                  }}
                                  disabled={
                                    !seleccionados.includes(est.registro) &&
                                    cantidad > 0 &&
                                    seleccionados.length >= cantidad
                                  }
                                />
                                <span>
                                  {est.nombre}{" "}
                                  <span className="text-xs text-gray-600">
                                    (Registro: {est.registro}) (Semestre Actual:{" "}
                                    {est.semestre_actual})
                                    {est.semestre_actual > semestreMateria && (
                                      <span className="ml-2 px-2 bg-yellow-100 text-yellow-800 rounded">
                                        Rezagado
                                      </span>
                                    )}
                                  </span>
                                </span>
                              </label>
                            ))}
                          </div>
                          <button
                            disabled={
                              !moduloSel ||
                              seleccionados.length !== cantidad ||
                              cantidad < 1
                            }
                            className={`mt-4 px-5 py-2 font-bold rounded ${
                              !moduloSel ||
                              seleccionados.length !== cantidad ||
                              cantidad < 1
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-red-700 text-white hover:bg-black"
                            }`}
                            onClick={() =>
                              handleCrearGrupo(
                                h.turno,
                                key,
                                estudiantesTurno.filter((e) =>
                                  seleccionados.includes(e.registro)
                                ),
                                moduloSel,
                                cantidad
                              )
                            }
                          >
                            Generar grupo ({seleccionados.length})
                          </button>
                          <div className="mt-2 text-xs">
                            <b>Rezagados seleccionados:</b>{" "}
                            {
                              seleccionados.filter((reg) => {
                                const est = estudiantesTurno.find(
                                  (e) => e.registro === reg
                                );
                                return est && est.semestre_actual > semestreMateria;
                              }).length
                            }
                            {" / "}
                            {seleccionados.length}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
