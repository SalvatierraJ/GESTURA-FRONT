import { apiFetch } from "./api";

export async function fetchDocentes(page, pageSize, word = "") {
  return apiFetch(
    `/docentesmanagement/docentes/${page}/${pageSize}${
      word.trim() != "" ? "/" + word : ""
    }`,
    {
      method: "GET",
    }
  );
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

export async function materiaHistorialDocente() {
  return apiFetch(`/registro-materia/historial-docente-materias`, {
    method: "GET",
  });
}

export async function sugerirDocentePorMateria(payload) {
  return apiFetch(`/registro-materia/sugerir-asignacion/materia`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function asignarDocenteMateria({ id_horario, id_docente }) {
  return apiFetch(`/registro-materia/asignar-docente-materia`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_horario: Number(id_horario),
      id_docente: id_docente != null ? Number(id_docente) : null,
    }),
  });
}
export async function desasignarDocenteDeHorario(id_horario) {
  return asignarDocenteMateria({ id_horario, id_docente: null });
}
