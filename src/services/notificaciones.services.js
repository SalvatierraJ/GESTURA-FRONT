import { apiFetch } from "./api";

export const enviarNotificacionEstudiantes = (estudiantes, mensaje) => {
  return apiFetch("/defensasmanagament/enviar-mensaje-whatsapp-masivo", {
    method: "POST",
    body: JSON.stringify({
      registros: estudiantes.map(est => est.registro),
      mensaje: mensaje
    }),
    headers: { "Content-Type": "application/json" },
  });
};
