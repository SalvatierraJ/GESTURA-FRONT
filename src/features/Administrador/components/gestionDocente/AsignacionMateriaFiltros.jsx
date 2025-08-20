import React from "react";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";

export function SimuladorFiltros({
  modulosFiltro,
  setModulosFiltro,
  MODULO_OPCIONES,
  horariosFiltro,
  setHorariosFiltro,
  HORARIO_OPCIONES,
  colorRed,
}) {
  return (
    <div className="w-full max-w-5xl mb-4 grid gap-3 sm:grid-cols-2">
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
  );
}
