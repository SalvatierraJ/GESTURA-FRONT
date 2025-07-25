import { apiFetch } from "./api";

export async function fetchDefensas(page, pageSize,tipoDefensa) {
  return apiFetch(`/defensasmanagament/detalles/${page}/${pageSize}/${tipoDefensa}`, {
    method: "GET",
  });
}

export async function asignarJuradosLote({ defensasIds, auto = true, juradoIds = [] }) {
  return apiFetch("/defensasmanagament/asignar-jurados-lote", {
    method: "POST",
    body: JSON.stringify({ defensasIds, auto, juradoIds }),
  });
}

export async function fetchJurados() {
  return apiFetch(`/defensasmanagament/jurados-sugeridos`, {
    method: "GET",
  });
}
export async function agregarNotaDefensa(id_defensa, nota) {
  return apiFetch(`/defensasmanagament/nota/${id_defensa}`, {
    method: "POST",
    body: JSON.stringify({ nota }),
    headers: { "Content-Type": "application/json" },
  });
}
export async function agregarAulaDefensa(id_defensa, aula) {
  return apiFetch(`/defensasmanagament/aula/${id_defensa}`, {
    method: "POST",
    body: JSON.stringify({ aula }),
    headers: { "Content-Type": "application/json" },
  });
}
