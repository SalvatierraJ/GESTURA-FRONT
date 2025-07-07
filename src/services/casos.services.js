import { apiFetch } from "./api";

//Funciones para las carreras 
export async function fetchCarreras(page,pageSize) {
  return apiFetch(`/case-study-management/carreras/${page}/${pageSize}`, {
    method: "GET",
  });
}

export async function createCarrera({  nombre_carrera, id_facultad  }) {
  return apiFetch("/case-study-management/crear-carrera", {
    method: "POST",
    body: JSON.stringify({ nombre_carrera, id_facultad }),
  });
} 

export async function updateCarrera({ id, nombre_carrera, id_facultad }) {
  return apiFetch(`/case-study-management/actualizar-carrera/${id}`, {
    method: "PUT",
    body: JSON.stringify({nombre_carrera, id_facultad}),
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