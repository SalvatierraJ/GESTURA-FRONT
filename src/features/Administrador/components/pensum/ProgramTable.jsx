import React from "react";

export default function ProgramTable({
  materiasProgramables,
  HORARIOS_FIJOS,
  cart,
  isInCart,
  handleAddToCart,
  limiteAlcanzado,
  accordion,
  setAccordion,
}) {
  return (
    <div className="space-y-8">
      {Array.from({ length: 6 }, (_, modulo) => {
        const matsModulo = materiasProgramables
          .map((mat) => {
            const horariosEnModulo = (mat.horariosAbiertos ?? []).filter(
              (h) => (h.modulo_inicio ?? 0) === modulo
            );
            if (!horariosEnModulo.length) return null;
            return { ...mat, horariosEnModulo };
          })
          .filter(Boolean);

        if (matsModulo.length === 0) return null;

        return (
          <div key={modulo} className="w-full">
            <button
              className="w-full flex justify-between items-center py-2 px-4 bg-black text-white rounded-t hover:bg-red-800 transition font-semibold mb-0 text-base"
              type="button"
              onClick={() =>
                setAccordion((a) => ({
                  ...a,
                  ["modulo_" + modulo]: !a["modulo_" + modulo],
                }))
              }
            >
              <span className="text-sm">Módulo {modulo}</span>
              <span className="text-xs">
                {accordion["modulo_" + modulo] ? "▲" : "▼"}
              </span>
            </button>
            {accordion["modulo_" + modulo] && (
              <div className="overflow-x-auto border border-black rounded-b shadow">
                <table className="min-w-[950px] w-full bg-white border border-black text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-xs">
                      <th className="text-black font-bold p-2 border border-black text-left sticky left-0 bg-gray-100 z-10 min-w-[190px]">
                        Materia / Sigla
                      </th>
                      {HORARIOS_FIJOS.map((hor, idx) => (
                        <th
                          key={idx}
                          className="text-black font-bold p-2 border border-black text-center min-w-[110px]"
                        >
                          <span className="block text-[11px]">
                            {hor.label}
                          </span>
                          {hor.extra && (
                            <span className="block text-[10px] text-gray-500">
                              {hor.extra}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matsModulo.map((mat, rowIdx) => {
                      const bimod = mat.horariosEnModulo.some((h) => h.bimodular);
                      return (
                        <tr key={rowIdx}>
                          <td className="align-top p-2 border border-black min-w-[190px] bg-gray-50 font-semibold text-black sticky left-0 z-10 text-xs">
                            <span className="block font-bold">{mat.nombre}</span>
                            <span className="block text-[11px] text-gray-700">
                              {mat.siglas}
                            </span>
                            {bimod && (
                              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-bold">
                                Bimodular
                              </span>
                            )}
                          </td>
                          {HORARIOS_FIJOS.map((horFijo, colIdx) => {
                            const horariosCoinciden = mat.horariosEnModulo
                              .map((h, i) => ({ h, i }))
                              .filter(({ h }) => h.horario === horFijo.label);

                            if (!horariosCoinciden.length)
                              return (
                                <td
                                  key={colIdx}
                                  className="p-2 border border-black text-center text-xs"
                                ></td>
                              );

                            return (
                              <td
                                key={colIdx}
                                className="p-2 border border-black text-center text-xs"
                              >
                                {horariosCoinciden.map(({ h, i }, idx) => {
                                  const isAlready = isInCart(
                                    mat.siglas,
                                    mat.horariosAbiertos.indexOf(h)
                                  );
                                  const materiaYaEnCarrito = cart.some(
                                    (item) => item.siglas === mat.siglas
                                  );
                                  return (
                                    <button
                                      key={idx}
                                      className={`w-full px-1 py-1 rounded-md font-semibold shadow border transition text-xs
                                        ${
                                          isAlready || materiaYaEnCarrito
                                            ? "bg-red-200 text-red-800 border-red-400 cursor-not-allowed"
                                            : "bg-white text-black border-red-700 hover:bg-red-700 hover:text-white"
                                        }`}
                                      style={{ fontSize: "11px" }}
                                      disabled={
                                        isAlready ||
                                        materiaYaEnCarrito ||
                                        limiteAlcanzado
                                      }
                                      title={
                                        limiteAlcanzado
                                          ? "No puedes programar más de 8 materias"
                                          : ""
                                      }
                                      onClick={() =>
                                        !materiaYaEnCarrito &&
                                        handleAddToCart(
                                          mat,
                                          mat.horariosAbiertos.indexOf(h)
                                        )
                                      }
                                    >
                                      <span className="block font-bold">
                                        Grupo: {h.grupo}
                                      </span>
                                      <span className="block text-[10px]">
                                        {h.modalidad} 
                                      </span>
                                      {isAlready || materiaYaEnCarrito
                                        ? "Agregado"
                                        : limiteAlcanzado
                                        ? "Límite alcanzado"
                                        : "Agregar"}
                                    </button>
                                  );
                                })}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
