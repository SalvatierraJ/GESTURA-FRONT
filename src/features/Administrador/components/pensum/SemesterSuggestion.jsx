import React from "react";

export default function SemesterSuggestion({ materiasPorSemestre, cart }) {
  return (
    <div className="mb-6">
      {Object.entries(materiasPorSemestre).map(([sem, materiasSemestre]) => {
        const pendientes = materiasSemestre.filter(
          (mat) =>
            mat.estado !== "aprobada" &&
            !cart.some((c) => c.siglas === mat.siglas)
        );
        if (pendientes.length === 1 || pendientes.length === 2) {
          return (
            <div
              key={sem}
              className="mb-3 p-3 border border-yellow-400 bg-yellow-50 rounded-lg flex items-center gap-3 text-xs"
            >
              <span className="font-semibold text-yellow-900">
                Sugerencia: Completa el semestre {sem} agregando&nbsp;
                {pendientes.map((mat, i) => (
                  <span
                    key={mat.siglas}
                    className="font-bold text-yellow-800"
                  >
                    {mat.nombre} ({mat.siglas})
                    {i < pendientes.length - 1 && " y "}
                  </span>
                ))}
              </span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
