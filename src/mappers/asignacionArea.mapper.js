import { create } from "zustand";
import { apiFetch } from "../services/api";
import { fetchEstudiantes } from "../services/estudiantes.services";
import { useEstudiantesStore} from '../store/estudiantes.store';
export const defensa = create((set) => ({
    Defensa: [],
    cargarDefensa: async(defensa, nombre_estudiante, id_estudiante) => {
        const response = await apiFetch(`/plantilla-service/plantillas/areas/${defensa}`, {
            method: "GET"
        });
        const estudiante = await apiFetch(`/plantilla-service/plantillas/estudiante/${id_estudiante}`);
        //obtener el registro del estudiante y carrera
        return [response, estudiante];

    },
    cargarPlantillasNotasExcel: async(id_estudiante) => { 
        const estudiante = await apiFetch(`/plantilla-service/plantillas/estudiante/${id_estudiante}`);
        return estudiante;
    }
}));