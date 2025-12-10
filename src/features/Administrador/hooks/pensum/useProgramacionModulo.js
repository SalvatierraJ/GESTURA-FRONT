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

  // Función para verificar solapamiento de horarios
  const horariosSolapan = useCallback((horario1, horario2) => {
    if (!horario1 || !horario2) return false;
    
    // Parsear horarios (formato: "HH:MM-HH:MM")
    const parseHorario = (h) => {
      const [inicio, fin] = h.split('-');
      if (!inicio || !fin) return null;
      const [h1, m1] = inicio.split(':').map(Number);
      const [h2, m2] = fin.split(':').map(Number);
      if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return null;
      return {
        inicio: h1 * 60 + m1, // Convertir a minutos desde medianoche
        fin: h2 * 60 + m2
      };
    };

    const h1 = parseHorario(horario1);
    const h2 = parseHorario(horario2);
    
    if (!h1 || !h2) return false;
    
    // Verificar solapamiento: h1.inicio < h2.fin && h2.inicio < h1.fin
    return h1.inicio < h2.fin && h2.inicio < h1.fin;
  }, []);

  // Verificar si un estudiante tiene conflicto de horario con otros grupos
  const tieneConflictoHorario = useCallback(
    (idEstudiante, horarioGrupo, materiaIdActual, grupoIdExcluir = null) => {
      // Buscar en todos los módulos y materias
      for (const [modulo, materias] of Object.entries(grupos)) {
        for (const [matId, gruposMateria] of Object.entries(materias)) {
          for (const grupo of gruposMateria) {
            // Excluir el grupo actual si se está editando
            if (grupoIdExcluir && grupo.id === grupoIdExcluir) continue;
            
            // Verificar si el estudiante está en este grupo
            const estaEnGrupo = grupo.estudiantes?.some(
              (est) => est.id_estudiante.toString() === idEstudiante.toString()
            );
            
            if (estaEnGrupo && grupo.horario) {
              // Verificar solapamiento de horarios
              if (horariosSolapan(horarioGrupo, grupo.horario)) {
                return {
                  conflicto: true,
                  modulo: parseInt(modulo),
                  materiaId: matId,
                  grupoCodigo: grupo.codigo,
                  horarioConflicto: grupo.horario,
                };
              }
            }
          }
        }
      }
      return { conflicto: false };
    },
    [grupos, horariosSolapan]
  );

  // Obtener estudiantes disponibles para una materia en el módulo actual
  // Retorna todos los estudiantes con información sobre disponibilidad y razones de bloqueo
  const getEstudiantesDisponibles = useCallback(
    (materiaId, horarioGrupo = null, grupoIdExcluir = null) => {
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

      // Obtener información de estudiantes ya asignados a grupos de la MISMA materia en CUALQUIER módulo
      // IMPORTANTE: Si un estudiante está en un grupo de esta materia en CUALQUIER módulo,
      // debe aparecer pero marcado como NO disponible (deshabilitado) para que el usuario lo vea
      const estudiantesEnMismaMateria = new Map(); // Map para guardar información del grupo
      
      Object.entries(grupos).forEach(([modulo, materias]) => {
        const moduloNum = parseInt(modulo);
        const gruposMateria = materias[materiaId] || [];
        gruposMateria.forEach((grupo) => {
          // Excluir el grupo actual si se está editando
          if (grupoIdExcluir && grupo.id === grupoIdExcluir) return;
          
          grupo.estudiantes?.forEach((est) => {
            // Asegurar que el ID se obtiene correctamente
            const idEst = est.id_estudiante ? est.id_estudiante.toString() : null;
            if (!idEst) return; // Saltar si no hay ID válido
            
            // Guardar información para mostrar (si no está ya guardado)
            if (!estudiantesEnMismaMateria.has(idEst)) {
              estudiantesEnMismaMateria.set(idEst, {
                modulo: moduloNum,
                codigoGrupo: grupo.codigo,
                horario: grupo.horario,
                razon: `Ya está en esta materia (M${modulo}-${grupo.codigo}) en horario ${grupo.horario}`,
              });
            }
          });
        });
      });

      // NO filtrar estudiantes - mostrar TODOS pero marcar los que ya están en grupos como no disponibles
      // Mapear todos los estudiantes con información de disponibilidad
      return todosEstudiantes.map((est) => {
        const idEstudiante = est.id_estudiante.toString();
        const enMismaMateria = estudiantesEnMismaMateria.get(idEstudiante);
        
        // Verificar conflicto de horario si hay horario del grupo
        let conflictoHorario = null;
        if (horarioGrupo && !enMismaMateria) {
          const conflicto = tieneConflictoHorario(
            idEstudiante,
            horarioGrupo,
            materiaId,
            grupoIdExcluir
          );
          if (conflicto.conflicto) {
            conflictoHorario = {
              modulo: conflicto.modulo,
              codigoGrupo: conflicto.grupoCodigo,
              horario: conflicto.horarioConflicto,
              razon: `Conflicto de horario con M${conflicto.modulo}-${conflicto.grupoCodigo} (${conflicto.horarioConflicto})`,
            };
          }
        }

        const disponible = !enMismaMateria && !conflictoHorario;
        const razonBloqueo = enMismaMateria 
          ? enMismaMateria.razon 
          : conflictoHorario 
            ? conflictoHorario.razon 
            : null;

        return {
          ...est,
          disponible,
          razonBloqueo,
          infoBloqueo: enMismaMateria || conflictoHorario,
        };
      });
    },
    [data, grupos, moduloActual, tieneConflictoHorario]
  );

  // Crear un nuevo grupo
  const crearGrupo = useCallback(
    (materiaId, horario, estudiantesIds, limiteMaximo = null) => {
      if (!materiaId || !horario || !estudiantesIds || estudiantesIds.length === 0) {
        toast.error("Debe seleccionar al menos un estudiante");
        return;
      }

      // Validar que los estudiantes no tengan conflictos de horario
      // EXCEPCIÓN: Estudiantes con horario "15:00-19:00" o "EX.SUFIC." se asignan automáticamente
      const estudiantesConConflicto = [];
      estudiantesIds.forEach((idEstudiante) => {
        // Obtener el horario preferido del estudiante
        let horarioPreferidoEstudiante = null;
        data.resumen_demanda?.forEach((materia) => {
          if (materia.id_materia === materiaId) {
            materia.preferencias_horario?.forEach((pref) => {
              pref.estudiantes?.forEach((est) => {
                if (est.id_estudiante.toString() === idEstudiante) {
                  horarioPreferidoEstudiante = est.horario_preferido || pref.horario;
                }
              });
            });
          }
        });

        // Si el estudiante tiene horario "15:00-19:00" o "EX.SUFIC.", permitirlo (se asignará al horario del grupo)
        if (horarioPreferidoEstudiante === "15:00-19:00" || horarioPreferidoEstudiante === "EX.SUFIC.") {
          return; // Saltar validación para estos estudiantes
        }

        const conflicto = tieneConflictoHorario(idEstudiante, horario, materiaId);
        if (conflicto.conflicto) {
          estudiantesConConflicto.push({
            id: idEstudiante,
            conflicto,
          });
        }
      });

      if (estudiantesConConflicto.length > 0) {
        const primerConflicto = estudiantesConConflicto[0].conflicto;
        toast.error(
          `${estudiantesConConflicto.length} estudiante(s) tienen conflicto de horario. Ejemplo: conflicto con M${primerConflicto.modulo}-${primerConflicto.grupoCodigo} (${primerConflicto.horarioConflicto})`
        );
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

        // Verificar que no exista un grupo idéntico (mismo horario y mismos estudiantes)
        const existeGrupoDuplicado = nuevo[moduloActual][materiaId].some((g) => {
          if (g.horario !== horario) return false;
          const estudiantesIdsGrupo = new Set(
            g.estudiantes?.map((e) => e.id_estudiante.toString()) || []
          );
          const estudiantesIdsNuevo = new Set(
            estudiantesCompletos.map((e) => e.id_estudiante.toString())
          );
          if (estudiantesIdsGrupo.size !== estudiantesIdsNuevo.size) return false;
          return [...estudiantesIdsGrupo].every((id) => estudiantesIdsNuevo.has(id));
        });

        if (existeGrupoDuplicado) {
          toast.error("Ya existe un grupo con el mismo horario y los mismos estudiantes");
          return prev; // No hacer cambios
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
    [moduloActual, data, tieneConflictoHorario]
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
      // Obtener el horario a usar (nuevo o el actual)
      const horarioAGuardar = nuevoHorario || grupos[moduloActual]?.[materiaId]?.find((g) => g.id === grupoId)?.horario;
      
      if (!horarioAGuardar) {
        toast.error("El grupo debe tener un horario");
        return;
      }

      // Validar que los estudiantes no tengan conflictos de horario
      // EXCEPCIÓN: Estudiantes con horario "15:00-19:00" o "EX.SUFIC." se asignan automáticamente
      const estudiantesConConflicto = [];
      estudiantesIds.forEach((idEstudiante) => {
        // Obtener el horario preferido del estudiante
        let horarioPreferidoEstudiante = null;
        data.resumen_demanda?.forEach((materia) => {
          if (materia.id_materia === materiaId) {
            materia.preferencias_horario?.forEach((pref) => {
              pref.estudiantes?.forEach((est) => {
                if (est.id_estudiante.toString() === idEstudiante) {
                  horarioPreferidoEstudiante = est.horario_preferido || pref.horario;
                }
              });
            });
          }
        });

        // Si el estudiante tiene horario "15:00-19:00" o "EX.SUFIC.", permitirlo (se asignará al horario del grupo)
        if (horarioPreferidoEstudiante === "15:00-19:00" || horarioPreferidoEstudiante === "EX.SUFIC.") {
          return; // Saltar validación para estos estudiantes
        }

        const conflicto = tieneConflictoHorario(idEstudiante, horarioAGuardar, materiaId, grupoId);
        if (conflicto.conflicto) {
          estudiantesConConflicto.push({
            id: idEstudiante,
            conflicto,
          });
        }
      });

      if (estudiantesConConflicto.length > 0) {
        const primerConflicto = estudiantesConConflicto[0].conflicto;
        toast.error(
          `${estudiantesConConflicto.length} estudiante(s) tienen conflicto de horario. Ejemplo: conflicto con M${primerConflicto.modulo}-${primerConflicto.grupoCodigo} (${primerConflicto.horarioConflicto})`
        );
        return;
      }

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
          horario: horarioAGuardar,
          limiteMaximo: limiteMaximo !== null ? limiteMaximo : nuevo[moduloActual][materiaId][grupoIndex].limiteMaximo,
        };

        return nuevo;
      });
      toast.success("Grupo actualizado");
    },
    [moduloActual, data, grupos, tieneConflictoHorario]
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
