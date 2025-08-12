import { create } from "zustand";
import {
  fetchDocentes,
  createDocente,
  updateDocente,
  updateStateDocente,
  materiaHistorialDocente,
  sugerirDocentePorMateria,
  asignarDocenteMateria,
  desasignarDocenteDeHorario,
} from "@/services/docentes.services";

// type IaBest = { materia_id: string; docente_id: string; razon: string };
// type IaCandidato = {
//   docente_id: string;
//   nombre: string;
//   vecesDictada: number;
//   gestionReciente: string | null;
//   score: number;
// };

// type IaResult = {
//   best: IaBest | null;
//   candidatos: IaCandidato[];
//   raw?: any;
// };

// type IaSugerenciasState = Record<string, IaResult>;

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
  /** { [materiaId]: { best, candidatos, raw } } */
  iaSugerencias: {},
  setDocenteLocal: (id_horario, id_docente) => {
    set((state) => ({
      materiasHistorial: (state.materiasHistorial || []).map((m) =>
        String(m.id) === String(id_horario)
          ? { ...m, id_docente: id_docente != null ? String(id_docente) : "" }
          : m
      ),
    }));
  },
  // --------- CRUD docentes ----------
  cargarDocentes: async (page, pageSize, word = "") => {
    set({ loading: true, error: null });
    try {
      const data = await fetchDocentes(page, pageSize, word);
      set({
        docentes: data.items,
        total: data.total,
        page: data.page,
        pageSize: data.pageSize,
        loading: false,
      });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  nuevoDocente: async ({ Persona, area_especializacion }) => {
    set({ loading: true, error: null });
    try {
      const data = await createDocente({ Persona, area_especializacion });
      set((state) => ({
        docentes: [...state.docentes, data],
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },

  actualizarDocente: async ({ id, Persona, area_especializacion }) => {
    set({ loading: true, error: null });
    try {
      const data = await updateDocente({ id, Persona, area_especializacion });
      set((state) => ({
        docentes: state.docentes.map((docente) =>
          docente.id === id ? { ...docente, ...data } : docente
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },

  actualizarEstadoDocente: async ({ id, estado }) => {
    set({ loading: true, error: null });
    try {
      const data = await updateStateDocente({ id, estado });
      set((state) => ({
        docentes: state.docentes.map((docente) =>
          docente.id === id ? { ...docente, ...data } : docente
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },

  // --------- Historial materias/docentes ----------
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

  // --------- IA: build payload para UNA materia ----------
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
    guardarAsignacion: async (id_horario, id_docente) => {
    const idKey = String(id_horario);

    // Snapshot para revertir si falla
    const prevMaterias = get().materiasHistorial;

    // Optimista: marca loading y aplica en memoria
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
      set({
        materiasHistorial: prevMaterias,
        asignarError: err,
      });
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

  limpiarSugerenciasIA: () => {
    set({ iaSugerencias: {}, iaError: null });
  },

  getIaBestFor: (materiaId) => {
    const s = get().iaSugerencias[String(materiaId)];
    return s?.best ?? null;
  },

  getIaCandidatosFor: (materiaId) => {
    const s = get().iaSugerencias[String(materiaId)];
    return s?.candidatos ?? [];
  },
}));
