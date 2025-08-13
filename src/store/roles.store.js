// store/roles.store.js
import { create } from "zustand";
import {
  crearRol,
  actualizarRol,
  obtenerRolesPaginados,
  obtenerPermisos,
  obtenerModulos,
  softDeleteRol,
  restoreRol,

} from "@/services/roles.services";

export const useRolStore = create((set, get) => ({
  roles: [],
  paginaActual: 1,
  totalPaginas: 1,
  pagina: 1,
  limite: 10,
  permisos: [],
  modulos: [],
  loading: false,
  error: null,

  // ============== CARGAS ==============
  cargarRoles: async (pagina = get().pagina, limite = get().limite) => {
    try {
      set({ loading: true, error: null });
      const res = await obtenerRolesPaginados(pagina, limite);
      set({
        roles: res.datos || [],
        paginaActual: pagina,
        pagina: pagina,
        limite,
        totalPaginas: res.totalPaginas || 1,
        loading: false,
      });
    } catch (error) {
      set({ error: "Error al cargar roles", loading: false });
    }
  },

  cargarPermisos: async () => {
    try {
      const data = await obtenerPermisos();
      set({ permisos: Array.isArray(data) ? data : [] });
    } catch (error) {
      set({ error: "Error al cargar permisos" });
    }
  },

  cargarModulos: async () => {
    try {
      const data = await obtenerModulos();
      set({ modulos: Array.isArray(data) ? data : [] });
    } catch (error) {
      set({ error: "Error al cargar módulos" });
    }
  },

  // ============== CRUD ==============
  crearNuevoRol: async (data) => {
    try {
      set({ loading: true, error: null });
      await crearRol(data);
      const { pagina, limite } = get();
      await get().cargarRoles(pagina, limite);
      set({ loading: false });
    } catch (error) {
      set({ error: "Error al crear rol", loading: false });
    }
  },

  actualizarRolExistente: async (data) => {
    try {
      set({ loading: true, error: null });
      await actualizarRol(data);
      const { pagina, limite } = get();
      await get().cargarRoles(pagina, limite);
      set({ loading: false });
    } catch (error) {
      set({ error: "Error al actualizar rol", loading: false });
    }
  },

  // ============== BORRADO LÓGICO / RESTAURAR ==============
  eliminarRolLogico: async (id) => {
    try {
      set({ loading: true, error: null });
      await softDeleteRol(id); 
      const { pagina, limite } = get();
      await get().cargarRoles(pagina, limite);
      set({ loading: false });
    } catch (error) {
      set({ error: "Error al eliminar rol", loading: false });
    }
  },

  restaurarRol: async (id) => {
    try {
      set({ loading: true, error: null });
      await restoreRol(id); 
      const { pagina, limite } = get();
      await get().cargarRoles(pagina, limite);
      set({ loading: false });
    } catch (error) {
      set({ error: "Error al restaurar rol", loading: false });
    }
  },
}));
