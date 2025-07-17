import { apiFetch } from "./api";

//Funciones para las carreras
export async function fetchCarreras(page, pageSize) {
  return apiFetch(`/case-study-management/carreras/${page}/${pageSize}`, {
    method: "GET",
  });
}

export async function createCarrera({ nombre_carrera, id_facultad }) {
  return apiFetch("/case-study-management/crear-carrera", {
    method: "POST",
    body: JSON.stringify({ nombre_carrera, id_facultad }),
  });
}

export async function updateCarrera({ id, nombre_carrera, id_facultad }) {
  return apiFetch(`/case-study-management/actualizar-carrera/${id}`, {
    method: "PUT",
    body: JSON.stringify({ nombre_carrera, id_facultad }),
  });
}

export async function updateStateCarrera({ id, estado }) {
  return apiFetch(`/case-study-management/actualizar-estado-carrera/${id}`, {
    method: "PUT",
    body: JSON.stringify({ estado }),
  });
}

//Funciones para las facultades

export async function fetchFacultades() {
  return apiFetch("/case-study-management/facultades", {
    method: "GET",
  });
}

//Funciones para las areas de estudio
export async function fetchAreasEstudio(page, pageSize) {
  return apiFetch(`/case-study-management/areas/${page}/${pageSize}`, {
    method: "GET",
  });
}

export async function createAreaEstudio({ nombre_area, carreraIds }) {
  return apiFetch("/case-study-management/crear-area", {
    method: "POST",
    body: JSON.stringify({ nombre_area, carreraIds }),
  });
}

export async function updateAreaEstudio({ id, nombre_area, carreraIds }) {
  return apiFetch(`/case-study-management/actualizar-area/${id}`, {
    method: "PUT",
    body: JSON.stringify({ nombre_area, carreraIds }),
  });
}

export async function updateStateAreaEstudio({ id, estado }) {
  return apiFetch(`/case-study-management/actualizar-estado-area/${id}`, {
    method: "PUT",
    body: JSON.stringify({ estado }),
  });
}

//funciones para los casos de estudio
export async function fetchCasosEstudio(page, pageSize) {
  return apiFetch(`/case-study-management/casos-estudio/${page}/${pageSize}`, {
    method: "GET",
  });
}

export async function crearCasosEstudio({ id_area, archivos }) {
  const formData = new FormData();

  formData.append("id_area", id_area);

  archivos.forEach((archivo, idx) => {
    formData.append("files", archivo.file);
    formData.append(`data[${idx}][titulo]`, archivo.titulo);
    formData.append(`data[${idx}][fecha_subida]`, archivo.fecha_subida);
    formData.append(`data[${idx}][autor]`, archivo.autor);
    formData.append(`data[${idx}][tema]`, archivo.tema || archivo.titulo);
  });

  return apiFetch("/case-study-management/crear-casos-estudio", {
    method: "POST",
    body: formData,
  });
}

export async function updateStateCasoEstudio({ id, estado }) {
  return apiFetch(`/case-study-management/actualizar-estado-caso/${id}`, {
    method: "PUT",
    body: JSON.stringify({ estado }),
  });
}
