import { create } from "zustand";
import { updateProfile, searchPeople } from "../services/auth";
import { apiFetch } from "../services/api";
import {
  createProfileNotification,
  removeProfileNotification,
} from "../utils/profileNotification";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  results: [],
  loading: false,
  showIncompleteProfile: false,
  detallesPerfil: null,

  setAuth: (user, token) => {
    set({ user, token });
    const perfilIncompleto = !get().isProfileComplete(user);

    if (perfilIncompleto) {
      setTimeout(() => {
        createProfileNotification();
      }, 1000);
    } else {
      removeProfileNotification();
    }
  },

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
    removeProfileNotification();
    set({
      user: null,
      token: null,
      showIncompleteProfile: false,
      detallesPerfil: null,
    });
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
      if (response.access_token) {
        localStorage.setItem("access_token", response.access_token);
        set({
          user: response.data,
          token: response.access_token,
          loading: false,
        });
      } else {
        set({ user: response.data, loading: false });
      }

      // Verificar si el perfil se completó después de la actualización
      setTimeout(async () => {
        await get().checkProfileCompletion();
      }, 500); // Pequeño delay para asegurar que el backend haya procesado

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar el perfil";
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },
  searchPeople: async (query) => {
    if (!query || query.length < 2) {
      set({ results: [], loading: false, peopleError: null });
      return [];
    }
    set({ loading: true, peopleError: null });
    try {
      const results = await searchPeople(query);
      set({ results: results, loading: false });
      return results;
    } catch (error) {
      set({
        results: [],
        loading: false,
        peopleError: error.message || "Error en búsqueda",
      });
      return [];
    }
  },
  clear: () => set({ results: [] }),

  // Funciones para manejar perfil incompleto
  setShowIncompleteProfile: (show) => set({ showIncompleteProfile: show }),

  hideIncompleteProfileNotification: () =>
    set({
      showIncompleteProfile: false,
      detallesPerfil: null,
    }),

  checkProfileCompletion: async () => {
    try {
      const response = await apiFetch("/auth/profile", {
        method: "GET",
      });

      const perfilCompleto = get().isProfileComplete(response);

      if (perfilCompleto) {
        set({
          showIncompleteProfile: false,
          detallesPerfil: null,
        });
        removeProfileNotification();
      } else {
        set({
          showIncompleteProfile: true,
          detallesPerfil: response.Persona || null,
        });
        createProfileNotification();
      }

      return { requiere: !perfilCompleto, data: response };
    } catch {
      const currentUser = get().user;
      const perfilCompleto = get().isProfileComplete(currentUser);

      if (perfilCompleto) {
        set({
          showIncompleteProfile: false,
          detallesPerfil: null,
        });
        removeProfileNotification();
        return { requiere: false };
      } else {
        createProfileNotification();
        return { requiere: true };
      }
    }
  },

  // Función auxiliar para determinar si un perfil está completo
  isProfileComplete: (userData) => {
    if (!userData) {
      return false;
    }

    const persona = userData.Persona || userData.persona || {};

    // Campos obligatorios que deben estar presentes y no estar vacíos
    const requiredFields = {
      nombre: persona.Nombre,
      apellido_paterno: persona.Apellido1,
      apellido_materno: persona.Apellido2,
      ci: persona.CI,
      telefono: persona.telefono,
      correo: persona.Correo,
    };

    // Verificar cuáles campos están presentes y cuáles faltan
    const missingFields = [];

    Object.entries(requiredFields).forEach(([key, value]) => {
      if (!value || value.toString().trim() === "") {
        missingFields.push(key);
      }
    });

    return missingFields.length === 0;
  },
}));
