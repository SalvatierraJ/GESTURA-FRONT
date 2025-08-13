export const normalizar = (str) =>
  (str || "").toLowerCase().replace(/\s+/g, " ").trim();

export const getUltimaDefensaPorTipo = (defensas, tipo) =>
  [...(defensas || [])]
    .filter(
      (d) =>
        d?.nombre_tipo_defensa &&
        normalizar(d.nombre_tipo_defensa) === normalizar(tipo)
    )
    .sort((a, b) => new Date(b.fecha_defensa) - new Date(a.fecha_defensa))[0] ||
  null;

export const getDefensaEstado = (defensa) => defensa?.estado || "SIN_ASIGNAR";
