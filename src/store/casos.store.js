import { create } from "zustand";
import {
  fetchCarreras,
  fetchFacultades,
  createCarrera,
  updateCarrera,
  updateStateCarrera
} from "@/services/casos.services";

export const useCasosStore = create((set) => ({
  carreras: [],
   total: 0,
  page: 1,
  pageSize: 10,
  facultades: [],
  loading: false,
  error: null,

  cargarCarreras: async (page,pageSize) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchCarreras(page,pageSize);
      set({ 
        carreras: data.items,
        total: data.total,
        page: data.page,
        pageSize: data.pageSize,
        loading: false 
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
  }
}));
