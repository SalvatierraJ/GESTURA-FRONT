const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("access_token");

export const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Maneja errores, por ejemplo: lanzar, refrescar token, etc.
    throw new Error(await response.text());
  }

  return response.json();
};