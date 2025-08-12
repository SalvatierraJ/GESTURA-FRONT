import React, { useEffect, useMemo, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import { useDocentesStore } from "@/store/docentes.store";
import { usePeriodoStore } from "@/store/periodoModulo.store";

const colorRed = "rgb(185, 28, 28)";
const colorBlack = "#111";
const colorWhite = "#fff";
const HORARIOS_FIJOS = [
  { label: "07:15-10:00", turno: "MAÑANA", extra: "" },
  { label: "10:15-13:00", turno: "MAÑANA", extra: "" },
  { label: "13:15-16:00", turno: "TARDE", extra: "" },
  { label: "15:00-19:00", turno: "TARDE", extra: "SEMI-PRESENCIAL" },
  { label: "16:15-19:00", turno: "TARDE", extra: "" },
  { label: "19:30-21:30", turno: "NOCHE", extra: "SEMI-PRESENCIAL" },
  { label: "19:15-21:45", turno: "NOCHE", extra: "" },
];

// ===== util horario =====
function mismoHorario(h1, h2) {
  if (!h1 || !h2) return false;
  return String(h1).trim() === String(h2).trim();
}

// ===== util gestiones dinámicas =====
function currentGestion(d = new Date()) {
  const year = d.getFullYear();
  const month = d.getMonth(); // 0..11
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

// ===== módulos / bimodular =====
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

export default function AsignarDocentesMaterias() {
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
    return (materias || []).filter(
      (m) =>
        materiaPasaFiltroPorModulo(m, modulosFiltro) &&
        materiaPasaFiltroPorHorario(m, horariosFiltro)
    );
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

  if (loadingHistorial) {
    return (
      <div
        className="min-h-screen px-4 py-10 flex flex-col items-center"
        style={{ background: colorWhite }}
      >
        <div className="mb-6 animate-pulse w-full max-w-4xl">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  if (errorHistorial) {
    return (
      <div
        className="min-h-screen px-4 py-10 flex flex-col items-center"
        style={{ background: colorWhite }}
      >
        <h2 className="text-xl font-bold text-red-700 mb-2">
          Error al cargar el historial
        </h2>
        <p className="text-sm text-gray-600">{String(errorHistorial)}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-10 flex flex-col items-center"
      style={{ background: colorWhite }}
    >
      <div className="mb-8 flex items-center gap-3">
        <span className="block w-2 h-8 bg-red-700 rounded-sm" />
        <h1 className="text-3xl font-black text-black tracking-tight uppercase">
          Asignar Docentes a Materias
        </h1>
      </div>

      {/* Filtro por módulo (multi) */}
      {/* Barra de filtros */}
      <div className="w-full max-w-5xl mb-4 grid gap-3 sm:grid-cols-2">
        {/* Filtro por módulo */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="block w-1 h-6 bg-red-700 rounded-sm" />
            <span className="font-bold text-black">Filtrar por módulo</span>
          </div>
          <div className="flex items-center gap-3">
            <MultiSelect
              value={modulosFiltro}
              options={MODULO_OPCIONES}
              onChange={(e) => setModulosFiltro(e.value || [])}
              placeholder="Selecciona módulos (M0–M6)"
              display="chip"
              className="w-64"
              filter
            />
            {!!modulosFiltro.length && (
              <Button
                label="Quitar"
                icon="pi pi-times"
                outlined
                onClick={() => setModulosFiltro([])}
                style={{ borderColor: colorRed, color: colorRed }}
              />
            )}
          </div>
        </div>

        {/* NUEVO: Filtro por horario */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="block w-1 h-6 bg-red-700 rounded-sm" />
            <span className="font-bold text-black">Filtrar por horario</span>
          </div>
          <div className="flex items-center gap-3">
            <MultiSelect
              value={horariosFiltro}
              options={HORARIO_OPCIONES}
              onChange={(e) => setHorariosFiltro(e.value || [])}
              placeholder="Selecciona horario(s)"
              display="chip"
              className="w-64"
              filter
            />
            {!!horariosFiltro.length && (
              <Button
                label="Quitar"
                icon="pi pi-times"
                outlined
                onClick={() => setHorariosFiltro([])}
                style={{ borderColor: colorRed, color: colorRed }}
              />
            )}
          </div>
        </div>
      </div>

      <Tooltip
        target=".btn-ia"
        content="Pedir sugerencia de asignación con IA"
        position="top"
      />

      <div className="w-full max-w-5xl">
        {materiasFiltradas.length === 0 ? (
          <Card className="border border-dashed">
            <div className="text-center text-gray-600">
              No hay materias para mostrar con el filtro actual.
            </div>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            {materiasFiltradas.map((materia) => {
              const aviso = avisos?.[materia.id];
              const sugPack = iaSugerencias?.[String(materia.id)];
              const best = sugPack?.best || null;
              const candidatos = Array.isArray(sugPack?.candidatos)
                ? sugPack.candidatos
                : [];
              const locked = bloqueadoPorFecha(materia);
              const isBi = esBimodularCard(materia);

              const docenteSeleccionadoId = asignaciones[materia.id];
              const hayConflictoSeleccion =
                asignaciones[materia.id] != null &&
                conflictoMismoModuloYHorario(
                  Number(asignaciones[materia.id]),
                  materia,
                  asignaciones,
                  materiaById
                );

              const filtros = getFiltros(String(materia.id));
              const opcionesDocentes = buildDocenteOptionsParaMateria(materia);

              return (
                <Card
                  key={materia.id}
                  className="shadow-sm border hover:shadow-md transition-shadow border-l-8"
                  style={{
                    borderColor: hayConflictoSeleccion ? colorRed : "#e5e7eb",
                    background: colorWhite,
                    color: colorBlack,
                  }}
                  title={
                    <div className="flex items-center justify-between">
                      <div className="font-bold">
                        {materia.nombre}{" "}
                        <span className="text-sm text-gray-500 font-normal">
                          ({materia.sigla})
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <span className="px-2 py-1 rounded-full bg-gray-100">
                          <b>Horario:</b>{" "}
                          <span style={{ color: colorRed, fontWeight: 700 }}>
                            {materia.horario}
                          </span>
                        </span>

                        <span className="px-2 py-1 rounded-full bg-gray-100">
                          <b>Módulo:</b> <span>{materia.modulo}</span>
                        </span>

                        {esBimodular(materia) && (
                          <span
                            className="px-2 py-1 rounded-full"
                            style={{
                              background: "#fee2e2",
                              color: colorRed,
                              fontWeight: 700,
                            }}
                          >
                            Bimodular
                          </span>
                        )}

                        {bloqueadoPorFecha(materia) && (
                          <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 font-semibold flex items-center gap-1">
                            <i className="pi pi-lock" />
                            {motivoBloqueo(materia)}
                          </span>
                        )}
                      </div>
                    </div>
                  }
                >
                  {/* Selector + filtros + IA + ASIGNAR/DESASIGNAR */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                      <div className="text-sm text-gray-600">
                        Selecciona un docente para esta materia.
                      </div>

                      <div className="flex items-center gap-3">
                        {/** selección local (pendiente) */}
                        <Dropdown
                          value={asignaciones[materia.id] ?? null}
                          options={opcionesDocentes}
                          onChange={(e) => onDocenteSelect(materia.id, e.value)}
                          placeholder={
                            locked
                              ? "Bloqueado por fecha"
                              : "Seleccione docente"
                          }
                          disabled={locked} // ⬅️ nuevo
                          className="w-64 border-2 border-red-700 font-semibold"
                          filter
                          showClear
                          style={{
                            background: locked ? "#f3f4f6" : colorWhite,
                            color: colorBlack,
                            borderRadius: "0.75rem",
                            opacity: locked ? 0.7 : 1,
                            cursor: locked ? "not-allowed" : "pointer",
                          }}
                        />

                        {/** ASIGNAR (guardar en backend) */}
                        {!materia.id_docente && !locked && (
                          <Button
                            label="Asignar"
                            icon="pi pi-check"
                            onClick={() => onAsignarClick(materia)}
                            disabled={
                              !!asignando[String(materia.id)] ||
                              !asignaciones[materia.id]
                            }
                            className="p-button-sm"
                            style={{
                              background: colorRed,
                              border: "none",
                              color: colorWhite,
                              borderRadius: "999px",
                              fontWeight: 800,
                            }}
                          />
                        )}

                        {/** Sugerir IA (lo que ya tenías) */}
                        <Button
                          label={iaLoading ? "Consultando..." : "Sugerir IA"}
                          icon={
                            iaLoading
                              ? "pi pi-spinner pi-spin"
                              : "pi pi-sparkles"
                          }
                          onClick={() => onSugerirIA(materia)}
                          disabled={iaLoading}
                          className="btn-ia"
                          style={{
                            borderRadius: "999px",
                            padding: "0.6rem 1rem",
                            border: `2px solid ${colorRed}`,
                            color: colorRed,
                            background: "transparent",
                            fontWeight: 800,
                            transition: "all .2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = colorRed;
                            e.currentTarget.style.color = colorWhite;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = colorRed;
                          }}
                        />
                      </div>
                    </div>
                    {/* 3 checkboxes por materia */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!filtros.g1}
                          onChange={() =>
                            toggleFiltro(String(materia.id), "g1")
                          }
                        />
                        <span>Solo docentes con materias en {prev1}</span>
                      </label>

                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!filtros.g2}
                          onChange={() =>
                            toggleFiltro(String(materia.id), "g2")
                          }
                        />
                        <span>Solo docentes con materias en {prev2}</span>
                      </label>

                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!filtros.mismaSigla}
                          onChange={() =>
                            toggleFiltro(String(materia.id), "mismaSigla")
                          }
                        />
                        <span>Solo quienes ya dictaron {materia.sigla}</span>
                      </label>
                    </div>

                    {/** Estado actual persistido */}
                    {(() => {
                      const docenteAsignadoId = materia.id_docente
                        ? Number(materia.id_docente)
                        : null;
                      const loadingEsta = !!asignando[String(materia.id)];
                      if (!docenteAsignadoId) return null;
                      const nombreAsignado =
                        DOCENTES.find((d) => d.id === docenteAsignadoId)
                          ?.nombre || `#${docenteAsignadoId}`;

                      return (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            <i className="pi pi-check-circle" />
                            Asignado:{" "}
                            <b className="text-black">{nombreAsignado}</b>
                          </span>
                          <Button
                            icon="pi pi-times"
                            tooltip={
                              locked ? "Bloqueado por fecha" : "Desasignar"
                            }
                            tooltipOptions={{ position: "top" }}
                            onClick={() => onDesasignarClick(materia)}
                            disabled={locked || !!asignando[String(materia.id)]}
                            className="p-button-rounded p-button-text p-button-danger p-button-sm"
                            style={{
                              color: locked ? "#9ca3af" : colorRed,
                              cursor: locked ? "not-allowed" : "pointer",
                            }}
                          />
                        </div>
                      );
                    })()}
                  </div>

                  {/* Resultado aplicado */}
                  {docenteSeleccionadoId && (
                    <div
                      className={`mt-3 text-xs font-bold ${
                        hayConflictoSeleccion
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      Docente asignado:{" "}
                      <span className="text-black">
                        {
                          DOCENTES.find((d) => d.id === docenteSeleccionadoId)
                            ?.nombre
                        }
                      </span>
                      {!!best?.docente_id &&
                        Number(best.docente_id) === docenteSeleccionadoId && (
                          <span className="ml-2 inline-block px-2 py-0.5 text-green-800 bg-green-100 rounded-full">
                            Sugerido IA
                          </span>
                        )}
                      {hayConflictoSeleccion && (
                        <span className="ml-2 inline-block px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                          Ya asignado antes en el mismo horario y módulo
                        </span>
                      )}
                    </div>
                  )}

                  {/* Candidatos IA */}
                  {Array.isArray(candidatos) && candidatos.length > 0 && (
                    <div className="mt-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-black">
                          Candidatos IA
                        </span>
                        <Tag
                          value={`Top ${candidatos.length}`}
                          severity="danger"
                          rounded
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {candidatos.map((c, idx) => {
                          const isBest =
                            best?.docente_id &&
                            String(best.docente_id) === String(c.docente_id);
                          const conflicto = conflictoMismoModuloYHorario(
                            Number(c.docente_id),
                            materia,
                            asignaciones,
                            materiaById
                          );

                          return (
                            <div
                              key={`${materia.id}-${c.docente_id}-${idx}`}
                              className="flex items-center justify-between rounded-lg border p-3 bg-white"
                              style={{
                                borderColor: isBest ? colorRed : "#e5e7eb",
                              }}
                            >
                              <div className="flex-1">
                                <div className="font-semibold text-black flex items-center gap-2">
                                  {c.nombre}
                                  {isBest && (
                                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                                      Mejor sugerencia
                                    </span>
                                  )}
                                  {conflicto && (
                                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                                      Conflicto mismo horario/módulo
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  <b>Veces dictada:</b> {c.vecesDictada ?? 0} ·{" "}
                                  <b>Última gestión:</b>{" "}
                                  {c.gestionReciente ?? "—"} · <b>Score:</b>{" "}
                                  {c.score ?? 0}
                                </div>
                              </div>
                              <div className="ml-3">
                                <Button
                                  label="Asignar"
                                  size="small"
                                  onClick={() =>
                                    onAsignarCandidato(materia, c.docente_id)
                                  }
                                  className="p-button-sm"
                                  disabled={conflicto}
                                  style={{
                                    background: conflicto
                                      ? "#e5e7eb"
                                      : colorRed,
                                    border: "none",
                                    color: conflicto ? "#9ca3af" : colorWhite,
                                    cursor: conflicto
                                      ? "not-allowed"
                                      : "pointer",
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {aviso && (
                    <div
                      className={`mt-3 text-xs font-semibold ${
                        aviso.includes("Ya asignado")
                          ? "text-red-700"
                          : "text-blue-700"
                      }`}
                    >
                      {aviso}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
