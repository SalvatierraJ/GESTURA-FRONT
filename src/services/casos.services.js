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