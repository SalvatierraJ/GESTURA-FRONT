import { useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { usePensumStore } from "@/store/materia.store";

const API_BASE_URL = "https://barbara-beings-commissions-zen.trycloudflare.com";

// Generar código de 3 dígitos único para grupos
const generarCodigoGrupo = () => {
  return Math.floor(100 + Math.random() * 900).toString(); // Genera número entre 100-999
};

// Generar ID único para grupos
const generarIdGrupo = () => `grupo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function useProgramacionModulo() {
  const { carrerasConPensum, fetchCarrerasConPensum } = usePensumStore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedCarrera, setSelectedCarrera] = useState(null);
  const [gestion, setGestion] = useState("");
  const [modulosMaximos, setModulosMaximos] = useState(8);
  const [moduloActual, setModuloActual] = useState(0); // Módulo en el que se está trabajando
  // Estructura: { modulo: { materiaId: [grupos] } }
  // Cada grupo: { id, horario, estudiantes: [{id_estudiante, registro, nombre, horario_preferido}] }
  const [grupos, setGrupos] = useState({});

  // Generar opciones de carrera/pensum
  const options = useMemo(() => {
    if (!carrerasConPensum || carrerasConPensum.length === 0) return [];
    return carrerasConPensum.flatMap((carrera) =>
      carrera.pensums.map((num) => ({
        label: `${carrera.nombre_carrera} (Pensum ${num})`,
        value: { nombreCarrera: carrera.nombre_carrera, numeroPensum: num },
      }))
    );
  }, [carrerasConPensum]);

  // Cargar datos del endpoint
  const cargarDatos = useCallback(async () => {
    if (!selectedCarrera || !gestion) {
      toast.error("Por favor seleccione carrera, pensum y gestión");
      return;
    }

    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/registro-materia/planificacion-academica-avanzada`);
      url.searchParams.append("carrera", selectedCarrera.nombreCarrera);
      url.searchParams.append("pensum", selectedCarrera.numeroPensum);
      url.searchParams.append("gestion", gestion);
      url.searchParams.append("aplicar_limite", "true");
      url.searchParams.append("modulos_maximos", modulosMaximos.toString());

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Error al cargar datos");
      }

      const result = await response.json();
      setData(result);
      // Inicializar grupos vacíos
      setGrupos({});
      setModuloActual(0);
      toast.success("Datos cargados correctamente");
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar los datos de planificación");
    } finally {
      setLoading(false);
    }
  }, [selectedCarrera, gestion, modulosMaximos]);

  // Obtener estudiantes disponibles para una materia en el módulo actual
  // (estudiantes que no están en ningún grupo del módulo actual)
  const getEstudiantesDisponibles = useCallback(
    (materiaId) => {
      if (!data?.resumen_demanda) return [];

      const materia = data.resumen_demanda.find((m) => m.id_materia === materiaId);
      if (!materia) return [];

      // Obtener todos los estudiantes de la materia
      const todosEstudiantes = [];
      materia.preferencias_horario?.forEach((pref) => {
        pref.estudiantes?.forEach((est) => {
          todosEstudiantes.push({
            ...est,
            horario_preferido: est.horario_preferido || pref.horario,
            horario_original: pref.horario,
          });
        });
      });

      // Obtener estudiantes ya asignados a grupos en el módulo actual
      const gruposModuloActual = grupos[moduloActual] || {};
      const gruposMateria = gruposModuloActual[materiaId] || [];
      const estudiantesEnGrupos = new Set();
      gruposMateria.forEach((grupo) => {
        grupo.estudiantes?.forEach((est) => {
          estudiantesEnGrupos.add(est.id_estudiante.toString());
        });
      });

      // Filtrar estudiantes disponibles
      return todosEstudiantes.filter(
        (est) => !estudiantesEnGrupos.has(est.id_estudiante.toString())
      );
    },
    [data, grupos, moduloActual]
  );

  // Crear un nuevo grupo
  const crearGrupo = useCallback(
    (materiaId, horario, estudiantesIds, limiteMaximo = null) => {
      if (!materiaId || !horario || !estudiantesIds || estudiantesIds.length === 0) {
        toast.error("Debe seleccionar al menos un estudiante");
        return;
      }

      // Obtener datos completos de los estudiantes
      const estudiantesCompletos = [];
      data.resumen_demanda?.forEach((materia) => {
        if (materia.id_materia === materiaId) {
          materia.preferencias_horario?.forEach((pref) => {
            pref.estudiantes?.forEach((est) => {
              if (estudiantesIds.includes(est.id_estudiante.toString())) {
                estudiantesCompletos.push({
                  ...est,
                  horario_preferido: est.horario_preferido || pref.horario,
                  horario_original: pref.horario,
                });
              }
            });
          });
        }
      });

      if (estudiantesCompletos.length === 0) {
        toast.error("No se encontraron los estudiantes seleccionados");
        return;
      }

      setGrupos((prev) => {
        const nuevo = { ...prev };
        if (!nuevo[moduloActual]) {
          nuevo[moduloActual] = {};
        }
        if (!nuevo[moduloActual][materiaId]) {
          nuevo[moduloActual][materiaId] = [];
        }

        // Generar código único de 3 dígitos
        let codigo = generarCodigoGrupo();
        // Verificar que el código no exista en ningún módulo
        const todosLosCodigos = new Set();
        Object.values(nuevo).forEach((materias) => {
          Object.values(materias).forEach((gruposMateria) => {
            gruposMateria.forEach((g) => {
              if (g.codigo) todosLosCodigos.add(g.codigo);
            });
          });
        });
        while (todosLosCodigos.has(codigo)) {
          codigo = generarCodigoGrupo();
        }

        const nuevoGrupo = {
          id: generarIdGrupo(),
          codigo,
          horario,
          estudiantes: estudiantesCompletos,
          limiteMaximo: limiteMaximo || null,
        };

        nuevo[moduloActual][materiaId] = [...nuevo[moduloActual][materiaId], nuevoGrupo];
        return nuevo;
      });

      toast.success(`Grupo creado con ${estudiantesCompletos.length} estudiantes`);
    },
    [moduloActual, data]
  );

  // Eliminar un grupo
  const eliminarGrupo = useCallback((materiaId, grupoId) => {
    setGrupos((prev) => {
      const nuevo = { ...prev };
      if (nuevo[moduloActual]?.[materiaId]) {
        nuevo[moduloActual][materiaId] = nuevo[moduloActual][materiaId].filter(
          (g) => g.id !== grupoId
        );
        if (nuevo[moduloActual][materiaId].length === 0) {
          delete nuevo[moduloActual][materiaId];
        }
      }
      return nuevo;
    });
    toast.success("Grupo eliminado");
  }, [moduloActual]);

  // Editar un grupo (agregar o quitar estudiantes y/o cambiar horario)
  const editarGrupo = useCallback(
    (materiaId, grupoId, estudiantesIds, nuevoHorario = null, limiteMaximo = null) => {
      setGrupos((prev) => {
        const nuevo = { ...prev };
        if (!nuevo[moduloActual]?.[materiaId]) return nuevo;

        const grupoIndex = nuevo[moduloActual][materiaId].findIndex((g) => g.id === grupoId);
        if (grupoIndex === -1) return nuevo;

        // Obtener datos completos de los estudiantes
        const estudiantesCompletos = [];
        data.resumen_demanda?.forEach((materia) => {
          if (materia.id_materia === materiaId) {
            materia.preferencias_horario?.forEach((pref) => {
              pref.estudiantes?.forEach((est) => {
                if (estudiantesIds.includes(est.id_estudiante.toString())) {
                  estudiantesCompletos.push({
                    ...est,
                    horario_preferido: est.horario_preferido || pref.horario,
                    horario_original: pref.horario,
                  });
                }
              });
            });
          }
        });

        nuevo[moduloActual][materiaId][grupoIndex] = {
          ...nuevo[moduloActual][materiaId][grupoIndex],
          estudiantes: estudiantesCompletos,
          horario: nuevoHorario || nuevo[moduloActual][materiaId][grupoIndex].horario,
          limiteMaximo: limiteMaximo !== null ? limiteMaximo : nuevo[moduloActual][materiaId][grupoIndex].limiteMaximo,
        };

        return nuevo;
      });
      toast.success("Grupo actualizado");
    },
    [moduloActual, data]
  );

  // Obtener grupos de una materia en el módulo actual
  const getGruposMateria = useCallback(
    (materiaId) => {
      return grupos[moduloActual]?.[materiaId] || [];
    },
    [grupos, moduloActual]
  );

  // Obtener información de asignación previa de un estudiante
  const getAsignacionEstudiante = useCallback(
    (idEstudiante, materiaId) => {
      const asignaciones = [];
      Object.entries(grupos).forEach(([modulo, materias]) => {
        Object.entries(materias).forEach(([matId, gruposMateria]) => {
          // Buscar información de la materia
          const materia = data?.resumen_demanda?.find((m) => m.id_materia === matId);
          gruposMateria.forEach((grupo) => {
            const estaEnGrupo = grupo.estudiantes?.some(
              (est) => est.id_estudiante.toString() === idEstudiante.toString()
            );
            if (estaEnGrupo) {
              asignaciones.push({
                modulo: parseInt(modulo),
                materiaId: matId,
                materiaNombre: materia?.nombre || "N/A",
                materiaSigla: materia?.sigla || "N/A",
                grupoId: grupo.id,
                codigoGrupo: grupo.codigo,
                horarioGrupo: grupo.horario,
              });
            }
          });
        });
      });
      return asignaciones;
    },
    [grupos, data]
  );

  // Cambiar módulo actual (reinicia la vista pero mantiene los grupos)
  const cambiarModulo = useCallback((nuevoModulo) => {
    setModuloActual(nuevoModulo);
    toast.info(`Trabajando en Módulo M${nuevoModulo}`);
  }, []);

  // Calcular estadísticas
  const estadisticasProgramacion = useMemo(() => {
    if (!data || !data.resumen_demanda) return null;

    const stats = {
      totalEstudiantes: data.total_estudiantes || 0,
      estudiantesEnGrupos: new Set(),
      gruposPorModulo: {},
      estudiantesPorModulo: {},
      totalGrupos: 0,
    };

    // Contar grupos y estudiantes por módulo
    Object.entries(grupos).forEach(([modulo, materias]) => {
      let gruposModulo = 0;
      const estudiantesModulo = new Set();

      Object.values(materias).forEach((gruposMateria) => {
        gruposModulo += gruposMateria.length;
        gruposMateria.forEach((grupo) => {
          grupo.estudiantes?.forEach((est) => {
            estudiantesModulo.add(est.id_estudiante.toString());
            stats.estudiantesEnGrupos.add(est.id_estudiante.toString());
          });
        });
      });

      stats.gruposPorModulo[modulo] = gruposModulo;
      stats.estudiantesPorModulo[modulo] = estudiantesModulo.size;
      stats.totalGrupos += gruposModulo;
    });

    stats.estudiantesEnGrupos = stats.estudiantesEnGrupos.size;

    return stats;
  }, [data, grupos]);

  // Generar datos para Excel
  const generarDatosExcel = useCallback(() => {
    if (!data || !data.resumen_demanda) return { datos: [], resumen: [] };

    const datosExcel = [];

    // Encabezados
    datosExcel.push([
      "Módulo",
      "ID Materia",
      "Nombre Materia",
      "Sigla",
      "Código Grupo",
      "ID Grupo",
      "Horario Grupo",
      "ID Estudiante",
      "Registro",
      "Nombre Estudiante",
      "Horario Preferido Original",
    ]);

    // Datos de grupos
    Object.entries(grupos)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .forEach(([modulo, materias]) => {
        Object.entries(materias).forEach(([materiaId, gruposMateria]) => {
          const materia = data.resumen_demanda.find((m) => m.id_materia === materiaId);
          if (!materia) return;

          gruposMateria.forEach((grupo) => {
            grupo.estudiantes?.forEach((estudiante) => {
              datosExcel.push([
                `M${modulo}`,
                materia.id_materia,
                materia.nombre,
                materia.sigla,
                grupo.codigo || "N/A",
                grupo.id,
                grupo.horario,
                estudiante.id_estudiante,
                estudiante.registro,
                estudiante.nombre,
                estudiante.horario_original || estudiante.horario_preferido || "",
              ]);
            });
          });
        });
      });

    // Hoja de resumen
    const resumen = [
      ["RESUMEN DE GRUPOS POR MÓDULO"],
      [],
      ["Módulo", "Total Grupos", "Estudiantes Asignados"],
    ];

    if (estadisticasProgramacion) {
      Object.entries(estadisticasProgramacion.gruposPorModulo)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .forEach(([modulo, totalGrupos]) => {
          resumen.push([
            `M${modulo}`,
            totalGrupos,
            estadisticasProgramacion.estudiantesPorModulo[modulo] || 0,
          ]);
        });

      resumen.push([]);
      resumen.push(["Total Grupos", estadisticasProgramacion.totalGrupos]);
      resumen.push([
        "Total Estudiantes en Grupos",
        estadisticasProgramacion.estudiantesEnGrupos,
      ]);
    }

    return { datos: datosExcel, resumen };
  }, [data, grupos, estadisticasProgramacion]);

  return {
    loading,
    data,
    selectedCarrera,
    setSelectedCarrera,
    gestion,
    setGestion,
    modulosMaximos,
    setModulosMaximos,
    moduloActual,
    cambiarModulo,
    grupos,
    cargarDatos,
    crearGrupo,
    eliminarGrupo,
    editarGrupo,
    getGruposMateria,
    getEstudiantesDisponibles,
    getAsignacionEstudiante,
    estadisticasProgramacion,
    generarDatosExcel,
    options,
    fetchCarrerasConPensum,
  };
}
