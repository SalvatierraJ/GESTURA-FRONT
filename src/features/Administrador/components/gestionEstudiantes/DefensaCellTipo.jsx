import React from "react";
import FechaDefensa from "./modal-fechaDefensa";
import { getUltimaDefensaPorTipo, getDefensaEstado, normalizar } from "@/features/Administrador/utils/gestionEstudiantes/defensas";

export default function DefensaCellTipo({
  tipo,
  defensas = [],
  estudianteId,
  cargarEstudiantes,
  page,
  pageSize,
  onSubmit, 
}) {
  const otraTipo = normalizar(tipo) === normalizar("Examen de grado Interna")
    ? "Examen de grado Externa"
    : "Examen de grado Interna";

  const defensa = getUltimaDefensaPorTipo(defensas, tipo);
  const defensaOtra = getUltimaDefensaPorTipo(defensas, otraTipo);
  const disabled =
    normalizar(tipo) === normalizar("Examen de grado Externa") &&
    getDefensaEstado(defensaOtra) !== "APROBADO";

  const puedeCrearNueva = !defensa || getDefensaEstado(defensa) === "REPROBADO";
  const pendiente = getDefensaEstado(defensa) === "PENDIENTE";
  const asignado = getDefensaEstado(defensa) === "ASIGNADO";
  const aprobado = getDefensaEstado(defensa) === "APROBADO";

  const handleSuccess = () => cargarEstudiantes(page, pageSize);
  const handleSubmit = onSubmit || (() => {});

  if (!defensa || puedeCrearNueva) {
    return (
      <FechaDefensa
        estudianteIds={[estudianteId]}
        tipo={tipo}
        triggerLabel={
          puedeCrearNueva ? `Asignar ${tipo}` : `Nueva ${tipo}`
        }
        triggerIcon="pi pi-calendar-plus"
        onSubmit={handleSubmit}
        disabled={disabled}
        onSuccess={handleSuccess}
      />
    );
  }

  if (asignado || pendiente) {
    return (
      <span className="flex flex-col gap-2">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            asignado ? "text-green-800 bg-green-200" : "text-yellow-800 bg-yellow-200"
          }`}
        >
          {`${tipo}: ${getDefensaEstado(defensa)}`}
        </span>
        {pendiente && (
          <FechaDefensa
            estudianteIds={[estudianteId]}
            tipo={tipo}
            triggerLabel="Editar Fecha"
            triggerIcon="pi pi-calendar-plus"
            onSubmit={handleSubmit}
            disabled={disabled}
            onSuccess={handleSuccess}
          />
        )}
      </span>
    );
  }

  if (aprobado) {
    return (
      <span className="text-xs font-semibold text-green-800 bg-green-200 px-2 py-1 rounded-full">
        {`${tipo}: APROBADA`}
      </span>
    );
  }

  if (getDefensaEstado(defensa) === "REPROBADO") {
    return (
      <FechaDefensa
        estudianteIds={[estudianteId]}
        tipo={tipo}
        triggerLabel="Nueva Defensa"
        triggerIcon="pi pi-calendar-plus"
        onSubmit={handleSubmit}
        disabled={disabled}
        onSuccess={handleSuccess}
      />
    );
  }

  return <span>-</span>;
}
