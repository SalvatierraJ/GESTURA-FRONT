import toast from "react-hot-toast";
export default function CartSidebar({
  cart,
  totalMat,
  handleRemoveFromCart,
  limiteAlcanzado,
  handleRegistrarMaterias,
  loadingRegistrar,
}) {
  const MODULOS = ["M0", "M1", "M2", "M3", "M4", "M5"];

  const moduloCounts = MODULOS.map((mod, idx) => {
    return cart.filter((item) => {
      const moduloIdx =
        typeof item.modulo_inicio !== "undefined"
          ? item.modulo_inicio
          : typeof item.modulo !== "undefined"
          ? item.modulo
          : null;

      if (typeof moduloIdx === "string" && moduloIdx.startsWith("M")) {
        return moduloIdx === mod;
      }
      return Number(moduloIdx) === idx;
    }).length;
  });

  return (
    <div className="w-full md:w-80 max-w-full bg-white rounded-xl shadow-2xl border-2 border-red-800 flex flex-col">
      <div className="flex gap-2 justify-between items-center bg-white rounded-t-xl p-3 border-b border-red-100">
        {MODULOS.map((mod, i) => (
          <div key={mod} className="flex flex-col items-center">
            <div
              className={`
              w-8 h-8 flex items-center justify-center rounded-full
              font-bold text-white
              ${moduloCounts[i] > 0 ? "bg-red-600" : "bg-gray-300"}
              border-2 border-red-400
              transition
            `}
            >
              {mod}
            </div>
            <span className="text-xs mt-1 font-bold text-red-700">
              {moduloCounts[i]}
            </span>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {cart.length === 0 ? (
          <div className="text-gray-500 text-center">
            No hay materias seleccionadas.
          </div>
        ) : (
          <div className="grid gap-2">
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 border rounded p-2 bg-red-50 border-red-300"
              >
                <div className="flex-1">
                  <div className="font-semibold text-black">{item.nombre}</div>
                  <div className="text-xs text-gray-800">
                    {item.horario.grupo} {item.horario.turno}{" "}
                    {item.horario.horario} ({item.horario.modalidad})<br />
                    <span className="font-semibold">Módulo:</span>{" "}
                    {item.modulo_inicio}
                    {item.modulo_fin !== item.modulo_inicio
                      ? ` - ${item.modulo_fin}`
                      : ""}
                  </div>
                </div>
                <button
                  className="px-2 py-1 bg-red-600 hover:bg-red-800 text-white rounded text-xs"
                  onClick={() => handleRemoveFromCart(idx)}
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 p-3 border-t border-red-200">
        <button
          className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-3 rounded-lg shadow transition"
          disabled={cart.length === 0 || totalMat > 8}
          onClick={() => {
            if (totalMat > 8) {
              toast.error(
                "No puedes programar más de 8 materias (bimodular cuenta doble)"
              );
              return;
            }
            toast.success("¡Materias registradas!");
            handleRegistrarMaterias();
          }}
        >
          {loadingRegistrar ? "Registrando..." : "Registrar Materias"}
        </button>
        <div className="mt-2 text-xs text-red-800 text-center font-bold">
          {totalMat >= 8 &&
            "¡Límite de 8 materias alcanzado! Elimina alguna para agregar otra."}
        </div>
      </div>
    </div>
  );
}
