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
    ...(fechaFin ? { fechaFin } : {}),
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

export const getCarrerasConPensum = async () => {
  return apiFetch(`/registro-materia/carreras-con-pensum`);
};

export const getPensumCarrera = async (carreras) => {
    const nombreCarrera = carreras[0].nombreCarrera;
    const numeroPensum= carreras[0].numeroPensum;
  return apiFetch(`/registro-materia/pensum-carrera/${nombreCarrera}/${numeroPensum}`);
};

export const actualizarPrerrequisitosMateria = async (idMateria, prerrequisitos) => {
  return apiFetch(`/registro-materia/materia/${idMateria}/prerrequisitos`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prerrequisitos }),
  });
};


export const actualizarEquivalenciasMateria = async (idMateria, equivalencias) => {
  return apiFetch(`/registro-materia/materia/${idMateria}/equivalencias`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ equivalencias }),
  });
};


export const recomendarHorariosMateriasFaltantes = async (carrera, pensum) => {
  const params = new URLSearchParams({
    carrera: carrera,
    pensum: String(pensum),
  }).toString();
  return apiFetch(`/registro-materia/recomendar-horarios?${params}`);
};
