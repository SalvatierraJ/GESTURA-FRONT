import { create } from "zustand";
import {
  // Carreras
  fetchCarreras,
  fetchFacultades,
  createCarrera,
  updateCarrera,
  updateStateCarrera,
  softDeleteCarrera,
  restoreCarrera,
  // Áreas
  fetchAreasEstudio,
  createAreaEstudio,
  updateAreaEstudio,
  setEstadoAreaEstudio,
  softDeleteAreaEstudio,
  restoreAreaEstudio,
  // Casos
  crearCasosEstudio,
  fetchCasosEstudio,
  toggleCasoEstudioVisibility,
  softDeleteCasoEstudio,
  restoreCasoEstudio,
  updateCasoEstudio,
} from "@/services/casos.services";

export const useCasosStore = create((set, get) => ({
  carreras: [],
  areas: [],
  casos: [],
  facultades: [],

  total: 0,
  page: 1,
  pageSize: 10,

  loading: false,
  error: null,

  // ------------------ CARRERAS ------------------
  cargarCarreras: async (page, pageSize, searchTerm = "") => {
    set({ loading: true, error: null });
    try {
      const data = await fetchCarreras(page, pageSize, searchTerm);
      set({
        carreras: data.items || [],
        total: data.total || 0,
        page: data.page || page,
        pageSize: data.pageSize || pageSize,
        loading: false,
      });
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
    }
  },

  nuevaCarrera: async ({ nombre_carrera, id_facultad }) => {
    set({ loading: true, error: null });
    try {
      const creada = await createCarrera({ nombre_carrera, id_facultad });
      set((state) => ({
        carreras: [...state.carreras, creada],
        loading: false,
      }));
      return creada;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  actualizarCarrera: async ({ id, nombre_carrera, id_facultad }) => {
    set({ loading: true, error: null });
    try {
      const data = await updateCarrera({ id, nombre_carrera, id_facultad });
      set((state) => ({
        carreras: state.carreras.map((c) =>
          c.id_carrera === id ? { ...c, ...data } : c
        ),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  actualizarEstadoCarrera: async ({ id, estado }) => {
    set({ loading: true, error: null });
    try {
      const data = await updateStateCarrera({ id, estado });
      set((state) => ({
        carreras: state.carreras.map((c) =>
          c.id_carrera === id ? { ...c, estado: data.estado } : c
        ),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  borrarCarrera: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await softDeleteCarrera(id);
      set((state) => ({
        carreras: state.carreras.filter((c) => c.id_carrera !== id),
        loading: false,
      }));
      return res;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  restaurarCarrera: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await restoreCarrera(id);
      const { page, pageSize } = get();
      await get().cargarCarreras(page, pageSize);
      set({ loading: false });
      return res;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  // ------------------ FACULTADES ------------------
  cargarFacultades: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchFacultades();
      set({ facultades: data || [], loading: false });
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
    }
  },

  // ------------------ ÁREAS ------------------
  cargarAreasEstudio: async (page, pageSize, word = "") => {
    set({ loading: true, error: null });
    try {
      const data = await fetchAreasEstudio(page, pageSize, word);
      set({
        areas: data.items || [],
        total: data.total || 0,
        page: data.page || page,
        pageSize: data.pageSize || pageSize,
        loading: false,
      });
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
    }
  },

  nuevaAreaEstudio: async ({ nombre_area, carreraIds }) => {
    set({ loading: true, error: null });
    try {
      const creada = await createAreaEstudio({ nombre_area, carreraIds });
      set((state) => ({ areas: [...state.areas, creada], loading: false }));
      return creada;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  actualizarAreaEstudio: async ({ id, nombre_area, carreraIds }) => {
    set({ loading: true, error: null });
    try {
      const data = await updateAreaEstudio({ id, nombre_area, carreraIds });
      set((state) => ({
        areas: state.areas.map((a) =>
          a.id_area === id ? { ...a, ...data } : a
        ),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  actualizarEstadoAreaEstudio: async ({ id, estado }) => {
    set({ loading: true, error: null });
    try {
      const data = await setEstadoAreaEstudio(id, estado);
      set((state) => ({
        areas: state.areas.map((a) =>
          a.id_area === id ? { ...a, estado: data.estado } : a
        ),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  borrarAreaEstudio: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await softDeleteAreaEstudio(id);
      set((state) => ({
        areas: state.areas.filter((a) => a.id_area !== id),
        loading: false,
      }));
      return res;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  restaurarAreaEstudio: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await restoreAreaEstudio(id);
      const { page, pageSize } = get();
      await get().cargarAreasEstudio(page, pageSize);
      set({ loading: false });
      return res;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  // ------------------ CASOS DE ESTUDIO ------------------
  crearCasos: async ({ id_area, archivos }) => {
    set({ loading: true, error: null });
    try {
      const result = await crearCasosEstudio({ id_area, archivos });
      set((state) => ({
        casos: [...(state.casos || []), ...(result.casos || [])],
        loading: false,
      }));
      return result;
    } catch (err) {
      set({ error: err?.message || String(err), loading: false });
      throw err;
    }
  },

  cargarCasosEstudio: async (page, pageSize, word = "") => {
    set({ loading: true, error: null });
    try {
      const data = await fetchCasosEstudio(page, pageSize, word);
      set({
        casos: data.items || [],
        total: data.total || 0,
        page: data.page || page,
        pageSize: data.pageSize || pageSize,
        loading: false,
      });
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
    }
  },

  actualizarEstadoCasoEstudio: async ({ id, estado }) => {
    set({ loading: true, error: null });
    try {
      const data = await toggleCasoEstudioVisibility({ id, estado });
      set((state) => ({
        casos: (state.casos || []).map((c) =>
          c.id_casoEstudio === id ? { ...c, estado: data.estado } : c
        ),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  borrarCasoEstudio: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await softDeleteCasoEstudio(id);
      set((state) => ({
        casos: (state.casos || []).filter((c) => c.id_casoEstudio !== id),
        loading: false,
      }));
      return res;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  // Restaurar (usa { delete: false })
  restaurarCasoEstudio: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await restoreCasoEstudio(id);
      const { page, pageSize } = get();
      // refresca la lista para que reaparezca
      await get().cargarCasosEstudio(page, pageSize);
      set({ loading: false });
      return res;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  actualizarCasoEstudio: async ({
    id,
    Titulo,
    Autor,
    Tema,
    Fecha_Creacion,
    id_area,
    url,
  }) => {
    set({ loading: true, error: null });
    try {
      const data = await updateCasoEstudio({
        id,
        Titulo,
        Autor,
        Tema,
        Fecha_Creacion,
        id_area,
        url,
      });
      set((state) => ({
        casos: (state.casos || []).map((c) =>
          c.id_casoEstudio === id
            ? {
                ...c,
                ...data,
                Titulo,
                Autor,
                Tema,
                Fecha_Creacion,
                id_area,
                url,
              }
            : c
        ),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },
}));
