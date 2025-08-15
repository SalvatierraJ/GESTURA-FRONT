import { create } from "zustand";
import { fetchDefensas,asignarJuradosLote,fetchJurados, agregarNotaDefensa,  
  agregarAulaDefensa, actualizarJurados,eliminarDefensa } from "@/services/defensas.services";
export const useDefensasStore = create((set,get) => ({
  defensasInterna: [],
  defensasExternas:[],
  jurados: [],  
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,
  tipoDefensa: "",
   selectDefensasDeEstudiante: (estudianteId) => {
    const { defensasInterna, defensasExternas } = get();
    const mapTipo = (items, tipoLabel) =>
      (items || [])
        .filter(d => Number(d.id_estudiante) === Number(estudianteId))
        .map(d => ({ ...d, tipo: tipoLabel }));
    return [
      ...mapTipo(defensasInterna, "Examen de grado Interna"),
      ...mapTipo(defensasExternas, "Examen de grado Externa"),
    ];
  },
    refreshAllDefensas: async () => {
    const { cargarDefensasInterna, cargarDefensasExternas } = get();
    await Promise.all([
      cargarDefensasInterna(1, 10, "Examen de grado Interna"),
      cargarDefensasExternas(1, 10, "Examen de grado Externa"),
    ]);
  },
  cargarDefensasInterna: async (page, pageSize, tipoDefensa, word = '') => {
    set({ loading: true, error: null });
    try {
      const data = await fetchDefensas(page, pageSize, tipoDefensa, word);
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
  cargarDefensasExternas: async (page, pageSize, tipoDefensa, word = '') => {
    set({ loading: true, error: null });
    try {
      const data = await fetchDefensas(page, pageSize, tipoDefensa, word);
      set({
        defensasExternas: data.items || [],
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
  actualizarJurados: async (defensaId, juradoIds) => {
    set({ loading: true, error: null });
    try {
      const result = await actualizarJurados(defensaId, juradoIds);
      set({ loading: false });
      return result;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },
  
  borrarDefensa: async (id_defensa) => {
    set({ loading: true, error: null });
    try {
      await eliminarDefensa(id_defensa);
      const { cargarDefensasInterna, cargarDefensasExternas } = get();
      await Promise.all([
        cargarDefensasInterna(1, 1000, "Examen de grado Interna", ""),
        cargarDefensasExternas(1, 1000, "Examen de grado Externa", ""),
      ]);

      set({ loading: false });
      return true;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },
}));
