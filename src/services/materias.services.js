import { apiFetch } from "./api";

export const buscarEstudiante = async (nroRegistro) => {
  return apiFetch(`/registro-materia/buscar/estudiante/${nroRegistro}`);
};
export const buscarEstudiantesMateriasPaginado = async ({
  page = 1,
  pageSize = 10,
  fechaInicio,
  fechaFin,
}) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(fechaInicio ? { fechaInicio } : {}),
    ...(fechaFin ? { fechaFin } : {})
  }).toString();
  return apiFetch(`/registro-materia/materias-paginado?${params}`);
};


export const registrarInscripcionMateria = async (body) => {
  return apiFetch(`/registro-materia/registrar/inscripcion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};

export const eliminarInscripcionMateria = async (body) => {
  return apiFetch(`/registro-materia/eliminar/inscripcion`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};