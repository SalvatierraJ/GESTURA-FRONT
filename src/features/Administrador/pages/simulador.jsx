import React, { useEffect, useMemo, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import { useDocentesStore } from "@/store/docentes.store";

const colorRed = "rgb(185, 28, 28)";
const colorBlack = "#111";
const colorWhite = "#fff";

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
  else { s = 2; y -= 1; }
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

export default function AsignarDocentesMaterias() {
  const [asignaciones, setAsignaciones] = useState({});
  const [avisos, setAvisos] = useState({});
  const [filtrosPorMateria, setFiltrosPorMateria] = useState({}); 
  // estructura: { [materiaId]: { g1:boolean, g2:boolean, mismaSigla:boolean } }

  const { prev1, prev2 } = useMemo(() => lastTwoGestiones(), []);

  const MODULO_OPCIONES = useMemo(
    () => ["M0", "M1", "M2", "M3", "M4", "M5", "M6"].map((m) => ({ label: m, value: m })),
    []
  );
  const [modulosFiltro, setModulosFiltro] = useState([]);

  const {
    cargarHistorialDocenteMaterias,
    materiasHistorial,
    docentesHistorial,
    loadingHistorial,
    errorHistorial,
    sugerirDocenteIAParaMateria,
    iaLoading,
    iaSugerencias,
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
    return (materias || []).filter((m) => materiaPasaFiltroPorModulo(m, modulosFiltro));
  }, [materias, modulosFiltro]);

  const DOCENTES = useMemo(() => {
    return (docentesHistorial || []).map((d) => {
      const p = d?.docente || {};
      const id = parseInt(p.id);
      const nombre = [p.nombres, p.ap_paterno, p.ap_materno].filter(Boolean).join(" ");
      return { id, nombre };
    });
  }, [docentesHistorial]);

  // === filtros por materia ===
  function getFiltros(mId) {
    return filtrosPorMateria[mId] || { g1: false, g2: false, mismaSigla: false };
  }
  function toggleFiltro(mId, key) {
    setFiltrosPorMateria((prev) => {
      const cur = prev[mId] || { g1: false, g2: false, mismaSigla: false };
      return { ...prev, [mId]: { ...cur, [key]: !cur[key] } };
    });
  }

  // aplica filtros (gestiones y/o misma sigla) al listado de docentes del dropdown
  function buildDocenteOptionsParaMateria(materia) {
    const { g1, g2, mismaSigla } = getFiltros(String(materia.id));
    const gestionesSeleccionadas = [
      ...(g1 ? [prev1] : []),
      ...(g2 ? [prev2] : []),
    ];

    // buscamos el registro "completo" del docente (para ver materias/gestiones)
    const mapDoc = new Map();
    (docentesHistorial || []).forEach((d) => {
      if (d?.docente?.id != null) mapDoc.set(String(d.docente.id), d);
    });

    return DOCENTES
      .filter((doc) => {
        const full = mapDoc.get(String(doc.id));
        if (!full) return false;
        const mats = Array.isArray(full.materias) ? full.materias : [];

        // filtro por gestiones (union: si hay checks de g1/g2, debe tener AL MENOS una materia en cualquiera de esas gestiones)
        if (gestionesSeleccionadas.length > 0) {
          const tieneEnVentana = mats.some((m) => m?.gestion && gestionesSeleccionadas.includes(m.gestion));
          if (!tieneEnVentana) return false;
        }

        // filtro por "dio esta materia" (misma sigla)
        if (mismaSigla) {
          const okSigla = mats.some((m) => (m?.sigla || "").toUpperCase().trim() === String(materia.sigla || "").toUpperCase().trim());
          if (!okSigla) return false;
        }

        return true;
      })
      .map((d) => ({ label: d.nombre, value: d.id }));
  }

  // === conflicto (mismo doc + mismo horario + módulos que se cruzan) ===
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

      if (conflictoMismoModuloYHorario(sugerido, materia, asignaciones, materiaById)) {
        onDocenteSelect(materia.id, sugerido);
        setAvisos((prev) => ({
          ...prev,
          [materia.id]: "Ya asignado en una materia anterior en el mismo horario y módulo (considerando bimodular).",
        }));
        return;
      }

      onDocenteSelect(materia.id, sugerido);
      setAvisos((prev) => ({
        ...prev,
        [materia.id]: best?.razon ? `Sugerido por IA: ${best.razon}` : "Sugerido por IA aplicado.",
      }));
    } catch {
      setAvisos((prev) => ({
        ...prev,
        [materia.id]: "Error al consultar la IA.",
      }));
    }
  }

  function onAsignarCandidato(materia, candidatoDocenteId) {
    const docenteNum = Number(candidatoDocenteId);
    if (conflictoMismoModuloYHorario(docenteNum, materia, asignaciones, materiaById)) {
      onDocenteSelect(materia.id, docenteNum);
      setAvisos((prev) => ({
        ...prev,
        [materia.id]: "Ya asignado en una materia anterior en el mismo horario y módulo (considerando bimodular).",
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
      <div className="min-h-screen px-4 py-10 flex flex-col items-center" style={{ background: colorWhite }}>
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
      <div className="min-h-screen px-4 py-10 flex flex-col items-center" style={{ background: colorWhite }}>
        <h2 className="text-xl font-bold text-red-700 mb-2">Error al cargar el historial</h2>
        <p className="text-sm text-gray-600">{String(errorHistorial)}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center" style={{ background: colorWhite }}>
      <div className="mb-8 flex items-center gap-3">
        <span className="block w-2 h-8 bg-red-700 rounded-sm" />
        <h1 className="text-3xl font-black text-black tracking-tight uppercase">Asignar Docentes a Materias</h1>
      </div>

      {/* Filtro por módulo (multi) */}
      <div className="w-full max-w-5xl mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
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
            className="w-80"
            filter
          />
          {modulosFiltro.length > 0 && (
            <Button
              label="Quitar filtro"
              icon="pi pi-times"
              outlined
              onClick={() => setModulosFiltro([])}
              style={{ borderColor: colorRed, color: colorRed }}
            />
          )}
        </div>
      </div>

      <Tooltip target=".btn-ia" content="Pedir sugerencia de asignación con IA" position="top" />

      <div className="w-full max-w-5xl">
        {materiasFiltradas.length === 0 ? (
          <Card className="border border-dashed">
            <div className="text-center text-gray-600">No hay materias para mostrar con el filtro actual.</div>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            {materiasFiltradas.map((materia) => {
              const aviso = avisos?.[materia.id];
              const sugPack = iaSugerencias?.[String(materia.id)];
              const best = sugPack?.best || null;
              const candidatos = Array.isArray(sugPack?.candidatos) ? sugPack.candidatos : [];

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
                        <span className="text-sm text-gray-500 font-normal">({materia.sigla})</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="px-2 py-1 rounded-full bg-gray-100">
                          <b>Horario:</b>{" "}
                          <span style={{ color: colorRed, fontWeight: 700 }}>{materia.horario}</span>
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100">
                          <b>Módulo:</b> <span>{materia.modulo}</span>
                        </span>
                        {esBimodular(materia) && (
                          <span className="px-2 py-1 rounded-full" style={{ background: "#fee2e2", color: colorRed, fontWeight: 700 }}>
                            Bimodular
                          </span>
                        )}
                      </div>
                    </div>
                  }
                >
                  {/* Selector + filtros (3 checkboxes) + botón IA */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                      <div className="text-sm text-gray-600">Selecciona un docente para esta materia.</div>

                      <div className="flex items-center gap-3">
                        <Dropdown
                          value={docenteSeleccionadoId ?? null}
                          options={opcionesDocentes}
                          onChange={(e) => onDocenteSelect(materia.id, e.value)}
                          placeholder="Seleccione docente"
                          className="w-80 border-2 border-red-700 font-semibold"
                          filter
                          showClear
                          style={{ background: colorWhite, color: colorBlack, borderRadius: "0.75rem" }}
                          pt={{ panel: { style: { borderRadius: "0.75rem" } } }}
                        />

                        <Button
                          label={iaLoading ? "Consultando..." : "Sugerir IA"}
                          icon={iaLoading ? "pi pi-spinner pi-spin" : "pi pi-sparkles"}
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
                          onChange={() => toggleFiltro(String(materia.id), "g1")}
                        />
                        <span>Solo docentes con materias en {prev1}</span>
                      </label>

                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!filtros.g2}
                          onChange={() => toggleFiltro(String(materia.id), "g2")}
                        />
                        <span>Solo docentes con materias en {prev2}</span>
                      </label>

                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!filtros.mismaSigla}
                          onChange={() => toggleFiltro(String(materia.id), "mismaSigla")}
                        />
                        <span>Solo quienes ya dictaron {materia.sigla}</span>
                      </label>
                    </div>
                  </div>

                  {/* Resultado aplicado */}
                  {docenteSeleccionadoId && (
                    <div className={`mt-3 text-xs font-bold ${hayConflictoSeleccion ? "text-red-700" : "text-green-700"}`}>
                      Docente asignado:{" "}
                      <span className="text-black">
                        {DOCENTES.find((d) => d.id === docenteSeleccionadoId)?.nombre}
                      </span>
                      {!!best?.docente_id && Number(best.docente_id) === docenteSeleccionadoId && (
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
                        <span className="font-bold text-black">Candidatos IA</span>
                        <Tag value={`Top ${candidatos.length}`} severity="danger" rounded />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {candidatos.map((c, idx) => {
                          const isBest = best?.docente_id && String(best.docente_id) === String(c.docente_id);
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
                              style={{ borderColor: isBest ? colorRed : "#e5e7eb" }}
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
                                  <b>Veces dictada:</b> {c.vecesDictada ?? 0} · <b>Última gestión:</b>{" "}
                                  {c.gestionReciente ?? "—"} · <b>Score:</b> {c.score ?? 0}
                                </div>
                              </div>
                              <div className="ml-3">
                                <Button
                                  label="Asignar"
                                  size="small"
                                  onClick={() => onAsignarCandidato(materia, c.docente_id)}
                                  className="p-button-sm"
                                  disabled={conflicto}
                                  style={{
                                    background: conflicto ? "#e5e7eb" : colorRed,
                                    border: "none",
                                    color: conflicto ? "#9ca3af" : colorWhite,
                                    cursor: conflicto ? "not-allowed" : "pointer",
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
                        aviso.includes("Ya asignado") ? "text-red-700" : "text-blue-700"
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
        <div className="flex justify-end">
          <Button
            label="Limpiar asignaciones"
            icon="pi pi-times"
            className="mt-8 px-8 py-3 font-bold"
            style={{ background: colorRed, color: colorWhite, border: "none", borderRadius: "1rem" }}
            onClick={limpiarAsignaciones}
            severity="danger"
          />
        </div>
      </div>
    </div>
  );
}
