import { apiFetch } from "./api";

export async function enviarMensajeChat( mensaje) {
  return apiFetch("/registro-materia/conversar", {
    method: "POST",
    body: JSON.stringify({ mensaje }),
    headers: { "Content-Type": "application/json" },
  });
}
