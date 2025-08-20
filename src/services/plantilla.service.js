import { apiFetch } from "./api";

export const createPlantillas = async({
    file,
    id_modulo,
    titulo,
    categoria,
}) => {
    const formData = new FormData();

    formData.append("files", file);

    formData.append("id_modulo", id_modulo.toString());
    formData.append("titulo", titulo);
    formData.append("categoria", categoria);

    try {
        const result = await apiFetch("/plantilla-service/plantilla", {
            method: "POST",
            body: formData,
        });

        return result;
    } catch (error) {
        console.error("Error en el servicio de subida:", error);
        throw new Error(error.message || "Error al comunicarse con el servidor");
    }
};

export async function getPlantillasByUsuario(id_usuario) {
    const url = `/plantilla-service/usuario/${id_usuario}`;
    return await apiFetch(url, { method: "GET" });
}

export async function getPlantillasByModulo(id_modulo) {
    const url = `/plantilla-service/modulo/${id_modulo}`;
    return apiFetch(url, { method: "GET" });
}

export async function deletePlantilla(id_plantilla, id_usuario) {
    const url = `/plantilla-service/${id_plantilla}`;
    return apiFetch(url, {
        method: "DELETE",
        body: JSON.stringify({ id_usuario }),
        headers: { "Content-Type": "application/json" },
    });

}
export async function downloadPlantilla(parametros, IdUsuario = 1) {
    const url = `/plantilla-service/plantillas/${IdUsuario}`;
    const formaData = new FormData(parametros);
    formaData.append("parametros", );
    const response = apiFetch(url, {
        method: "DELETE",
        body: formaData,
        headers: { "Content-Type": "application/json" },
    });
    return response;
}
export async function getPlantillas() {
    const url = '/plantilla-service/plantillas';
    return await apiFetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
}