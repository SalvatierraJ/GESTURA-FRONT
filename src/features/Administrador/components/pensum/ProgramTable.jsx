import React, { useState } from "react";
import { MultiSelect } from "primereact/multiselect";

export default function HorarioModuloTable({
  materiasProgramables,
  cart,
  isInCart,
  handleAddToCart,
  limiteAlcanzado,
  HORARIOS_FIJOS,
  MODULOS,
}) {
  const moduloOptions = MODULOS.map((m) => ({
    label: `Módulo M${m}`,
    value: m,
  }));

  const horarioOptions = HORARIOS_FIJOS.map((h) => ({
    label: `${h.label} (${h.turno}${h.extra ? ", " + h.extra : ""})`,
    value: h.label, 
  }));

  const [modulosSeleccionados, setModulosSeleccionados] = useState(
    moduloOptions.map((opt) => opt.value)
  );
  const [horariosSeleccionados, setHorariosSeleccionados] = useState(
    horarioOptions.map((opt) => opt.value)
  );

  const modulosVisibles = MODULOS.filter((m) =>
    modulosSeleccionados.includes(m)
  );

  return (
    <div>
      {/* MULTISELECTS */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block font-semibold mb-1 text-sm text-black">
            Filtrar módulos:
          </label>
          <MultiSelect
            value={modulosSeleccionados}
            options={moduloOptions}
            onChange={(e) => setModulosSeleccionados(e.value)}
            display="chip"
            placeholder="Selecciona módulos"
            valueTemplate={(selected) =>
              selected.length === moduloOptions.length ? (
                <span className="font-semibold text-green-700">TODOS</span>
              ) : selected.length === 0 ? (
                <span className="text-gray-500">Ninguno</span>
              ) : (
                <span>{selected.length} seleccionados</span>
              )
            }
            className="w-[200px] border-red-700"
            style={{
              background: "white",
              borderColor: "#b91c1c",
              color: "black",
            }}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-sm text-black">
            Filtrar horarios:
          </label>
          <MultiSelect
            value={horariosSeleccionados}
            options={horarioOptions}
            onChange={(e) => setHorariosSeleccionados(e.value)}
            display="chip"
            placeholder="Selecciona horarios"
            valueTemplate={(selected) =>
              selected.length === horarioOptions.length ? (
                <span className="font-semibold text-green-700">TODOS</span>
              ) : selected.length === 0 ? (
                <span className="text-gray-500">Ninguno</span>
              ) : (
                <span>{selected.length} seleccionados</span>
              )
            }
            className="w-[280px] border-red-700"
            style={{
              background: "white",
              borderColor: "#b91c1c",
              color: "black",
            }}
          />
        </div>
      </div>

      {/* TABLA */}
      <div
        className="overflow-x-auto bg-white border border-black rounded-lg shadow-lg"
        style={{ maxHeight: "520px", overflowY: "auto" }}
      >
        <table className="min-w-[950px] w-full border-collapse">
          <thead>
            <tr className="bg-black text-white sticky top-0 z-30">
              <th className="sticky left-0 bg-black px-3 py-2 border-r-2 border-white text-left font-bold text-base min-w-[220px] z-40">
                Materia / Sigla
              </th>
              {modulosVisibles.map((mod, idx) => (
                <th
                  key={idx}
                  className="bg-black text-white text-center px-2 py-1 border-r border-white font-semibold text-base sticky top-0 z-30"
                >
                  <div className="text-base font-bold">M{mod}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {materiasProgramables.map((mat, idx) => (
              <tr
                key={idx}
                className="even:bg-gray-100 hover:bg-red-50 border-b-2 border-black last:border-b-0"
              >
                <td className="sticky left-0 bg-white border-r-2 border-black px-3 py-2 font-bold text-black text-sm min-w-[220px] z-10">
                  <div className="block text-base break-words max-w-[170px] whitespace-pre-line">
                    {mat.nombre}
                  </div>
                  
                  <div className="block text-xs text-gray-700">
                    Codigo: {mat.codigo} , Siglas:{mat.siglas}, semestre: {mat.semestre}
                  </div>
                  <div className="block text-xs text-red-600">
                    {mat.horariosAbiertos?.[0]?.bimodular ? "Bimodular" : ""}
                  </div>
                  <div className="block text-xs text-red-600">
                    {mat.equivalencias.map((e) => e).join(", ")}
                  </div>
                </td>
                {modulosVisibles.map((mod, colIdx) => {
                  const horariosFiltrados = (mat.horariosAbiertos || []).filter(
                    (h) =>
                      h.modulo_inicio === mod &&
                      horariosSeleccionados.includes(h.horario)
                  );

                  if (!horariosFiltrados.length)
                    return (
                      <td
                        key={colIdx}
                        className="border border-black text-center min-w-[90px] px-2 py-2"
                      ></td>
                    );

                  return (
                    <td
                      key={colIdx}
                      className="border border-black min-w-[90px] px-2 py-2"
                    >
                      <div className="flex flex-col gap-1 items-center">
                        {horariosFiltrados.map((h, hi) => {
                          const isAlready = isInCart(
                            mat.siglas,
                            mat.horariosAbiertos.indexOf(h)
                          );
                          const isInAnyGroupInCart = cart.some(
                            (item) => item.siglas === mat.siglas
                          );
                          return (
                            <button
                              key={hi}
                              className={`w-full min-w-[75px] px-2 py-1 rounded font-bold shadow border-2 text-xs transition
                                ${
                                  isAlready
                                    ? "bg-red-200 text-red-700 border-red-500 cursor-not-allowed"
                                    : isInAnyGroupInCart
                                    ? "bg-gray-200 text-gray-400 border-gray-400 cursor-not-allowed"
                                    : "bg-white text-black border-black hover:bg-red-700 hover:text-white"
                                }`}
                              disabled={
                                isAlready ||
                                isInAnyGroupInCart ||
                                limiteAlcanzado
                              }
                              title={`Grupo: ${h.grupo} | ${h.modalidad} | ${h.horario}`}
                              onClick={() =>
                                !isInAnyGroupInCart &&
                                handleAddToCart(
                                  mat,
                                  mat.horariosAbiertos.indexOf(h)
                                )
                              }
                            >
                              <span className="block text-base">
                                Grupo: {h.grupo}
                              </span>
                              {h.horario && (
                                <span className="block text-[11px] text-red-600">
                                  {h.horario}
                                </span>
                              )}
                              {h.modalidad && (
                                <span className="block text-[10px] text-black">
                                  {h.modalidad}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
