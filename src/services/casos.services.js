import { apiFetch } from "./api";

// ====== Carreras ======

export async function fetchCarreras(page, pageSize, searchTerm = "") {
  const url = `/case-study-management/carreras/${page}/${pageSize}${
    searchTerm !== "" ? `/${encodeURIComponent(searchTerm)}` : ""
  }`;
  return apiFetch(url, { method: "GET" });
}

export async function createCarrera({ nombre_carrera, id_facultad }) {
  return apiFetch("/case-study-management/crear-carrera", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre_carrera, id_facultad }),
  });
}

export async function updateCarrera({ id, nombre_carrera, id_facultad }) {
  return apiFetch(`/case-study-management/actualizar-carrera/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre_carrera, id_facultad }),
  });
}

export async function updateCarreraState(id, payload = {}) {
  const body = {};
  if (typeof payload.delete === "boolean") body.delete = payload.delete;
  if (typeof payload.estado === "boolean") body.estado = payload.estado;

  const hasDelete = typeof body.delete === "boolean";
  const hasEstado = typeof body.estado === "boolean";
  if (!hasDelete && !hasEstado) throw new Error('Debes enviar "delete" o "estado".');
  if (hasDelete && hasEstado) throw new Error('No envíes "delete" y "estado" a la vez.');

  return apiFetch(`/case-study-management/${id}/state`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Wrappers cómodos
export const softDeleteCarrera = (id) => updateCarreraState(id, { delete: true });
export const restoreCarrera    = (id) => updateCarreraState(id, { delete: false });
export const setEstadoCarrera  = (id, estado) => updateCarreraState(id, { estado });

// COMPAT: tu función antigua ahora usa el nuevo endpoint
export async function updateStateCarrera({ id, estado }) {
  return setEstadoCarrera(id, estado);
}

// ====== Facultades ======

export async function fetchFacultades() {
  return apiFetch("/case-study-management/facultades", { method: "GET" });
}

// ====== Áreas de estudio ======
export async function fetchAreasEstudio(page, pageSize, word = "") {
  return apiFetch(
    `/case-study-management/areas/${page}/${pageSize}${
      word.trim() !== "" ? "/" + encodeURIComponent(word.trim()) : ""
    }`,
    { method: "GET" }
  );
}

export async function createAreaEstudio({ nombre_area, carreraIds }) {
  return apiFetch("/case-study-management/crear-area", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre_area, carreraIds }),
  });
}

export async function updateAreaEstudio({ id, nombre_area, carreraIds }) {
  return apiFetch(`/case-study-management/actualizar-area/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre_area, carreraIds }),
  });
}

export async function updateAreaState(id, payload = {}) {
  const body = {};
  if (typeof payload.delete === "boolean") body.delete = payload.delete;
  if (typeof payload.estado === "boolean") body.estado = payload.estado;

  const hasDelete = typeof body.delete === "boolean";
  const hasEstado = typeof body.estado === "boolean";
  if (!hasDelete && !hasEstado) throw new Error('Debes enviar "delete" o "estado".');
  if (hasDelete && hasEstado) throw new Error('No envíes "delete" y "estado" a la vez.');

  return apiFetch(`/case-study-management/area/${id}/state`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export const setEstadoAreaEstudio  = (id, estado) => updateAreaState(id, { estado });
export const softDeleteAreaEstudio = (id) => updateAreaState(id, { delete: true });
export const restoreAreaEstudio    = (id) => updateAreaState(id, { delete: false });



// ====== Casos de estudio ======

export async function fetchCasosEstudio(page, pageSize, word = "") {
  return apiFetch(
    `/case-study-management/casos-estudio/${page}/${pageSize}${
      word.trim() !== "" ? "/" + encodeURIComponent(word.trim()) : ""
    }`,
    { method: "GET" }
  );
}

export async function crearCasosEstudio({ id_area, archivos }) {
  const formData = new FormData();
  formData.append("id_area", String(id_area));

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


export async function toggleCasoEstudioVisibility({ id, estado }) {
  return apiFetch(`/case-study-management/actualizar-estado-caso/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
}


export async function softDeleteCasoEstudio(id) {
  return apiFetch(`/case-study-management/actualizar-estado-caso/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ delete: true }),
  });
}


export async function restoreCasoEstudio(id) {
  return apiFetch(`/case-study-management/actualizar-estado-caso/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ delete: false }),
  });
}

// casos.services.js
export async function updateCasoEstudio({ id, payload }) {
  try {
    const { Titulo, Autor, Tema, Fecha_Creacion, id_area, documento } = payload;

    const formData = new FormData();

    // Agregar archivo si existe
    if (documento?.file) {
      formData.append('file', documento.file); // coincide con @UploadedFiles('file')
    }

    // Agregar metadatos
    if (Titulo) formData.append('Titulo', Titulo);
    if (Autor) formData.append('Autor', Autor);
    if (Tema) formData.append('Tema', Tema);
    if (Fecha_Creacion) {
      formData.append(
        'Fecha_Creacion',
        Fecha_Creacion instanceof Date
          ? Fecha_Creacion.toISOString()
          : String(Fecha_Creacion)
      );
    }
    if (id_area) formData.append('id_area', String(id_area));

    console.log('FormData para actualizar caso:', Array.from(formData.entries()));

    return apiFetch(`/case-study-management/casos/${id}`, {
      method: 'PUT',
      body: formData,
    });
  } catch (err) {
    throw new Error(err.message || 'Error actualizando el caso');
  }
}
