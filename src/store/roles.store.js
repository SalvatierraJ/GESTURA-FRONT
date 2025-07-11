import { create } from "zustand";
import {
  crearRol,
  actualizarRol,
  eliminarRol,
  obtenerRolesPaginados,
  obtenerPermisos,
  obtenerModulos,
} from "@/services/roles.services";

export const useRolStore = create((set) => ({
  roles: [],
  paginaActual: 1,
  totalPaginas: 1,
  pagina:1,
  limite:10,
  permisos: [],
  modulos: [],
  loading: false,
  error: null,

  cargarRoles: async (pagina, limite ) => {
    try {
      set({ loading: true, error: null });
      const res = await obtenerRolesPaginados(pagina, limite);
      set({
        roles: res.datos,
        paginaActual: pagina,
        totalPaginas: res.totalPaginas,
        loading: false,
      });
    } catch (error) {
      set({ error: "Error al cargar roles", loading: false });
    }
  },

  cargarPermisos: async () => {
    try {
      const data = await obtenerPermisos();
      set({ permisos: data });
    } catch (error) {
      set({ error: "Error al cargar permisos" });
    }
  },

  cargarModulos: async () => {
    try {
      const data = await obtenerModulos();
      set({ modulos: data });
    } catch (error) {
      set({ error: "Error al cargar módulos" });
    }
  },

  crearNuevoRol: async (data) => {
    try {
      await crearRol(data);
      await get().cargarRoles(get().paginaActual);
    } catch (error) {
      set({ error: "Error al crear rol" });
    }
  },

  actualizarRolExistente: async (data) => {
    try {
      await actualizarRol(data);
      await get().cargarRoles(get().paginaActual);
    } catch (error) {
      set({ error: "Error al actualizar rol" });
    }
  },

  eliminarRolPorId: async (id) => {
    try {
      await eliminarRol(id);
      await get().cargarRoles(get().paginaActual);
    } catch (error) {
      set({ error: "Error al eliminar rol" });
    }
  },
}));
