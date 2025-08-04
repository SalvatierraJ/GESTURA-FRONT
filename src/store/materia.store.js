import { create } from "zustand";
import {
  buscarEstudiante,
  buscarEstudiantesMateriasPaginado,
  registrarInscripcionMateria,
  eliminarInscripcionMateria,
  getPensumCarrera,
  getCarrerasConPensum,
  actualizarPrerrequisitosMateria,
  actualizarEquivalenciasMateria,
} from "@/services/materias.services";

export const usePensumStore = create((set) => ({
  pensum: [],
  ajustesPensum:[],
  carrerasConPensum:[],
  materiasIdNombrePensum:[],
  estudiantesMaterias: {
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  },
  loadingPensum: false,
  loadingEstudiantes: false,
  loadingEliminar: false,
  loadingRegistrar: false,
  loadingActualizarPrereq: false,
  loadingActualizarEquiv: false,

  // Buscar pensum por nro de registro
  fetchPensum: async (nroRegistro) => {
    set({ loadingPensum: true });
    try {
      const data = await buscarEstudiante(nroRegistro);
      set({ pensum: data, loadingPensum: false });
    } catch (error) {
      set({ pensum: [], loadingPensum: false });
      console.error("Error al cargar pensum", error);
    }
  },

  // Buscar estudiantes y materias paginado
  fetchEstudiantesMateriasPaginado: async ({
    page = 1,
    pageSize = 10,
    fechaInicio,
    fechaFin,
    nombre,
  } = {}) => {
    set({ loadingEstudiantes: true });
    try {
      const data = await buscarEstudiantesMateriasPaginado({
        page,
        pageSize,
        fechaInicio,
        fechaFin,
        nombre,
      });
      set({ estudiantesMaterias: data, loadingEstudiantes: false });
    } catch (error) {
      set({
        estudiantesMaterias: {
          items: [],
          total: 0,
          page,
          pageSize,
          totalPages: 0,
        },
        loadingEstudiantes: false,
      });
      console.error("Error al cargar estudiantes", error);
    }
  },

  // Eliminar inscripción de materia
  eliminarInscripcionMateria: async (body) => {
    set({ loadingEliminar: true });
    try {
      const response = await eliminarInscripcionMateria(body);
      set({ loadingEliminar: false });
      return response; // Para mostrar mensaje o refrescar lista después
    } catch (error) {
      set({ loadingEliminar: false });
      console.error("Error al eliminar inscripción", error);
      throw error;
    }
  },

  registrarInscripcionMateria: async (body) => {
    set({ loadingRegistrar: true });
    try {
      const response = await registrarInscripcionMateria(body);
      set({ loadingRegistrar: false });
      return response; 
    } catch (error) {
      set({ loadingRegistrar: false });
      console.error("Error al registrar inscripción", error);
      throw error;
    }
  },
  fetchCarrerasConPensum: async () => {
    set({ loadingCarrerasConPensum: true });
    try {
      const data = await getCarrerasConPensum();
      set({ carrerasConPensum: data, loadingCarrerasConPensum: false });
    } catch (error) {
      set({ carrerasConPensum: [], loadingCarrerasConPensum: false });
      console.error("Error al cargar carreras con pensum", error);
    }
  },
  fetchPensumCarrera: async (arrayCarreras) => {
    set({ loadingPensum: true });
    try {
      const data = await getPensumCarrera(arrayCarreras);
      set({ ajustesPensum: data, loadingPensum: false,materiasIdNombrePensum: data.materiasIdNombrePensum });
    } catch (error) {
      set({ ajustesPensum: [], loadingPensum: false, materiasIdNombrePensum:[] });
      console.error("Error al cargar pensum de carrera", error);
    }
  },
  updatePrerequisitos: async (idMateria, prerrequisitos) => {
    set({ loadingActualizarPrereq: true });
    try {
      const res = await actualizarPrerrequisitosMateria(idMateria, prerrequisitos);
      
      set({ loadingActualizarPrereq: false });
      return res;
    } catch (error) {
      set({ loadingActualizarPrereq: false });
      throw error;
    }
  },

  updateEquivalencias: async (idMateria, equivalencias) => {
    set({ loadingActualizarEquiv: true });
    try {
      const res = await actualizarEquivalenciasMateria(idMateria, equivalencias);

      set({ loadingActualizarEquiv: false });
      return res;
    } catch (error) {
      set({ loadingActualizarEquiv: false });
      throw error;
    }
  },
  clearAjustesPensum:()=> set({ajustesPensum:[]}),
  clearPensum: () => set({ pensum: [] }),
  clearEstudiantesMaterias: () =>
    set({
      estudiantesMaterias: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
    }),
}));
