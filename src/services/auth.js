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


export async function loginOauth({ id_token, access_token }) {
  console.log("Logging in with OAuth", { id_token });
  return apiFetch("/auth/login-oauth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`,
    },
    body: JSON.stringify({ id_token }),
  });
}



