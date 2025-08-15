// DefensaCellTipo.tsx
import React, { useMemo } from "react";
import FechaDefensa from "./modal-fechaDefensa";
import {
  getUltimaDefensaPorTipo,
  getDefensaEstado,
  normalizar,
} from "@/features/Administrador/utils/gestionEstudiantes/defensas";
import { useDefensasStore } from "@/store/defensas.store";

function toDatetimeLocalValue(dateLike) {
  if (!dateLike) return "";
  const d = new Date(dateLike);
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}

export default function DefensaCellTipo({
  tipo,
  defensas = [],
  estudianteId,
  cargarEstudiantes,
  page,
  pageSize,
  onSubmit,
}) {
  const { refreshAllDefensas } = useDefensasStore();
  const otraTipo =
    normalizar(tipo) === normalizar("Examen de grado Interna")
      ? "Examen de grado Externa"
      : "Examen de grado Interna";

  const defensa = useMemo(
    () => getUltimaDefensaPorTipo(defensas, tipo),
    [defensas, tipo]
  );
  const defensaOtra = useMemo(
    () => getUltimaDefensaPorTipo(defensas, otraTipo),
    [defensas, otraTipo]
  );

  const disabled =
    normalizar(tipo) === normalizar("Examen de grado Externa") &&
    getDefensaEstado(defensaOtra) !== "APROBADO";

  const estado = getDefensaEstado(defensa);
  const puedeCrearNueva = !defensa || estado === "REPROBADO";
  const pendiente = estado === "PENDIENTE";
  const asignado = estado === "ASIGNADO";
  const aprobado = estado === "APROBADO";

  const initialFechaHora = toDatetimeLocalValue(
    defensa?.fecha_defensa || defensa?.fecha
  );
  const areaAsignada = Boolean(defensa?.id_area ?? defensa?.area);
  const casoAsignado = Boolean(defensa?.id_casoEstudio ?? defensa?.caso);

  const handleSuccess = async () => {
    await Promise.all([
      cargarEstudiantes(page, pageSize),
      refreshAllDefensas(),
    ]);
  };
  const handleSubmit = onSubmit || (() => {});

  const commonModalProps = {
    estudianteIds: [estudianteId],
    tipo,
    onSubmit: handleSubmit,
    onSuccess: handleSuccess,
    disabled,
    initialFechaHora,
    areaAsignada,
    casoAsignado,
  };

  if (!defensa || puedeCrearNueva) {
    return (
      <FechaDefensa
        {...commonModalProps}
        triggerLabel={puedeCrearNueva ? `Asignar ${tipo}` : `Nueva ${tipo}`}
        triggerIcon="pi pi-calendar-plus"
      />
    );
  }

  if (asignado || pendiente) {
    return (
      <span className="flex flex-col gap-2">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            asignado
              ? "text-green-800 bg-green-200"
              : "text-yellow-800 bg-yellow-200"
          }`}
        >
          {`${tipo}: ${estado}`}
        </span>
        {pendiente && (
          <FechaDefensa
            {...commonModalProps}
            triggerLabel="Editar Fecha"
            triggerIcon="pi pi-calendar-plus"
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

  if (estado === "REPROBADO") {
    return (
      <FechaDefensa
        {...commonModalProps}
        triggerLabel="Nueva Defensa"
        triggerIcon="pi pi-calendar-plus"
      />
    );
  }

  return <span>-</span>;
}
