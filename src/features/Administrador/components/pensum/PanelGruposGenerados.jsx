export default function PanelGruposGenerados({ grupos, eliminarGrupo, getAnchoGrupo }) {
  return (
    <div className="md:w-96">
      <h3 className="text-lg font-bold mb-3 text-red-700 uppercase tracking-wide">
        Grupos generados
      </h3>
      <div className="flex flex-col gap-5">
        {grupos.length === 0 && (
          <div className="text-gray-400 bg-white border-2 border-red-700 rounded-xl p-6 text-center">
            Aún no hay grupos generados.
          </div>
        )}
        {grupos.map((g, i) => (
          <div
            key={i}
            className={`relative rounded-xl shadow-lg border-2 border-red-700 p-4 transition-all duration-300 ${getAnchoGrupo(
              g.cantidad
            )} bg-white flex flex-col gap-2`}
            style={{
              minWidth: "180px",
              maxWidth: "100%",
            }}
          >
            <button
              onClick={() => eliminarGrupo(i)}
              className="absolute top-2 right-2 text-white hover:text-black text-xl font-bold rounded-full px-2 transition"
              title="Eliminar grupo"
            >
              ×
            </button>
            <div className="flex justify-between items-center">
              <span className="font-black text-lg text-black">{g.turno}</span>
              <span className="text-sm font-bold px-2 py-1 rounded bg-red-700 text-white">
                {g.modulo}
              </span>
            </div>
            <div className="text-black text-xs mb-2">
              {g.materia} ({g.sigla})
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-700">
                {g.cantidad} estudiante{g.cantidad !== 1 ? "s" : ""}
              </span>
            </div>
            <ul className="pl-5 mt-1 text-xs text-gray-700 max-h-16 overflow-y-auto">
              {g.estudiantes.map((est) => (
                <li key={est.registro}>
                  {est.nombre} ({est.registro})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
