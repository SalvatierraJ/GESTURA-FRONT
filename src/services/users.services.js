import { apiFetch } from "./api";

export async function fetchUsers(page, pageSize) {
  return apiFetch(`/auth/usuarios/${page}/${pageSize}`, {
    method: "GET",
  });
}

export async function updateuser(id,body){
    return apiFetch(`/auth/actualizar-usuario/${id}`,{
        method: "PUT",
         body: JSON.stringify(body),
    })
}

export async function registerUser(body){
    return apiFetch(`/auth/register`,{
        method: "POST",
         body: JSON.stringify(body),
    })
}