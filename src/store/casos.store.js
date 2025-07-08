import { create } from "zustand";
import {
  fetchCarreras,
  fetchFacultades,
  createCarrera,
  updateCarrera,
  updateStateCarrera,
  fetchAreasEstudio,
  createAreaEstudio,
  updateAreaEstudio,
  updateStateAreaEstudio,
  crearCasosEstudio,
  fetchCasosEstudio,
} from "@/services/casos.services";

export const useCasosStore = create((set) => ({
  carreras: [],
  total: 0,
  page: 1,
  pageSize: 10,
  facultades: [],
  areas: [],
  casosEstudio: [],
  loading: false,
  error: null,

  cargarCarreras: async (page, pageSize) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchCarreras(page, pageSize);
      set({
        carreras: data.items,
        total: data.total,
        page: data.page,
        pageSize: data.pageSize,
        loading: false,
      });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  cargarFacultades: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchFacultades();
      set({ facultades: data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  nuevaCarrera: async ({ nombre_carrera, id_facultad }) => {
    set({ loading: true, error: null });
    try {
      const data = await createCarrera({ nombre_carrera, id_facultad });
      set((state) => ({
        carreras: [...state.carreras, data],
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  actualizarCarrera: async ({ id, nombre_carrera, id_facultad }) => {
    set({ loading: true, error: null });
    try {
      const data = await updateCarrera({ id, nombre_carrera, id_facultad });
      set((state) => ({
        carreras: state.carreras.map((carrera) =>
          carrera.id === id ? { ...carrera, ...data } : carrera
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  actualizarEstadoCarrera: async ({ id, estado }) => {
    set({ loading: true, error: null });
    try {
      console.log("Recibido:", id, estado);
      const data = await updateStateCarrera({ id, estado });
      set((state) => ({
        carreras: state.carreras.map((carrera) =>
          carrera.id === id ? { ...carrera, estado: data.estado } : carrera
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  nuevaAreaEstudio: async ({ nombre_area, carreraIds }) => {
    set({ loading: true, error: null });
    try {
      const data = await createAreaEstudio({ nombre_area, carreraIds });
      set((state) => ({
        areas: [...state.areas, data],
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  cargarAreasEstudio: async (page, pageSize) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchAreasEstudio(page, pageSize);
      set({
        areas: data.items,
        total: data.total,
        page: data.page,
        pageSize: data.pageSize,
        loading: false,
      });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  actualizarAreaEstudio: async ({ id, nombre_area, carreraIds }) => {
    set({ loading: true, error: null });
    try {
      const data = await updateAreaEstudio({ id, nombre_area, carreraIds });
      set((state) => ({
        areas: state.areas.map((area) =>
          area.id === id ? { ...area, ...data } : area
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  actualizarEstadoAreaEstudio: async ({ id, estado }) => {
    set({ loading: true, error: null });
    try {
      const data = await updateStateAreaEstudio({ id, estado });
      set((state) => ({
        areas: state.areas.map((area) =>
          area.id === id ? { ...area, estado: data.estado } : area
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  crearCasos: async ({ id_area, archivos }) => {
    set({ loading: true, error: null });
    try {
      const result = await crearCasosEstudio({ id_area, archivos });
      set((state) => ({
        casos: [...state.casos, ...(result.casos || [])],
        loading: false,
      }));
      return result;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
  cargarCasosEstudio: async (page, pageSize) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchCasosEstudio(page, pageSize);
      set({
        casos: data.items,
        total: data.total,
        page: data.page,
        pageSize: data.pageSize,
        loading: false,
      });
    } catch (error) {
      set({ error, loading: false });
    }
  },
}));
