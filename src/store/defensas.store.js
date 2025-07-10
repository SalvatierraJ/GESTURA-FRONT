import { create } from "zustand";
import { fetchDefensas,asignarJuradosLote,fetchJurados, agregarNotaDefensa,  
  agregarAulaDefensa  } from "@/services/defensas.services";
export const useDefensasStore = create((set) => ({
  defensasInterna: [],
  jurados: [],  
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,
  tipoDefensa: "",
  cargarDefensasInterna: async (page, pageSize, tipoDefensa) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchDefensas(page, pageSize, tipoDefensa);
      set({
        defensasInterna: data.items || [],
        total: data.total || 0,
        page: data.page || 1,
        pageSize: data.pageSize || 10,
        totalPages: data.totalPages || 1,
        tipoDefensa,
        loading: false,
      });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  asignarJurados: async ({ defensasIds, auto = true, juradoIds = [] }) => {
    set({ loading: true, error: null });
    try {
      const result = await asignarJuradosLote({ defensasIds, auto, juradoIds });
      set({ loading: false });
      return result;
    } catch (error) {
      set({ error, loading: false });
      throw error; 
    }
  },
    cargarJurados: async () => {                      
    set({ loading: true, error: null });
    try {
      const data = await fetchJurados();
      set({ jurados: data || [], loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
   actualizarNota: async (id_defensa, nota) => {
    set({ loading: true, error: null });
    try {
      const result = await agregarNotaDefensa(id_defensa, nota);
      set({ loading: false });
      return result;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  actualizarAula: async (id_defensa, aula) => {
    set({ loading: true, error: null });
    try {
      const result = await agregarAulaDefensa(id_defensa, aula);
      set({ loading: false });
      return result;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },
}));
