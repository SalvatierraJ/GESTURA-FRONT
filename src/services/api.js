const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("access_token");

export const apiFetch = async (endpoint, options = {}) => {
  const { responseType, ...fetchOptions } = options;
  const token = getToken();
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...fetchOptions.headers,
  };
  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    // Intentar extraer texto para mensaje de error
    let message = '';
    try { message = await response.text(); } catch { message = 'Error en la solicitud'; }
    throw new Error(message || `HTTP ${response.status}`);
  }

  if (responseType === 'blob') return response.blob();
  if (responseType === 'text') return response.text();

  // JSON por defecto (manejo de cuerpo vacío)
  try {
    return await response.json();
  } catch {
    return null;
  }
};
