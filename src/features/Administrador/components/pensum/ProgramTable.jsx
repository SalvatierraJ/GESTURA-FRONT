import React, { useState } from "react";
import { MultiSelect } from 'primereact/multiselect';

export default function HorarioModuloTable({
  materiasProgramables,
  cart,
  isInCart,
  handleAddToCart,
  limiteAlcanzado,
  HORARIOS_FIJOS,
  MODULOS,
}) {
  const horarioOptions = HORARIOS_FIJOS.map((hor, idx) => ({
    label: `${hor.label} (${hor.turno}${hor.extra ? ', ' + hor.extra : ''})`,
    value: idx,
  }));
  const moduloOptions = MODULOS.map((m) => ({
    label: `Módulo ${m}`,
    value: m,
  }));

  const [horariosSeleccionados, setHorariosSeleccionados] = useState(horarioOptions.map(opt => opt.value));
  const [modulosSeleccionados, setModulosSeleccionados] = useState(moduloOptions.map(opt => opt.value));


  function toggleHorario(idx) {
    setHorariosSeleccionados((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  }
  function toggleModulo(mod) {
    setModulosSeleccionados((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  }

  const horariosVisibles = HORARIOS_FIJOS.filter((_, idx) =>
    horariosSeleccionados.includes(idx)
  );
  const modulosVisibles = MODULOS.filter((m) =>
    modulosSeleccionados.includes(m)
  );

  return (
   <div>
      {/* MULTISELECT PrimeReact */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block font-semibold mb-1 text-sm text-black">Filtrar horarios:</label>
          <MultiSelect
            value={horariosSeleccionados}
            options={horarioOptions}
            onChange={(e) => setHorariosSeleccionados(e.value)}
            display="chip"
            placeholder="Selecciona horarios"
            className="w-[250px] border-red-700"
            style={{ background: 'white', borderColor: '#b91c1c', color: 'black' }}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-sm text-black">Filtrar módulos:</label>
          <MultiSelect
            value={modulosSeleccionados}
            options={moduloOptions}
            onChange={(e) => setModulosSeleccionados(e.value)}
            display="chip"
            placeholder="Selecciona módulos"
            className="w-[170px] border-red-700"
            style={{ background: 'white', borderColor: '#b91c1c', color: 'black' }}
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto bg-white border border-black rounded-lg shadow-lg">
        <table className="min-w-[950px] w-full border-collapse">
          <thead>
            <tr className="bg-black text-white">
              <th className="sticky left-0 bg-black px-3 py-2 border-r-2 border-white text-left font-bold text-base min-w-[220px] z-20">
                Materia / Sigla
              </th>
              {horariosVisibles.map((hor, idx) => (
                <th
                  key={idx}
                  className="text-center px-2 py-1 border-r border-white font-semibold text-base"
                >
                  <div className="text-base font-bold">{hor.label}</div>
                  <div className="text-[10px] text-gray-200 uppercase">
                    {hor.turno}
                  </div>
                  {hor.extra && (
                    <div className="text-[9px] text-red-300">{hor.extra}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materiasProgramables.map((mat, idx) => (
              <tr key={idx} className="even:bg-gray-100 hover:bg-red-50 border-b-2 border-black last:border-b-0">
                <td className="sticky left-0 bg-white border-r-2 border-black px-3 py-2 font-bold text-black text-sm min-w-[220px] z-10">
                  <div className="block text-base">{mat.nombre}</div>
                  <div className="block text-xs text-gray-700">
                    {mat.siglas}, semestre: {mat.semestre}
                  </div>
                  <div className="block text-xs text-red-600">
                    {mat.horariosAbiertos?.[0]?.bimodular ? "Bimodular" : ""}
                  </div>
                </td>
                {horariosVisibles.map((hor, colIdx) => {
                  const horariosEnColumna = (mat.horariosAbiertos || []).filter(
                    (h) =>
                      h.horario === hor.label &&
                      modulosSeleccionados.includes(h.modulo_inicio)
                  );
                  if (!horariosEnColumna.length)
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
                        {horariosEnColumna.map((h, hi) => {
                          const isAlready = isInCart(
                            mat.siglas,
                            mat.horariosAbiertos.indexOf(h)
                          );
                          const materiaYaEnCarrito = cart.some(
                            (item) => item.siglas === mat.siglas
                          );
                          const isInAnyGroupInCart = cart.some(
                            (item) => item.siglas === mat.siglas
                          );
                          return (
                            <button
                              key={hi}
                              className={`
                                w-full min-w-[75px] px-2 py-1 rounded font-bold shadow border-2 text-xs transition
                                ${
                                  isAlready
                                    ? "bg-red-200 text-red-700 border-red-500 cursor-not-allowed"
                                    : isInAnyGroupInCart
                                    ? "bg-gray-200 text-gray-400 border-gray-400 cursor-not-allowed"
                                    : "bg-white text-black border-black hover:bg-red-700 hover:text-white"
                                }
                              `}
                              disabled={
                                isAlready ||
                                isInAnyGroupInCart ||
                                limiteAlcanzado
                              }
                              title={`
                                Grupo: ${h.grupo}
                                ${h.modalidad ? " | " + h.modalidad : ""}
                                ${h.horario ? " | " + h.horario : ""}
                                Módulo: ${h.modulo_inicio ?? ""}
                              `}
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
                              {typeof h.modulo_inicio !== "undefined" && (
                                <span className="block text-[11px] text-red-600">
                                  Módulo: {h.modulo_inicio}
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
