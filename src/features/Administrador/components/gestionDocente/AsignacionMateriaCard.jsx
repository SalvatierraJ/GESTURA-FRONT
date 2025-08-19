import React from "react";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export function SimuladorMateriaCard({
  materia,
  aviso,
  sugPack,
  best,
  candidatos,
  locked,
  isBi,
  docenteSeleccionadoId,
  hayConflictoSeleccion,
  filtros,
  buildDocenteOptionsParaMateria,
  prev1,
  prev2,
  DOCENTES,
  onDocenteSelect,
  onAsignarClick,
  onSugerirIA,
  toggleFiltro,
  bloqueadoPorFecha,
  motivoBloqueo,
  esBimodular,
  conflictoMismoModuloYHorario,
  asignaciones,
  materiaById,
  onDesasignarClick,
  onAsignarCandidato,
  iaLoading,
  asignando,
  colorRed,
  colorBlack,
  colorWhite,
}) {
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
            {materia.nombre} <span className="text-sm text-gray-500 font-normal">({materia.sigla})</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="px-2 py-1 rounded-full bg-gray-100">
              <b>Horario:</b> <span style={{ color: colorRed, fontWeight: 700 }}>{materia.horario}</span>
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100">
              <b>Módulo:</b> <span>{materia.modulo}</span>
            </span>
            {isBi && (
              <span className="px-2 py-1 rounded-full" style={{ background: "#fee2e2", color: colorRed, fontWeight: 700 }}>
                Bimodular
              </span>
            )}
            {locked && (
              <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 font-semibold flex items-center gap-1">
                <i className="pi pi-lock" />
                {motivoBloqueo(materia)}
              </span>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="text-sm text-gray-600">Selecciona un docente para esta materia.</div>
          <div className="flex items-center gap-3">
            <Dropdown
              value={docenteSeleccionadoId ?? null}
              options={opcionesDocentes}
              onChange={(e) => onDocenteSelect(materia.id, e.value)}
              placeholder={locked ? "Bloqueado por fecha" : "Seleccione docente"}
              disabled={locked}
              className="w-64 border-2 border-red-700 font-semibold"
              filter
              showClear
              style={{ background: locked ? "#f3f4f6" : colorWhite, color: colorBlack, borderRadius: "0.75rem", opacity: locked ? 0.7 : 1, cursor: locked ? "not-allowed" : "pointer" }}
            />
            {!materia.id_docente && !locked && (
              <Button
                label="Asignar"
                icon="pi pi-check"
                onClick={() => onAsignarClick(materia)}
                disabled={!!asignando[String(materia.id)] || !docenteSeleccionadoId}
                className="p-button-sm"
                style={{ background: colorRed, border: "none", color: colorWhite, borderRadius: "999px", fontWeight: 800 }}
              />
            )}
            <Button
              label={iaLoading ? "Consultando..." : "Sugerir IA"}
              icon={iaLoading ? "pi pi-spinner pi-spin" : "pi pi-sparkles"}
              onClick={() => onSugerirIA(materia)}
              disabled={iaLoading}
              className="btn-ia"
              style={{ borderRadius: "999px", padding: "0.6rem 1rem", border: `2px solid ${colorRed}`, color: colorRed, background: "transparent", fontWeight: 800, transition: "all .2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = colorRed; e.currentTarget.style.color = colorWhite; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = colorRed; }}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!filtros.g1} onChange={() => toggleFiltro(String(materia.id), "g1")} />
            <span>Solo docentes con materias en {prev1}</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!filtros.g2} onChange={() => toggleFiltro(String(materia.id), "g2")} />
            <span>Solo docentes con materias en {prev2}</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!filtros.mismaSigla} onChange={() => toggleFiltro(String(materia.id), "mismaSigla")} />
            <span>Solo quienes ya dictaron {materia.sigla}</span>
          </label>
        </div>
        {(() => {
          const docenteAsignadoId = materia.id_docente ? Number(materia.id_docente) : null;
          const loadingEsta = !!asignando[String(materia.id)];
          if (!docenteAsignadoId) return null;
          const nombreAsignado = DOCENTES.find((d) => d.id === docenteAsignadoId)?.nombre || `#${docenteAsignadoId}`;
          return (
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                <i className="pi pi-check-circle" />
                Asignado: <b className="text-black">{nombreAsignado}</b>
              </span>
              <Button
                icon="pi pi-times"
                tooltip={locked ? "Bloqueado por fecha" : "Desasignar"}
                tooltipOptions={{ position: "top" }}
                onClick={() => onDesasignarClick(materia)}
                disabled={locked || !!asignando[String(materia.id)]}
                className="p-button-rounded p-button-text p-button-danger p-button-sm"
                style={{ color: locked ? "#9ca3af" : colorRed, cursor: locked ? "not-allowed" : "pointer" }}
              />
            </div>
          );
        })()}
      </div>
      {docenteSeleccionadoId && (
        <div className={`mt-3 text-xs font-bold ${hayConflictoSeleccion ? "text-red-700" : "text-green-700"}`}>
          Docente asignado: <span className="text-black">{DOCENTES.find((d) => d.id === docenteSeleccionadoId)?.nombre}</span>
          {!!best?.docente_id && Number(best.docente_id) === docenteSeleccionadoId && (
            <span className="ml-2 inline-block px-2 py-0.5 text-green-800 bg-green-100 rounded-full">Sugerido IA</span>
          )}
          {hayConflictoSeleccion && (
            <span className="ml-2 inline-block px-2 py-0.5 bg-red-100 text-red-800 rounded-full">Ya asignado antes en el mismo horario y módulo</span>
          )}
        </div>
      )}
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
                <div key={`${materia.id}-${c.docente_id}-${idx}`} className="flex items-center justify-between rounded-lg border p-3 bg-white" style={{ borderColor: isBest ? colorRed : "#e5e7eb" }}>
                  <div className="flex-1">
                    <div className="font-semibold text-black flex items-center gap-2">
                      {c.nombre}
                      {isBest && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">Mejor sugerencia</span>
                      )}
                      {conflicto && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">Conflicto mismo horario/módulo</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      <b>Veces dictada:</b> {c.vecesDictada ?? 0} · <b>Última gestión:</b> {c.gestionReciente ?? "—"} · <b>Score:</b> {c.score ?? 0}
                    </div>
                  </div>
                  <div className="ml-3">
                    <Button
                      label="Asignar"
                      size="small"
                      onClick={() => onAsignarCandidato(materia, c.docente_id)}
                      className="p-button-sm"
                      disabled={conflicto}
                      style={{ background: conflicto ? "#e5e7eb" : colorRed, border: "none", color: conflicto ? "#9ca3af" : colorWhite, cursor: conflicto ? "not-allowed" : "pointer" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {aviso && (
        <div className={`mt-3 text-xs font-semibold ${aviso.includes("Ya asignado") ? "text-red-700" : "text-blue-700"}`}>{aviso}</div>
      )}
    </Card>
  );
}
