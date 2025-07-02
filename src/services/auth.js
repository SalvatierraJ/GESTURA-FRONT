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
