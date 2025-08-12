import { create } from "zustand";
import { getModuloperiodo } from "@/services/periodoModulo.services";

function toDate(x) {
  try { return x ? new Date(x) : null; } catch { return null; }
}
function normalizarModulo(m) {
  return String(m ?? "").toUpperCase().trim(); // "M0", "M1", ...
}

export const usePeriodoStore = create((set, get) => ({
  loading: false,
  error: null,

  periodos: [],

  periodosByModulo: {},

  gestionActual: null,

  _autoloaded: false,

  cargarPeriodosGestionActual: async () => {
    const { loading, _autoloaded } = get();
    if (loading || _autoloaded) return;

    set({ loading: true, error: null });
    try {
      const arr = await getModuloperiodo();
      const periodos = Array.isArray(arr) ? arr : [];

      const byModulo = {};
      const gestiones = new Map();

      for (const p of periodos) {
        const modulo = normalizarModulo(p.modulo);
        const item = {
          id: String(p.id_modulo_Periodo ?? ""),
          gestion: String(p.gestion ?? ""),
          modulo,
          modalidad: String(p.modalidad ?? ""),
          inicio: toDate(p.fecha_Inicio),
          fin: toDate(p.fecha_Fin),
          raw: p,
        };
        if (modulo) byModulo[modulo] = item;
        if (item.gestion) {
          gestiones.set(item.gestion, (gestiones.get(item.gestion) ?? 0) + 1);
        }
      }

      let gestionActual = null;
      if (gestiones.size > 0) {
        gestionActual = [...gestiones.entries()].sort((a, b) => b[1] - a[1])[0][0];
      } else if (periodos[0]?.gestion) {
        gestionActual = String(periodos[0].gestion);
      }

      set({
        loading: false,
        periodos,
        periodosByModulo: byModulo,
        gestionActual,
        _autoloaded: true,
      });
    } catch (err) {
      set({ loading: false, error: err, _autoloaded: true });
    }
  },

  getPeriodoDeModulo: (modulo) => {
    const key = normalizarModulo(modulo);
    return get().periodosByModulo[key] ?? null;
  },

  isFechaDentroDeModulo: (modulo, fecha = new Date()) => {
    const p = get().getPeriodoDeModulo(modulo);
    if (!p?.inicio || !p?.fin) return false;
    const d = fecha instanceof Date ? fecha : new Date(fecha);
    return d >= p.inicio && d <= p.fin;
  },

  getModuloPorFecha: (fecha = new Date()) => {
    const d = fecha instanceof Date ? fecha : new Date(fecha);
    const entries = Object.values(get().periodosByModulo);
    return entries.find(p => p.inicio && p.fin && d >= p.inicio && d <= p.fin) ?? null;
  },

  refrescar: async () => {
    set({ _autoloaded: false });
    return get().cargarPeriodosGestionActual();
  },
}));

if (typeof window !== "undefined") {
  const st = usePeriodoStore.getState();
  if (!st._autoloaded) st.cargarPeriodosGestionActual().catch(() => {});
}
