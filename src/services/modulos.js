import { apiFetch } from "./api";
export async function obtenerModulos(){
    return await apiFetch('/modules/getAllmodules');
}