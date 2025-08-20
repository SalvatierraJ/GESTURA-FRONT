import { create } from "zustand";
import {
  fetchDocentes,
  createDocente,
  updateDocente,
  // endpoint unificado + helpers
  setEstadoDocente,
  softDeleteDocente,
  restoreDocente,
  // historial / IA / asignaciones
  materiaHistorialDocente,
  sugerirDocentePorMateria,
  asignarDocenteMateria,
  desasignarDocenteDeHorario,
} from "@/services/docentes.services";

export const useDocentesStore = create((set, get) => ({
  docentes: [],
  total: 0,
  page: 1,
  pageSize: 10,

  materiasHistorial: [],
  docentesHistorial: [],
  loadingHistorial: false,
  errorHistorial: null,

  loading: false,
  error: null,

  asignando: {},
  asignarError: null,

  iaLoading: false,
  iaError: null,
  iaSugerencias: {}, 

  // ------------------ LISTADO ------------------
  cargarDocentes: async (page, pageSize, word = "") => {
    set({ loading: true, error: null });
    try {
      const data = await fetchDocentes(page, pageSize, word);
      set({
        docentes: data.items || [],
        total: data.total || 0,
        page: data.page || page,
        pageSize: data.pageSize || pageSize,
        loading: false,
      });
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
    }
  },

  // ------------------ CRUD ------------------
  nuevoDocente: async ({ Persona, area_especializacion }) => {
    set({ loading: true, error: null });
    try {
      const creado = await createDocente({ Persona, area_especializacion });
      set((state) => ({
        docentes: [...state.docentes, creado],
        loading: false,
      }));
      return creado;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  actualizarDocente: async ({ id, Persona, area_especializacion }) => {
    set({ loading: true, error: null });
    try {
      const data = await updateDocente({ id, Persona, area_especializacion });
      set((state) => ({
        docentes: state.docentes.map((d) =>
          d.id_tribunal === id ? { ...d, ...data } : d
        ),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  // ------------------ ESTADO / BORRADO LÓGICO ------------------
  actualizarEstadoDocente: async ({ id, estado }) => {
    set({ loading: true, error: null });
    try {
      const data = await setEstadoDocente(id, estado);
      set((state) => ({
        docentes: state.docentes.map((d) =>
          d.id_tribunal === id ? { ...d, estado: data.estado } : d
        ),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  borrarDocente: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await softDeleteDocente(id);
      set((state) => ({
        docentes: state.docentes.filter((d) => d.id_tribunal !== id),
        loading: false,
      }));
      return res;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  restaurarDocente: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await restoreDocente(id);
      const { page, pageSize } = get();
      await get().cargarDocentes(page, pageSize);
      set({ loading: false });
      return res;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  // ------------------ HISTORIAL ------------------
  cargarHistorialDocenteMaterias: async () => {
    set({ loadingHistorial: true, errorHistorial: null });
    try {
      const data = await materiaHistorialDocente();
      set({
        materiasHistorial: Array.isArray(data?.materias) ? data.materias : [],
        docentesHistorial: Array.isArray(data?.docentes) ? data.docentes : [],
        loadingHistorial: false,
      });
    } catch (error) {
      set({ errorHistorial: error, loadingHistorial: false });
    }
  },

  limpiarHistorial: () => {
    set({
      materiasHistorial: [],
      docentesHistorial: [],
      errorHistorial: null,
    });
  },

  // ------------------ IA ------------------
  _buildPayloadIA: (materiaId) => {
    const { materiasHistorial, docentesHistorial } = get();

    const materia = (materiasHistorial || []).find(
      (m) => String(m.id) === String(materiaId)
    );
    if (!materia) throw new Error("Materia no encontrada en el historial.");

    const materiaPayload = {
      id: String(materia.id),
      sigla: materia.sigla,
      horario: materia.horario,
      modulo: materia.modulo ?? "M0",
    };

    const docentesPayload = (docentesHistorial || []).map((d) => {
      const doc = d?.docente || {};
      const materiasD = Array.isArray(d?.materias) ? d.materias : [];
      return {
        docente: {
          id: String(doc.id),
          nombres: doc.nombres,
          ap_paterno: doc.ap_paterno,
          ap_materno: doc.ap_materno,
        },
        materias: materiasD.map((x) => ({
          sigla: x.sigla,
          horario: x.horario ?? null,
          gestion: x.gestion ?? d.gestion ?? null,
        })),
      };
    });

    return { materia: materiaPayload, docentes: docentesPayload };
  },

  sugerirDocenteIAParaMateria: async (materiaId) => {
    set({ iaLoading: true, iaError: null });
    try {
      const payload = get()._buildPayloadIA(materiaId);
      const resp = await sugerirDocentePorMateria(payload);
      const best = resp?.best ?? null;
      const candidatos = Array.isArray(resp?.candidatos) ? resp.candidatos : [];

      const result = { best, candidatos, raw: resp };

      set((state) => ({
        iaLoading: false,
        iaSugerencias: {
          ...state.iaSugerencias,
          [String(materiaId)]: result,
        },
      }));

      return result;
    } catch (error) {
      set({ iaError: error, iaLoading: false });
      throw error;
    }
  },

  // ------------------ ASIGNACIONES ------------------
  setDocenteLocal: (id_horario, id_docente) => {
    set((state) => ({
      materiasHistorial: (state.materiasHistorial || []).map((m) =>
        String(m.id) === String(id_horario)
          ? { ...m, id_docente: id_docente != null ? String(id_docente) : "" }
          : m
      ),
    }));
  },

  guardarAsignacion: async (id_horario, id_docente) => {
    const idKey = String(id_horario);
    const prev = get().materiasHistorial;

    set((state) => ({
      asignando: { ...state.asignando, [idKey]: true },
      asignarError: null,
    }));
    get().setDocenteLocal(id_horario, id_docente);

    try {
      const resp = await asignarDocenteMateria({
        id_horario: Number(id_horario),
        id_docente: id_docente != null ? Number(id_docente) : null,
      });
      return resp;
    } catch (err) {
      set({ materiasHistorial: prev, asignarError: err });
      throw err;
    } finally {
      set((state) => {
        const next = { ...state.asignando };
        delete next[idKey];
        return { asignando: next };
      });
    }
  },

  desasignarDocente: async (id_horario) => {
    return get().guardarAsignacion(id_horario, null);
  },

  limpiarSugerenciasIA: () => set({ iaSugerencias: {}, iaError: null }),

  getIaBestFor: (materiaId) => {
    const s = get().iaSugerencias[String(materiaId)];
    return s?.best ?? null;
  },

  getIaCandidatosFor: (materiaId) => {
    const s = get().iaSugerencias[String(materiaId)];
    return s?.candidatos ?? [];
  },
}));
