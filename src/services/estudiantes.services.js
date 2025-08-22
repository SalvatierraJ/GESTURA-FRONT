import { apiFetch } from "./api";

export async function fetchEstudiantes(page, pageSize, word = '') {
  const q = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    word: word || '',  
  });
  return apiFetch(`/student-managament/estudiantes?${q.toString()}`, { method: 'GET' });
}


export async function createEstudiante({estudiantes}) {
  console.log("funcion expulsar",{estudiantes});
  return apiFetch("/student-managament/nuevo-estudiante", {
    method: "POST",
    body: JSON.stringify({estudiantes}),
  });
}

export async function createEstudianteMasivo({estudiantes}) {
  return apiFetch("/student-managament/estudiantes-masivo", {
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

export async function updateEstadoOBorradoEstudiante(id, payload) {
  return apiFetch(`/student-managament/estudiante/${id}/estado-o-borrado`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function setEstadoEstudiante(id, estado) {
  return updateEstadoOBorradoEstudiante(id, { estado });
}

export async function softDeleteEstudiante(id) {
  return updateEstadoOBorradoEstudiante(id, { delete: true });
}

export async function restoreEstudiante(id) {
  return updateEstadoOBorradoEstudiante(id, { delete: false });
}
export async function getMisDefensas() {
  return apiFetch("/student-managament/getMisDefensas", {
    method: "GET",
  });
}

export async function getDetallesDefensa(id) {
  return apiFetch(`/student-managament/defensas/${id}`, {
    method: "GET",
  });
}

export async function subirDocumentosDefensa(id_defensa, file) {
  const formData = new FormData();
  formData.append('files', file);

  return apiFetch(`/student-managament/defensas/${id_defensa}/subir-documento`, {
    method: "POST",
    body: formData,
  });
}
