import { apiFetch } from "./api";

export async function fetchEstudiantes(page, pageSize) {
  return apiFetch(`/student-managament/estudiantes/${page}/${pageSize}`, {
    method: "GET",
  });
}

export async function createEstudiante({estudiantes}) {
  console.log("funcion expulsar",{estudiantes});
  return apiFetch("/student-managament/nuevo-estudiante", {
    method: "POST",
    body: JSON.stringify({estudiantes}),
  });
}

export async function updateEstudiante({ id, estudiante}) {
  console.log(estudiante);
  return apiFetch(`/student-managament/editar-estudiante/${id}`, {
    method: "PUT",
    body: JSON.stringify(estudiante),
  });
}

export async function generarDefensa(params) {
  return apiFetch("/student-managament/generar-Defensa", {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

