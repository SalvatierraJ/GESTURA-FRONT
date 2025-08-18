import { useEffect, useMemo, useState } from "react";
import { useDocentesStore } from "@/store/docentes.store";
import { usePeriodoStore } from "@/store/periodoModulo.store";

const HORARIOS_FIJOS = [
  { label: "07:15-10:00", turno: "MAÑANA", extra: "" },
  { label: "10:15-13:00", turno: "MAÑANA", extra: "" },
  { label: "13:15-16:00", turno: "TARDE", extra: "" },
  { label: "15:00-19:00", turno: "TARDE", extra: "SEMI-PRESENCIAL" },
  { label: "16:15-19:00", turno: "TARDE", extra: "" },
  { label: "19:30-21:30", turno: "NOCHE", extra: "SEMI-PRESENCIAL" },
  { label: "19:15-21:45", turno: "NOCHE", extra: "" },
];

function currentGestion(d = new Date()) {
  const year = d.getFullYear();
  const month = d.getMonth();
  const sem = month <= 5 ? 1 : 2;
  return `${year}-${sem}`;
}
function stepBack(gestion) {
  const m = /^(\d{4})-(1|2)$/.exec(gestion);
  if (!m) return null;
  let y = parseInt(m[1], 10);
  let s = parseInt(m[2], 10);
  if (s === 2) s = 1;
  else {
    s = 2;
    y -= 1;
  }
  return `${y}-${s}`;
}
function lastTwoGestiones() {
  const curr = currentGestion();
  const prev1 = stepBack(curr);
  const prev2 = stepBack(prev1);
  return { prev1, prev2 };
}
function moduloToIndex(m) {
  if (!m) return null;
  const n = String(m).trim().toUpperCase().replace(/^M/, "");
  const idx = parseInt(n, 10);
  return Number.isFinite(idx) ? idx : null;
}
function esBimodular(m) {
  return Boolean(m?.biModular ?? m?.BiModular ?? m?.bimodular);
}
function rangoModulos(m) {
  const idx = moduloToIndex(m?.modulo);
  if (idx == null) return new Set();
  if (esBimodular(m)) return new Set([idx, idx + 1]);
  return new Set([idx]);
}
function intersectaRangoModulos(a, b) {
  for (const x of a) if (b.has(x)) return true;
  return false;
}
function materiaPasaFiltroPorModulo(m, modulosSeleccionados) {
  if (!modulosSeleccionados?.length) return true;
  const rango = rangoModulos(m);
  return modulosSeleccionados.some((M) => rango.has(moduloToIndex(M)));
}
function materiaPasaFiltroPorHorario(m, horariosSeleccionados) {
  if (!horariosSeleccionados?.length) return true;
  const h = String(m?.horario ?? "").trim();
  return horariosSeleccionados.includes(h);
}

export function useAsignacionMateriaDocente() {
  const [asignaciones, setAsignaciones] = useState({});
  const [avisos, setAvisos] = useState({});
  const [filtrosPorMateria, setFiltrosPorMateria] = useState({});
  const { prev1, prev2 } = useMemo(() => lastTwoGestiones(), []);
  const getPeriodoDeModulo = usePeriodoStore((s) => s.getPeriodoDeModulo);
  const gestionActualPeriodo = usePeriodoStore((s) => s.gestionActual);

  const MODULO_OPCIONES = useMemo(
    () =>
      ["M0", "M1", "M2", "M3", "M4", "M5", "M6"].map((m) => ({
        label: m,
        value: m,
      })),
    []
  );

  const HORARIO_OPCIONES = useMemo(
    () =>
      HORARIOS_FIJOS.map((h) => ({
        label: `${h.label} · ${h.turno}${h.extra ? ` · ${h.extra}` : ""}`,
        value: h.label,
      })),
    []
  );
  const [modulosFiltro, setModulosFiltro] = useState([]);
  const [horariosFiltro, setHorariosFiltro] = useState([]);
  const {
    cargarHistorialDocenteMaterias,
    materiasHistorial,
    docentesHistorial,
    loadingHistorial,
    errorHistorial,
    sugerirDocenteIAParaMateria,
    iaLoading,
    iaSugerencias,
    guardarAsignacion,
    desasignarDocente,
    asignando,
  } = useDocentesStore();

  useEffect(() => {
    cargarHistorialDocenteMaterias();
  }, [cargarHistorialDocenteMaterias]);

  const materias = materiasHistorial || [];

  const materiaById = useMemo(() => {
    const m = new Map();
    materias.forEach((x) => m.set(parseInt(x.id), x));
    return m;
  }, [materias]);

  const materiasFiltradas = useMemo(() => {

    
    const filtered = (materias || []).filter(
      (m) => {
        const pasaModulo = materiaPasaFiltroPorModulo(m, modulosFiltro);
        const pasaHorario = materiaPasaFiltroPorHorario(m, horariosFiltro);
        return pasaModulo && pasaHorario;
      }
    );
    
    return filtered;
  }, [materias, modulosFiltro, horariosFiltro]);

  const DOCENTES = useMemo(() => {
    return (docentesHistorial || []).map((d) => {
      const p = d?.docente || {};
      const id = parseInt(p.id);
      const nombre = [p.nombres, p.ap_paterno, p.ap_materno]
        .filter(Boolean)
        .join(" ");
      return { id, nombre };
    });
  }, [docentesHistorial]);

  function getFiltros(mId) {
    return (
      filtrosPorMateria[mId] || { g1: false, g2: false, mismaSigla: false }
    );
  }
  function toggleFiltro(mId, key) {
    setFiltrosPorMateria((prev) => {
      const cur = prev[mId] || { g1: false, g2: false, mismaSigla: false };
      return { ...prev, [mId]: { ...cur, [key]: !cur[key] } };
    });
  }

  function buildDocenteOptionsParaMateria(materia) {
    const { g1, g2, mismaSigla } = getFiltros(String(materia.id));
    const gestionesSeleccionadas = [
      ...(g1 ? [prev1] : []),
      ...(g2 ? [prev2] : []),
    ];

    const mapDoc = new Map();
    (docentesHistorial || []).forEach((d) => {
      if (d?.docente?.id != null) mapDoc.set(String(d.docente.id), d);
    });

    return DOCENTES.filter((doc) => {
      const full = mapDoc.get(String(doc.id));
      if (!full) return false;
      const mats = Array.isArray(full.materias) ? full.materias : [];

      if (gestionesSeleccionadas.length > 0) {
        const tieneEnVentana = mats.some(
          (m) => m?.gestion && gestionesSeleccionadas.includes(m.gestion)
        );
        if (!tieneEnVentana) return false;
      }

      if (mismaSigla) {
        const okSigla = mats.some(
          (m) =>
            (m?.sigla || "").toUpperCase().trim() ===
            String(materia.sigla || "")
              .toUpperCase()
              .trim()
        );
        if (!okSigla) return false;
      }

      return true;
    }).map((d) => ({ label: d.nombre, value: d.id }));
  }

  function moduloIndex(m) {
    if (!m) return null;
    const n = String(m).trim().toUpperCase().replace(/^M/, "");
    const idx = parseInt(n, 10);
    return Number.isFinite(idx) ? idx : null;
  }
  function esBimodularCard(m) {
    return Boolean(m?.biModular ?? m?.BiModular ?? m?.bimodular);
  }

  function bloqueadoPorFecha(materia) {
    const idx = moduloIndex(materia?.modulo);
    if (idx == null) return false;
    const moduloKey = `M${idx}`;
    const periodo = getPeriodoDeModulo(moduloKey);
    if (!periodo?.fin) return false;
    const hoy = new Date();
    return hoy > periodo.fin;
  }

  function motivoBloqueo(materia) {
    const idx = moduloIndex(materia?.modulo);
    if (idx == null) return "Sin módulo definido.";
    const periodo = getPeriodoDeModulo(`M${idx}`);
    if (!periodo?.fin) return "No hay fecha fin configurada para el módulo.";
    return `Cerrado: fin de ${
      periodo.modulo
    } (${periodo.fin.toLocaleDateString()})`;
  }

  function conflictoMismoModuloYHorario(docenteId, materia, asigns, byId) {
    const rangoActual = rangoModulos(materia);
    const horActual = String(materia.horario).trim();

    return Object.entries(asigns).some(([matId, docId]) => {
      if (parseInt(String(docId)) !== Number(docenteId)) return false;
      if (String(matId) === String(materia.id)) return false;

      const ya = byId.get(parseInt(matId));
      if (!ya) return false;

      const mismoHor = String(ya.horario).trim() === horActual;
      if (!mismoHor) return false;

      const rangoOtra = rangoModulos(ya);
      return intersectaRangoModulos(rangoActual, rangoOtra);
    });
  }

  function onDocenteSelect(materiaId, docenteId) {
    setAsignaciones((prev) => ({
      ...prev,
      [String(materiaId)]: docenteId || undefined,
    }));
    setAvisos((prev) => ({ ...prev, [String(materiaId)]: "" }));
  }

  async function onSugerirIA(materia) {
    try {
      const res = await sugerirDocenteIAParaMateria(materia.id);
      const pack = iaSugerencias?.[String(materia.id)] ?? res;
      const best = pack?.best;

      if (!best?.docente_id) {
        setAvisos((prev) => ({
          ...prev,
          [materia.id]: "La IA no devolvió una sugerencia.",
        }));
        return;
      }

      const sugerido = Number(best.docente_id);

      if (
        conflictoMismoModuloYHorario(
          sugerido,
          materia,
          asignaciones,
          materiaById
        )
      ) {
        onDocenteSelect(materia.id, sugerido);
        setAvisos((prev) => ({
          ...prev,
          [materia.id]:
            "Ya asignado en una materia anterior en el mismo horario y módulo (considerando bimodular).",
        }));
        return;
      }

      onDocenteSelect(materia.id, sugerido);
      setAvisos((prev) => ({
        ...prev,
        [materia.id]: best?.razon
          ? `Sugerido por IA: ${best.razon}`
          : "Sugerido por IA aplicado.",
      }));
    } catch {
      setAvisos((prev) => ({
        ...prev,
        [materia.id]: "Error al consultar la IA.",
      }));
    }
  }
  async function onAsignarClick(materia) {
    const seleccionado = asignaciones[materia.id];
    if (!seleccionado) {
      setAvisos((prev) => ({
        ...prev,
        [materia.id]: "Selecciona un docente primero.",
      }));
      return;
    }
    try {
      await guardarAsignacion(materia.id, Number(seleccionado));
      setAvisos((prev) => ({
        ...prev,
        [materia.id]: "Asignado correctamente.",
      }));
    } catch (e) {
      setAvisos((prev) => ({
        ...prev,
        [materia.id]: "No se pudo asignar. Intenta de nuevo.",
      }));
    }
  }

  async function onDesasignarClick(materia) {
    try {
      await desasignarDocente(materia.id);
      setAvisos((prev) => ({ ...prev, [materia.id]: "Desasignado." }));
      setAsignaciones((prev) => {
        const next = { ...prev };
        if (String(next[materia.id]) === String(materia.id_docente))
          next[materia.id] = undefined;
        return next;
      });
    } catch (e) {
      setAvisos((prev) => ({
        ...prev,
        [materia.id]: "No se pudo desasignar. Intenta de nuevo.",
      }));
    }
  }

  function onAsignarCandidato(materia, candidatoDocenteId) {
    const docenteNum = Number(candidatoDocenteId);
    if (
      conflictoMismoModuloYHorario(
        docenteNum,
        materia,
        asignaciones,
        materiaById
      )
    ) {
      onDocenteSelect(materia.id, docenteNum);
      setAvisos((prev) => ({
        ...prev,
        [materia.id]:
          "Ya asignado en una materia anterior en el mismo horario y módulo (considerando bimodular).",
      }));
      return;
    }
    onDocenteSelect(materia.id, docenteNum);
    setAvisos((prev) => ({ ...prev, [materia.id]: "Candidato IA aplicado." }));
  }

  function limpiarAsignaciones() {
    setAsignaciones({});
    setAvisos({});
    setFiltrosPorMateria({});
  }

  return {
    asignaciones,
    setAsignaciones,
    avisos,
    setAvisos,
    filtrosPorMateria,
    setFiltrosPorMateria,
    prev1,
    prev2,
    getPeriodoDeModulo,
    gestionActualPeriodo,
    MODULO_OPCIONES,
    HORARIO_OPCIONES,
    modulosFiltro,
    setModulosFiltro,
    horariosFiltro,
    setHorariosFiltro,
    materias,
    materiaById,
    materiasFiltradas,
    DOCENTES,
    getFiltros,
    toggleFiltro,
    buildDocenteOptionsParaMateria,
    bloqueadoPorFecha,
    motivoBloqueo,
    conflictoMismoModuloYHorario,
    onDocenteSelect,
    onSugerirIA,
    onAsignarClick,
    onDesasignarClick,
    onAsignarCandidato,
    limpiarAsignaciones,
    loadingHistorial,
    errorHistorial,
    iaLoading,
    iaSugerencias,
    asignando,
  };
}
