import { apiFetch } from "./api";
export const crearRol = async (data) => {
  return await apiFetch(`/controlaccesomanagament/crear-Rol`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const actualizarRol = async (data) => {
  return apiFetch(`/controlaccesomanagament/actualizar-Rol`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const softDeleteRol = async (id) => {
  return apiFetch(`/controlaccesomanagament/eliminar/${id}`, {
    method: "DELETE",
  });
};

export const restoreRol = async (id) => {
  return apiFetch(`/controlaccesomanagament/${id}/restaurar`, {
    method: "PATCH",
  });
};

export const obtenerRolesPaginados = async (pagina = 1, limite = 10) => {
  return apiFetch(
    `/controlaccesomanagament/roles/?pagina=${pagina}&limite=${limite}`
  );
};

export const obtenerPermisos = async () => {
  return apiFetch(`/controlaccesomanagament/permisos`);
};

export const obtenerModulos = async () => {
  return apiFetch(`/controlaccesomanagament/modulos`);
};
