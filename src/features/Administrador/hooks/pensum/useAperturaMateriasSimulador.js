import { useEffect, useState, useCallback } from "react";
import { usePensumStore } from "@/store/materia.store";

export default function useAperturaMateriasSimulador() {
  const {
    materiasRecomendadas = [],
    loadingMateriasRecomendadas,
    fetchMateriasRecomendadas,
    clearMateriasRecomendadas,
  } = usePensumStore();

  const [selected, setSelected] = useState(null);

  const [materiaSeleccionada, setMateriaSeleccionada] = useState("");
  const [horariosApertura, setHorariosApertura] = useState({});
  const [acordeon, setAcordeon] = useState({});
  const [grupos, setGrupos] = useState([]); 
  const [modulosSeleccion, setModulosSeleccion] = useState({});
  const [estudiantesSeleccion, setEstudiantesSeleccion] = useState({});
  const [cantidadGrupo, setCantidadGrupo] = useState({});
  const [estAsignados, setEstAsignados] = useState({});

  const materias = materiasRecomendadas.map((m) => m.materia);
  const materiaData = materiasRecomendadas.find(
    (m) => m.materia.id === materiaSeleccionada
  );

  function getEstudiantesPorTurno(horario, key) {
    const estudiantes = horario.detalle_estudiantes || [];
    const semestreMateria = parseInt(materiaData?.materia.semestre || "1");
    const asignados = estAsignados[key] || [];
    return estudiantes
      .filter((e) => !asignados.includes(e.registro))
      .sort(
        (a, b) =>
          (b.semestre_actual > semestreMateria ? 1 : 0) -
          (a.semestre_actual > semestreMateria ? 1 : 0)
      );
  }

  useEffect(() => {
    setHorariosApertura({});
    setAcordeon({});
    setModulosSeleccion({});
    setEstudiantesSeleccion({});
    setCantidadGrupo({});
  }, [materiaSeleccionada]);

  const handleBuscarMateriasRecomendadas = useCallback(async () => {
    if (selected) {
      await fetchMateriasRecomendadas(selected.nombreCarrera, selected.numeroPensum);
    }
  }, [selected, fetchMateriasRecomendadas]);

  function handleApertura(idx, value) {
    const key = `${materiaSeleccionada}-${idx}`;
    setHorariosApertura((prev) => ({ ...prev, [key]: value }));
    if (value) {
      const h = materiaData.horarios[idx];
      const estudiantesTurno = getEstudiantesPorTurno(h, key);
      const semestreMateria = parseInt(materiaData.materia.semestre);
      const rezagados = estudiantesTurno
        .filter((e) => e.semestre_actual > semestreMateria)
        .map((e) => e.registro);
      setEstudiantesSeleccion((prev) => ({
        ...prev,
        [key]:
          prev[key] ||
          (rezagados.length > 0
            ? rezagados
            : estudiantesTurno.map((e) => e.registro)),
      }));
      setModulosSeleccion((prev) => ({
        ...prev,
        [key]: prev[key] || "",
      }));
      setCantidadGrupo((prev) => ({
        ...prev,
        [key]: prev[key] || "",
      }));
    }
  }

  function toggleAcordeon(idx) {
    const key = `${materiaSeleccionada}-${idx}`;
    setAcordeon((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleCrearGrupo(
    turno,
    key,
    estudiantesAsignados,
    modulo,
    cantidadExacta
  ) {
    setEstAsignados((prev) => ({
      ...prev,
      [key]: [
        ...(prev[key] || []),
        ...estudiantesAsignados.map((e) => e.registro),
      ],
    }));

    setGrupos((prev) => [
      ...prev,
      {
        materia: materiaData.materia.nombre,
        sigla: materiaData.materia.sigla,
        turno,
        modulo,
        cantidad: cantidadExacta,
        estudiantes: estudiantesAsignados,
        keyGrupo: key,
        idMateria: materiaData.materia.id,
      },
    ]);
    setModulosSeleccion((prev) => ({ ...prev, [key]: "" }));
    setEstudiantesSeleccion((prev) => ({ ...prev, [key]: [] }));
    setCantidadGrupo((prev) => ({ ...prev, [key]: "" }));
  }

  function eliminarGrupo(idx) {
    const grupo = grupos[idx];
    if (grupo) {
      setEstAsignados((prev) => {
        const nuevos = { ...prev };
        if (nuevos[grupo.keyGrupo]) {
          nuevos[grupo.keyGrupo] = nuevos[grupo.keyGrupo].filter(
            (reg) => !grupo.estudiantes.some((e) => e.registro === reg)
          );
        }
        return nuevos;
      });
    }
    setGrupos((prev) => prev.filter((_, i) => i !== idx));
  }

  function getAnchoGrupo(cantidad) {
    if (cantidad > 30) return "w-full";
    if (cantidad > 15) return "w-2/3";
    return "w-1/3";
  }

  return {
    materiasRecomendadas,
    loadingMateriasRecomendadas,
    selected,
    setSelected,
    handleBuscarMateriasRecomendadas,
    materiaSeleccionada,
    setMateriaSeleccionada,
    horariosApertura,
    acordeon,
    grupos,
    modulosSeleccion,
    estudiantesSeleccion,
    cantidadGrupo,
    estAsignados,
    materias,
    materiaData,
    getEstudiantesPorTurno,
    handleApertura,
    toggleAcordeon,
    handleCrearGrupo,
    eliminarGrupo,
    getAnchoGrupo,
    setHorariosApertura,
    setAcordeon,
    setGrupos,
    setModulosSeleccion,
    setEstudiantesSeleccion,
    setCantidadGrupo,
    setEstAsignados,
    clearMateriasRecomendadas,
  };
}
