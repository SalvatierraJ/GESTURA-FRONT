import { create } from "zustand";
import {
  fetchUsers,
  updateuser,
  registerUser,
  softDeleteUsuario,
  restoreUsuario,
} from "@/services/users.services";

export const useUserStore = create((set, get) => ({
  users: [],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,

  loadUsers: async (page = 1, pageSize = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchUsers(page, pageSize);
      set({
        users: response.items,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
        loading: false,
      });
    } catch (err) {
      set({ loading: false, error: err.message || "Error al cargar usuarios" });
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await updateuser(id, data);
      const { page, pageSize } = get();
      await get().loadUsers(page, pageSize);
      return response;
    } catch (err) {
      throw new Error(err.message || "Error al actualizar usuario");
    }
  },

  registerUser: async (data) => {
    try {
      const response = await registerUser(data);
      const { page, pageSize } = get();
      await get().loadUsers(page, pageSize);
      return response;
    } catch (err) {
      throw new Error(err.message || "Error al registrar usuario");
    }
  },

  softDeleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await softDeleteUsuario(id);
      const { page, pageSize } = get();
      await get().loadUsers(page, pageSize);
      set({ loading: false });
    } catch (err) {
      set({ loading: false, error: err.message || "Error al eliminar usuario" });
      throw err;
    }
  },

  restoreUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await restoreUsuario(id);
      const { page, pageSize } = get();
      await get().loadUsers(page, pageSize);
      set({ loading: false });
    } catch (err) {
      set({ loading: false, error: err.message || "Error al restaurar usuario" });
      throw err;
    }
  },
}));
