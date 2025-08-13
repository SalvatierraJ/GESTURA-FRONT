import { create } from "zustand";
import {
  fetchEstudiantes,
  createEstudiante,
  updateEstudiante,
  generarDefensa,
  createEstudianteMasivo,
  setEstadoEstudiante,
  softDeleteEstudiante,
  restoreEstudiante,
} from "@/services/estudiantes.services";

export const useEstudiantesStore = create((set, get) => ({
  estudiantes: [],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,

  // --------- LISTAR ----------
  cargarEstudiantes: async (page, pageSize, word = "") => {
    set({ loading: true, error: null });
    try {
      const data = await fetchEstudiantes(page, pageSize, word);
      set({
        estudiantes: data.items || [],
        total: data.total || 0,
        page: data.page || page,
        pageSize: data.pageSize || pageSize,
        loading: false,
      });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  // --------- CREAR ----------
  crearEstudiantes: async ({ estudiantes }) => {
    set({ loading: true, error: null });
    try {
      const data = await createEstudiante({ estudiantes });
      set((state) => ({
        estudiantes: [
          ...state.estudiantes,
          ...(Array.isArray(data) ? data : [data]),
        ],
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  crearEstudiantesMasivo: async ({ estudiantes }) => {
    set({ loading: true, error: null });
    try {
      const resultado = await createEstudianteMasivo({ estudiantes });
      if (resultado?.exitosos?.length) {
        set((state) => ({
          estudiantes: [
            ...state.estudiantes,
            ...resultado.exitosos.map((e) => e.estudiante),
          ],
          loading: false,
        }));
      } else {
        set({ loading: false });
      }
      return resultado;
    } catch (error) {
      set({ error: error.message || "Error al crear estudiantes", loading: false });
      throw error;
    }
  },

  // --------- EDITAR ----------
  editarEstudiante: async ({ id, estudiante }) => {
    set({ loading: true, error: null });
    try {
      const data = await updateEstudiante({ id, estudiante });
      set((state) => ({
        estudiantes: state.estudiantes.map((e) =>
          e.id_estudiante === id ? { ...e, ...data } : e
        ),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  // --------- ESTADO (visible/no visible) ----------
  actualizarEstadoEstudiante: async ({ id, estado }) => {
    set({ loading: true, error: null });
    try {
      const data = await setEstadoEstudiante(id, estado); 
      set((state) => ({
        estudiantes: state.estudiantes.map((e) =>
          e.id_estudiante === id ? { ...e, estado: data.estado } : e
        ),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  // --------- BORRADO LÓGICO ----------
  borrarEstudiante: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await softDeleteEstudiante(id); // { delete: true }
      set((state) => ({
        // lo quitamos del listado actual
        estudiantes: state.estudiantes.filter((e) => e.id_estudiante !== id),
        loading: false,
      }));
      return res;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  // --------- RESTAURAR ----------
  restaurarEstudiante: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await restoreEstudiante(id); // { delete: false }
      // recarga la página actual para traerlo de vuelta si aplica el filtro
      const { page, pageSize } = get();
      await get().cargarEstudiantes(page, pageSize);
      set({ loading: false });
      return res;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  // --------- DEFENSA ----------
  generarDefensa: async (params) => {
    set({ loading: true, error: null });
    try {
      const result = await generarDefensa(params);
      set({ loading: false });
      return result;
    } catch (err) {
      set({ error: err.message || "Error al generar defensa", loading: false });
      throw err;
    }
  },
}));
