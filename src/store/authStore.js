import { create } from "zustand";
import { updateProfile } from "../services/auth";
export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,

  setAuth: (user, token) => set({ user, token }),

  getRoles: () => get().user?.roles || [],
  getMainRole: () => get().user?.roles?.[0] || null,
  getMainCarreras: () => get().user?.roles?.[0]?.carreras || [],
  getAllCarreras: () => get().user?.roles?.flatMap((r) => r.carreras) || [],
  getMainModules: () => get().user?.roles?.[0]?.modulos || [],
  getAllModules: () => get().user?.roles?.flatMap((r) => r.modulos) || [],
  getMainPermissions: () =>
    get().user?.roles?.[0]?.modulos?.flatMap((m) => m.permisos) || [],
  getAllPermissions: () =>
    get().user?.roles?.flatMap((r) => r.modulos.flatMap((m) => m.permisos)) ||
    [],
  getAvailableModules: () =>
    get().user?.roles?.flatMap((r) => r.modulos.map((m) => m.Nombre)) ?? [],

  logout: () => {
    localStorage.removeItem("access_token");
    set({ user: null, token: null });
  },
  hasPermission: (permiso) => {
    // Busca en TODOS los roles y módulos
    return (
      get().user?.roles?.some((rol) =>
        rol.modulos.some((mod) =>
          mod.permisos.some((p) => p.Nombre === permiso)
        )
      ) || false
    );
  },
  hasModule: (modulo) => {
    return (
      get().user?.roles?.some((rol) =>
        rol.modulos.some((m) => m.Nombre === modulo)
      ) || false
    );
  },
  updateProfile: async (body) => {
    set({ loading: true, error: null });
    try {
        const response = await updateProfile(body);
        set({ user: response.data, loading: false });
        return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al actualizar el perfil';
        set({ error: errorMessage, loading: false });
        return { success: false, error: errorMessage };
    }
  },
}));
