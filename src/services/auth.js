import { apiFetch } from "./api";

export async function login({ username, password }) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  return data;
}

export async function fetchProfile() {
  return apiFetch("/auth/profile", {
    method: "GET",
  });
}
export async function updateProfile(body) {
  return apiFetch("/auth/actualizar-perfil", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function searchPeople(query) {
  return apiFetch(`/auth/search-people/${encodeURIComponent(query)}`, {
    method: "GET",
  });
}

// Removed verificarPerfil - using fetchProfile instead
