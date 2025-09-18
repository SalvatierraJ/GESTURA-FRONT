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
export async function updatePlantilla(id_plantilla, formData) {
    // formData debe ser instancia de FormData
    const url = `/plantilla-service/update/plantilla/${id_plantilla}`;
    try {
        if (!(formData instanceof FormData)) {
            throw new Error("updatePlantilla requiere un FormData válido");
        }
        return await apiFetch(url, {
            method: "PUT",
            body: formData,
        });
    } catch (error) {
        console.error("Error en updatePlantilla:", error);
        throw error;
    }
}

export async function getPlantillasByUsuario(id_usuario) {
    const url = `/plantilla-service/usuario/${id_usuario}`;
    return await apiFetch(url, { method: "GET" });
}

export async function getPlantillasByModulo(id_modulo) {
    const url = `/plantilla-service/modulo/${id_modulo}`;
    return apiFetch(url, { method: "GET" });
}

export async function deletePlantilla(id_plantilla) {
    const url = `/plantilla-service/plantilla/delete/${id_plantilla}`;
    return apiFetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
}
export async function downloadPlantilla(parametros, IdUsuario = 1) {
    const url = `/plantilla-service/plantillas/${IdUsuario}`;
    const formaData = new FormData(parametros);
    formaData.append("parametros");
    const response = apiFetch(url, {
        method: "DELETE",
        body: formaData,
        headers: { "Content-Type": "application/json" },
    });
    return response;
}
export async function getPlantillas() {
    const url = "/plantilla-service/plantillas";
    return await apiFetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
}
export async function descargarArchivoPlantilla(id_plantilla) {
    const baseUrl =
        import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('access_token');
    const resp = await fetch(`${baseUrl}/plantilla-service/plantillas/archivo/${id_plantilla}`, {
        method: 'GET',
        headers: {
            ...(token && { Authorization: `Bearer ${token}` })
        }
    });

    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Error descargando plantilla (${resp.status}): ${text}`);
    }

    const contentType = resp.headers.get('content-type') || '';
    let fileName = `plantilla_${id_plantilla}`;
    const cd = resp.headers.get('content-disposition');
    if (cd) {
        const match = /filename="?([^";]+)"?/i.exec(cd);
        if (match) fileName = decodeURIComponent(match[1]);
    }

    if (contentType.includes('application/json')) {
        const json = await resp.json();
        if (json ?.nombre_archivo) fileName = json.nombre_archivo;
        let blob;
        if (json ?.buffer ?.data) {
            const uint8 = new Uint8Array(json.buffer.data);
            blob = new Blob([uint8], { type: json.mime || 'application/octet-stream' });
        } else if (Array.isArray(json ?.buffer)) { // por si viene como array plano
            const uint8 = new Uint8Array(json.buffer);
            blob = new Blob([uint8], { type: json.mime || 'application/octet-stream' });
        } else if (typeof json ?.buffer === 'string') { // posible base64
            try {
                const b64 = json.buffer.split(',').pop();
                const binary = atob(b64);
                const len = binary.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
                blob = new Blob([bytes], { type: json.mime || 'application/octet-stream' });
            } catch {
                throw new Error('Formato de buffer no soportado en respuesta JSON');
            }
        } else {
            throw new Error('Respuesta JSON sin buffer válido');
        }
        return { blob, fileName };
    }

    // Caso binario directo
    const blob = await resp.blob();
    return { blob, fileName };
}