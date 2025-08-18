import { FixedSizeList as List } from "react-window";
import React from "react";
import { Tooltip } from "primereact/tooltip";
import { useAsignacionMateriaDocente } from "../hooks/gestionDocente/useAsignacionMateriaDocente";
import { SimuladorFiltros } from "../components/gestionDocente/AsignacionMateriaFiltros";
import { SimuladorMateriaCard } from "../components/gestionDocente/AsignacionMateriaCard";

const colorRed = "rgb(185, 28, 28)";
const colorBlack = "#111";
const colorWhite = "#fff";


export default function AsignarDocentesMaterias() {
  const {
    asignaciones,
    avisos,
    filtrosPorMateria,
    prev1,
    prev2,
    MODULO_OPCIONES,
    HORARIO_OPCIONES,
    modulosFiltro,
    setModulosFiltro,
    horariosFiltro,
    setHorariosFiltro,
    materiasFiltradas,
    materiaById,
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
    loadingHistorial,
    errorHistorial,
    iaLoading,
    iaSugerencias,
    asignando,
  } = useAsignacionMateriaDocente();

  if (loadingHistorial) {
    return (
      <div className=" px-4 py-10 flex flex-col items-center" style={{ background: colorWhite }}>
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
    <div className=" px-4 py-10 flex flex-col items-center" style={{ background: colorWhite }}>
      <div className="mb-8 flex items-center gap-3">
        <span className="block w-2 h-8 bg-red-700 rounded-sm" />
        <h1 className="text-3xl font-black text-black tracking-tight uppercase">Asignar Docentes a Materias</h1>
      </div>

      <SimuladorFiltros
        modulosFiltro={modulosFiltro}
        setModulosFiltro={setModulosFiltro}
        MODULO_OPCIONES={MODULO_OPCIONES}
        horariosFiltro={horariosFiltro}
        setHorariosFiltro={setHorariosFiltro}
        HORARIO_OPCIONES={HORARIO_OPCIONES}
        colorRed={colorRed}
      />

      <Tooltip target=".btn-ia" content="Pedir sugerencia de asignación con IA" position="top" />

      <div className="w-full max-w-5xl">
        {materiasFiltradas.length === 0 ? (
          <div className="border border-dashed p-4 text-center text-gray-600">No hay materias para mostrar con el filtro actual.</div>
        ) : (
          <List
            key={`${modulosFiltro.join(',')}-${horariosFiltro.join(',')}`}
            height={600}
            itemCount={materiasFiltradas.length}
            itemSize={180}
            width={"100%"}
          >
            {({ index, style }) => {
              const materia = materiasFiltradas[index];
              const aviso = avisos?.[materia.id];
              const sugPack = iaSugerencias?.[String(materia.id)];
              const best = sugPack?.best || null;
              const candidatos = Array.isArray(sugPack?.candidatos) ? sugPack.candidatos : [];
              const locked = bloqueadoPorFecha(materia);
              const isBi = materia?.biModular ?? materia?.BiModular ?? materia?.bimodular;
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
                <div style={{ ...style, padding: "0 0 2px 0" }} key={materia.id}>
                  <SimuladorMateriaCard
                    materia={materia}
                    aviso={aviso}
                    sugPack={sugPack}
                    best={best}
                    candidatos={candidatos}
                    locked={locked}
                    isBi={isBi}
                    docenteSeleccionadoId={docenteSeleccionadoId}
                    hayConflictoSeleccion={hayConflictoSeleccion}
                    filtros={filtros}
                    opcionesDocentes={opcionesDocentes}
                    prev1={prev1}
                    prev2={prev2}
                    DOCENTES={DOCENTES}
                    onDocenteSelect={onDocenteSelect}
                    onAsignarClick={onAsignarClick}
                    onSugerirIA={onSugerirIA}
                    toggleFiltro={toggleFiltro}
                    bloqueadoPorFecha={bloqueadoPorFecha}
                    motivoBloqueo={motivoBloqueo}
                    esBimodular={isBi}
                    conflictoMismoModuloYHorario={conflictoMismoModuloYHorario}
                    asignaciones={asignaciones}
                    materiaById={materiaById}
                    onDesasignarClick={onDesasignarClick}
                    onAsignarCandidato={onAsignarCandidato}
                    iaLoading={iaLoading}
                    asignando={asignando}
                    colorRed={colorRed}
                    colorBlack={colorBlack}
                    colorWhite={colorWhite}
                  />
                </div>
              );
            }}
          </List>
        )}
      </div>
    </div>
  );
}
