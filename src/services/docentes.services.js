import { apiFetch } from "./api";

export async function fetchDocentes(page, pageSize) {
  return apiFetch(`/docentesmanagement/docentes/${page}/${pageSize}`, {
    method: "GET",
  });
}

export async function createDocente({ Persona, area_especializacion }) {
  return apiFetch("/docentesmanagement/crear-docente", {
    method: "POST",
    body: JSON.stringify({ Persona, area_especializacion }),
  });
}
export async function updateDocente({ id, Persona, area_especializacion }) {
  return apiFetch(`/docentesmanagement/actualizar-docente/${id}`, {
    method: "PUT",
    body: JSON.stringify({ Persona, area_especializacion }),
  });
}
export async function updateStateDocente({ id, estado }) {
  return apiFetch(`/docentesmanagement/actualizar-estado-docente/${id}`, {
    method: "PUT",
    body: JSON.stringify({ estado }),
  });
}   