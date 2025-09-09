import { create } from 'zustand';
import { obtenerModulos as fetchModulos } from '../services/modulos';
export const moduloStore = create((set) => ({
  modulos: [], 
  error: null,

  // Acción corregida
  obtenerModulos: async () => {
    try {
      set({ loading: true, error: null });
      const data = await fetchModulos();
      set({ modulos: data, loading: false });
    } catch (error) {
      console.error("Error al obtener los módulos desde el store:", error);
      set({ error: error.message, loading: false });
    }
  },
}));