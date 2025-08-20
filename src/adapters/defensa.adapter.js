import { create } from "zustand";
import { defensa } from "@/mappers/asignacionArea.mapper";
const API_URL = import.meta.env.VITE_API_URL;
export const defensaAdapter = create(() => ({
    defensas: [],
    crearObjeto: async(defensaSeleccionada, id_plantilla) => {
        //Plantillas para carta de la generacion de sorteo de casos
        if (parseInt(id_plantilla) === 1) {
            const {
                cargarDefensa
            } = defensa.getState();
            const mapper_defensa = await cargarDefensa(id_plantilla, defensaSeleccionada.estudiante, defensaSeleccionada.id_estudiante);
            const response = mapper_defensa[0];
            const estudiante = mapper_defensa[1];
            const areas = response.areas.map((e) => e.nombre_area)
            const data = {
                fecha_defensa: defensaSeleccionada.fecha_defensa ? new Date(defensaSeleccionada.fecha_defensa).toISOString().split('T')[0] : "",
                fecha_sorteo: defensaSeleccionada.fecha_sorteo_area || "",
                hora: defensaSeleccionada.hora || "",
                aula: defensaSeleccionada.aula || "",
                areas: areas || "",
                nombre: defensaSeleccionada.estudiante || "",
                registro: estudiante[0].estudiante.nroRegistro || "",
                carrera: estudiante[0].carrera.nombre_carrera || "",
                area_elegida: defensaSeleccionada.area || ""
            }
            try {
                const plantilla = await fetch(API_URL + `/plantilla-service/plantillas/user/${id_plantilla}`, { 
                    headers: {
                        'Content-Type': 'application/json'
                     },
                    method: "POST",
                    body: JSON.stringify(data)
                });
                const blob = await plantilla.blob();
                const url = URL.createObjectURL(blob);
                const etiqueta = document.createElement("a");
                etiqueta.href = url;
                etiqueta.download = `Sorteo de area ${defensaSeleccionada.estudiante}`;
                etiqueta.click();  
                //window.open(url, "_blank");
            } catch (error) {
                console.log(error);
            }

        }
        //Plantillas de excel para las diferentes facultades
        else if(parseInt(id_plantilla)  === 2 || parseInt(id_plantilla) === 3 || parseInt(id_plantilla) === 4) { 
            const {
                cargarPlantillasNotasExcel
            } = defensa.getState();
            const response = await cargarPlantillasNotasExcel(defensaSeleccionada.id_estudiante);
            for (const jurado of defensaSeleccionada.jurados) { 
                const data = { 
                    fecha: defensaSeleccionada.fecha,
                    estudiante: defensaSeleccionada.estudiante, 
                    carrera: response[0].carrera.nombre_carrera,
                    area: defensaSeleccionada.area, 
                    nombre_tribunal: jurado.nombre
                }
                try{ 
                    //Generar plantilla
                      const plantilla = await fetch(API_URL + `/plantilla-service/plantillas/user/${id_plantilla}`, { 
                    headers: {
                        'Content-Type': 'application/json'
                     },
                    method: "POST",
                    body: JSON.stringify(data)
                });
                    const blob = await plantilla.blob();
                    const url = URL.createObjectURL(blob);
                    const enlace = document.createElement("a");
                    enlace.href = url;
                    enlace.download = "plantilla asignacion nota " + jurado.nombre;
                    enlace.click();

                    //window.open(url, "_blank");
                }
                catch(error)  { 
                    console.log(error)
                }
            }
        }

    }
    

}));