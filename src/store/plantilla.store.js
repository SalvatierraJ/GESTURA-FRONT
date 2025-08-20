import { create } from "zustand";
import {
    createPlantillas,
    getPlantillasByUsuario,
    getPlantillasByModulo,
    deletePlantilla,
    downloadPlantilla,
    getPlantillas
} from "@/services/plantilla.service";

export const usePlantillaStore = create((set) => ({
    // Estado
    plantillas: [],
    plantillasByUsuario: [],
    plantillasByModulo: [],
    modulos: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false,
    uploading: false,
    uploadProgress: {},
    error: null,

    cargarPlantillasByUsuario: async(id_usuario) => {
        set({ loading: true, error: null });
        try {
            const data = await getPlantillasByUsuario(id_usuario);
            set({
                plantillasByUsuario: data.plantillas || [],
                total: data.total || 0,
                loading: false,
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
    cargarPlantillas: async(Parametros, Id_Plantilla) => {
        try {
            const data = await downloadPlantilla(Parametros, Id_Plantilla);
            return data;

        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
    cargarPlantillasByModulo: async(id_modulo) => {
        set({ loading: true, error: null });
        try {
            const data = await getPlantillasByModulo(id_modulo);
            set({
                plantillasByModulo: data.plantillas || [],
                plantillas: data.plantillas || [],
                total: data.total || 0,
                loading: false,
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
    subirPlantillas: async({
        file,
        id_modulo,
        titulo,
        categoria,
        onSuccess,
    }) => {
        set({ uploading: true, error: null, uploadProgress: {} });
        try {
            set({
                uploadProgress: {
                    [file.name]: 0,
                },
            });

            const result = await createPlantillas({
                file,
                id_modulo,
                titulo,
                categoria,
            });

            if (result.success) {
                set({
                    uploadProgress: {
                        [file.name]: 100,
                    },
                });

                set((state) => ({
                    plantillas: [...state.plantillas, ...(result.data || [])],
                    plantillasByModulo: [
                        ...state.plantillasByModulo,
                        ...(result.data || []),
                    ],
                    uploading: false,
                    uploadProgress: {},
                }));

                if (onSuccess) {
                    onSuccess(result);
                }

                return result;
            } else {
                throw new Error(result.message || "Error al subir plantilla");
            }
        } catch (error) {
            set({ error: error.message, uploading: false, uploadProgress: {} });
            throw error;
        }
    },

    eliminarPlantilla: async({ id_plantilla, id_usuario }) => {
        set({ loading: true, error: null });
        try {
            const result = await deletePlantilla(id_plantilla, id_usuario);

            if (result.success) {
                set((state) => ({
                    plantillas: state.plantillas.filter(
                        (p) => p.id_plantilla !== id_plantilla
                    ),
                    plantillasByUsuario: state.plantillasByUsuario.filter(
                        (p) => p.id_plantilla !== id_plantilla
                    ),
                    plantillasByModulo: state.plantillasByModulo.filter(
                        (p) => p.id_plantilla !== id_plantilla
                    ),
                    loading: false,
                }));
                return result;
            } else {
                throw new Error(result.message || "Error al eliminar plantilla");
            }
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    actualizarProgresoSubida: (filename, progress) => {
        set((state) => ({
            uploadProgress: {
                ...state.uploadProgress,
                [filename]: progress,
            },
        }));
    },

    limpiarError: () => {
        set({ error: null });
    },

    // Limpiar plantillas
    limpiarPlantillas: () => {
        set({
            plantillas: [],
            plantillasByUsuario: [],
            plantillasByModulo: [],
            uploadProgress: {},
        });
    },

    refrescarPlantillasByModulo: async(id_modulo) => {
        await set().cargarPlantillasByModulo(id_modulo);
    },

    refrescarPlantillasByUsuario: async(id_usuario) => {
        await set().cargarPlantillasByUsuario(id_usuario);
    },
    obtenerPlantillas: async() => {
        set({ plantillas: await getPlantillas() })
    }
}));