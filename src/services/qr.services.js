import { apiFetch } from "./api";

export const obtenerQR = () => {
  return apiFetch("/whatsapp-admin/qr/");
};

export const obtenerEstado = () => {
  return apiFetch("/whatsapp-admin/status/");
};

export const inicializarWhatsApp = () => {
  return apiFetch("/whatsapp-admin/initialize/", {
    method: "POST",
  });
};

export const reiniciarWhatsApp = () => {
  return apiFetch("/whatsapp-admin/restart", {
    method: "POST",
  });
};

export const obtenerSesiones = () => {
  return apiFetch("/whatsapp-admin/sessions");
};

export const limpiarSesionesExpiradas = () => {
  return apiFetch("/whatsapp-admin/sessions/expired", {
    method: "DELETE",
  });
};

export const eliminarSesion = (sessionId) => {
  return apiFetch(`/whatsapp-admin/sessions/${sessionId}`, {
    method: "DELETE",
  });
};
