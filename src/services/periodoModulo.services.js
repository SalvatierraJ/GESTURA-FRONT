import { apiFetch } from "./api";


export const getModuloperiodo = async () => {
  return apiFetch(`/modulo-periodo/periodos-gestion-actual`);
};