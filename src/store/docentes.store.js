import { create } from "zustand";
import {
  fetchDocentes,
  createDocente,
  updateDocente,
  updateStateDocente,
} from "@/services/docentes.services";
export const useDocentesStore = create((set) => ({
  docentes: [],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,
    cargarDocentes: async (page, pageSize) => {
        set({ loading: true, error: null });
        try {
        const data = await fetchDocentes(page, pageSize);
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

}));
