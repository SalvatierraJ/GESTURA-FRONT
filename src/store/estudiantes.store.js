import { create } from "zustand";
import {
  fetchEstudiantes,
  createEstudiante,
  updateEstudiante,
  generarDefensa
} from "@/services/estudiantes.services";
export const useEstudiantesStore = create((set) => ({
  Estudiantes: [],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,
  cargarEstudiantes: async (page, pageSize) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchEstudiantes(page, pageSize);
      set({
        Estudiantes: data.items,
        total: data.total,
        page: data.page,
        pageSize: data.pageSize,
        loading: false,
      });
    } catch (error) {
      set({ error, loading: false });
    }
  },
   crearEstudiantes: async ({ estudiantes }) => {
    set({ loading: true, error: null });
    try {
      const data = await createEstudiante({ estudiantes });
      set((state) => ({
        estudiantes: [...state.estudiantes, ...(Array.isArray(data) ? data : [data])],
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  editarEstudiante: async ({ id, estudiante }) => {
    set({ loading: true, error: null });
    try {
      const data = await updateEstudiante({ id, estudiante });
      set((state) => ({
        estudiantes: state.estudiantes.map((e) =>
          e.id === id ? { ...e, ...data } : e
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
    generarDefensa: async (params) => {
    set({ loading: true, error: null });
    try {
      const result = await generarDefensa(params);
      return result; 
    } catch (err) {
      set({ error: err.message || "Error al generar defensa", loading: false });
      throw err; // también puedes relanzar el error si el componente lo necesita
    }
  },
}));
