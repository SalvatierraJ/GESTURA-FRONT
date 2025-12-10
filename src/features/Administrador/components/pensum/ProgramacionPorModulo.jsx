import { useEffect, useState, useMemo, useCallback } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import useProgramacionModulo from "@/features/Administrador/hooks/pensum/useProgramacionModulo";
import * as XLSX from "xlsx";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

const HORARIOS_FIJOS = [
  { label: "07:15-10:00", turno: "MAÑANA" },
  { label: "10:15-13:00", turno: "MAÑANA" },
  { label: "13:15-16:00", turno: "TARDE" },
  { label: "15:00-19:00", turno: "TARDE", extra: "SEMI-PRESENCIAL" },
  { label: "16:15-19:00", turno: "TARDE" },
  { label: "19:30-21:30", turno: "NOCHE", extra: "SEMI-PRESENCIAL" },
  { label: "19:15-21:45", turno: "NOCHE" },
];

export default function ProgramacionPorModulo({ options: optionsProp, MODULOS }) {
  const {
    loading,
    data,
    selectedCarrera,
    setSelectedCarrera,
    gestion,
    setGestion,
    modulosMaximos,
    setModulosMaximos,
    moduloActual,
    cambiarModulo,
    grupos,
    cargarDatos,
    crearGrupo,
    eliminarGrupo,
    editarGrupo,
    getGruposMateria,
    getEstudiantesDisponibles,
    getAsignacionEstudiante,
    estadisticasProgramacion,
    generarDatosExcel,
    options: optionsHook,
    fetchCarrerasConPensum,
  } = useProgramacionModulo();

  const options = optionsProp || optionsHook;
  const [materiaExpandida, setMateriaExpandida] = useState(null);
  const [filtroMateria, setFiltroMateria] = useState("");
  const [modalCrearGrupo, setModalCrearGrupo] = useState({
    visible: false,
    materiaId: null,
    materiaNombre: null,
    horarioSeleccionado: null,
    estudiantesSeleccionados: [],
    horariosSeleccionados: [], // Para selección por horarios
    modo: "crear", // "crear" o "editar"
    grupoId: null, // ID del grupo si está editando
    limiteMaximo: null, // Límite máximo de estudiantes
  });

  useEffect(() => {
    fetchCarrerasConPensum();
  }, [fetchCarrerasConPensum]);

  // Generar módulos dinámicamente
  const modulosDisponibles = useMemo(() => {
    const maxModulo = Math.max(...MODULOS, modulosMaximos - 1);
    return Array.from({ length: maxModulo + 1 }, (_, i) => i);
  }, [MODULOS, modulosMaximos]);

  // Filtrar materias
  const materiasFiltradas = useMemo(() => {
    if (!data?.resumen_demanda) return [];
    if (!filtroMateria) return data.resumen_demanda;
    const filtro = filtroMateria.toLowerCase();
    return data.resumen_demanda.filter(
      (m) =>
        m.nombre?.toLowerCase().includes(filtro) ||
        m.sigla?.toLowerCase().includes(filtro)
    );
  }, [data, filtroMateria]);

  // Abrir modal para crear grupo
  const abrirModalCrearGrupo = (materiaId, materiaNombre) => {
    setModalCrearGrupo({
      visible: true,
      materiaId,
      materiaNombre,
      horarioSeleccionado: null,
      estudiantesSeleccionados: [],
      horariosSeleccionados: [],
      modo: "crear",
      grupoId: null,
      limiteMaximo: null,
    });
  };

  // Abrir modal para editar grupo
  const abrirModalEditarGrupo = (materiaId, materiaNombre, grupo) => {
    setModalCrearGrupo({
      visible: true,
      materiaId,
      materiaNombre,
      horarioSeleccionado: grupo.horario,
      estudiantesSeleccionados: grupo.estudiantes?.map((e) => e.id_estudiante.toString()) || [],
      horariosSeleccionados: [],
      modo: "editar",
      grupoId: grupo.id,
      limiteMaximo: grupo.limiteMaximo || null,
    });
  };

  // Cerrar modal
  const cerrarModalCrearGrupo = () => {
    setModalCrearGrupo({
      visible: false,
      materiaId: null,
      materiaNombre: null,
      horarioSeleccionado: null,
      estudiantesSeleccionados: [],
      horariosSeleccionados: [],
      modo: "crear",
      grupoId: null,
      limiteMaximo: null,
    });
  };

  // Obtener estudiantes disponibles para el modal
  const estudiantesDisponiblesModal = useMemo(() => {
    if (!modalCrearGrupo.materiaId) return [];
    let estudiantes = getEstudiantesDisponibles(modalCrearGrupo.materiaId);
    
    // Si estamos editando, incluir los estudiantes del grupo actual
    if (modalCrearGrupo.modo === "editar" && modalCrearGrupo.grupoId) {
      const gruposMateria = getGruposMateria(modalCrearGrupo.materiaId);
      const grupoActual = gruposMateria.find((g) => g.id === modalCrearGrupo.grupoId);
      if (grupoActual && grupoActual.estudiantes) {
        // Agregar estudiantes del grupo actual a la lista disponible
        const estudiantesGrupo = grupoActual.estudiantes.map((est) => ({
          ...est,
          horario_preferido: est.horario_preferido || est.horario_original,
        }));
        // Combinar y eliminar duplicados
        const estudiantesIds = new Set(estudiantes.map((e) => e.id_estudiante.toString()));
        estudiantesGrupo.forEach((est) => {
          if (!estudiantesIds.has(est.id_estudiante.toString())) {
            estudiantes.push(est);
          }
        });
      }
    }
    
    // Filtrar por horarios seleccionados si hay alguno
    if (modalCrearGrupo.horariosSeleccionados.length > 0) {
      estudiantes = estudiantes.filter((est) =>
        modalCrearGrupo.horariosSeleccionados.includes(est.horario_original || est.horario_preferido)
      );
    }
    
    return estudiantes;
  }, [modalCrearGrupo.materiaId, modalCrearGrupo.horariosSeleccionados, modalCrearGrupo.modo, modalCrearGrupo.grupoId, getEstudiantesDisponibles, getGruposMateria]);

  // Obtener horarios únicos de estudiantes disponibles
  const horariosDisponibles = useMemo(() => {
    if (!modalCrearGrupo.materiaId) return [];
    const estudiantes = getEstudiantesDisponibles(modalCrearGrupo.materiaId);
    const horariosSet = new Set();
    estudiantes.forEach((est) => {
      const horario = est.horario_original || est.horario_preferido;
      if (horario) horariosSet.add(horario);
    });
    return Array.from(horariosSet).sort();
  }, [modalCrearGrupo.materiaId, getEstudiantesDisponibles]);

  // Toggle selección de estudiante
  const toggleEstudiante = (idEstudiante) => {
    setModalCrearGrupo((prev) => {
      const estudiantes = [...prev.estudiantesSeleccionados];
      const index = estudiantes.indexOf(idEstudiante);
      if (index > -1) {
        // Deseleccionar
        estudiantes.splice(index, 1);
      } else {
        // Validar límite máximo si está definido
        if (prev.limiteMaximo) {
          if (estudiantes.length >= prev.limiteMaximo) {
            toast.error(`El límite máximo de estudiantes es ${prev.limiteMaximo}. No se pueden seleccionar más.`);
            return prev;
          }
        }
        // Seleccionar
        estudiantes.push(idEstudiante);
      }
      return { ...prev, estudiantesSeleccionados: estudiantes };
    });
  };

  // Toggle selección de horario
  const toggleHorario = useCallback((horario) => {
    setModalCrearGrupo((prev) => {
      const horarios = [...prev.horariosSeleccionados];
      const index = horarios.indexOf(horario);
      
      // Obtener TODOS los estudiantes disponibles (sin filtrar por horarios)
      const todosEstudiantesDisponibles = getEstudiantesDisponibles(prev.materiaId);
      
      if (index > -1) {
        // Deseleccionar horario
        horarios.splice(index, 1);
        // Deseleccionar estudiantes de ese horario
        const estudiantes = prev.estudiantesSeleccionados.filter((estId) => {
          const est = todosEstudiantesDisponibles.find((e) => e.id_estudiante.toString() === estId);
          return est && (est.horario_original || est.horario_preferido) !== horario;
        });
        return { ...prev, horariosSeleccionados: horarios, estudiantesSeleccionados: estudiantes };
      } else {
        // Seleccionar horario
        horarios.push(horario);
        // Seleccionar estudiantes de ese horario
        const estudiantesDelHorario = todosEstudiantesDisponibles
          .filter((est) => (est.horario_original || est.horario_preferido) === horario)
          .map((est) => est.id_estudiante.toString());
        
        // Calcular cuántos estudiantes nuevos se pueden agregar
        const estudiantesActuales = prev.estudiantesSeleccionados.length;
        const estudiantesDisponiblesParaAgregar = estudiantesDelHorario.filter(
          (estId) => !prev.estudiantesSeleccionados.includes(estId)
        );
        
        // Si hay límite máximo, calcular cuántos se pueden agregar
        if (prev.limiteMaximo) {
          const espaciosDisponibles = prev.limiteMaximo - estudiantesActuales;
          
          if (espaciosDisponibles <= 0) {
            toast.error(`El límite máximo de ${prev.limiteMaximo} estudiantes ya está alcanzado. No se pueden seleccionar más.`);
            return prev;
          }
          
          // Agregar solo hasta el límite
          const estudiantesAAgregar = estudiantesDisponiblesParaAgregar.slice(0, espaciosDisponibles);
          const estudiantesNuevos = [...new Set([...prev.estudiantesSeleccionados, ...estudiantesAAgregar])];
          
          if (estudiantesDisponiblesParaAgregar.length > espaciosDisponibles) {
            toast(`Se seleccionaron ${espaciosDisponibles} de ${estudiantesDisponiblesParaAgregar.length} estudiantes del horario (límite: ${prev.limiteMaximo})`, {
              icon: '⚠️',
              duration: 4000,
            });
          } else {
            toast.success(`${estudiantesAAgregar.length} estudiantes seleccionados del horario`);
          }
          
          return { ...prev, horariosSeleccionados: horarios, estudiantesSeleccionados: estudiantesNuevos };
        } else {
          // Sin límite, agregar todos
          const estudiantesNuevos = [...new Set([...prev.estudiantesSeleccionados, ...estudiantesDelHorario])];
          return { ...prev, horariosSeleccionados: horarios, estudiantesSeleccionados: estudiantesNuevos };
        }
      }
    });
  }, [getEstudiantesDisponibles]);

  // Crear o editar grupo desde modal
  const handleCrearGrupo = () => {
    if (!modalCrearGrupo.horarioSeleccionado) {
      toast.error("Debe seleccionar un horario para el grupo");
      return;
    }
    if (modalCrearGrupo.estudiantesSeleccionados.length === 0) {
      toast.error("Debe seleccionar al menos un estudiante");
      return;
    }

    // Validar límite máximo si está definido
    if (modalCrearGrupo.limiteMaximo) {
      if (modalCrearGrupo.estudiantesSeleccionados.length > modalCrearGrupo.limiteMaximo) {
        toast.error(`El límite máximo de estudiantes es ${modalCrearGrupo.limiteMaximo}. Actualmente hay ${modalCrearGrupo.estudiantesSeleccionados.length} seleccionados.`);
        return;
      }
      if (modalCrearGrupo.estudiantesSeleccionados.length === 0) {
        toast.error("Debe seleccionar al menos un estudiante");
        return;
      }
    }

    if (modalCrearGrupo.modo === "editar") {
      // Editar grupo existente
      editarGrupo(
        modalCrearGrupo.materiaId,
        modalCrearGrupo.grupoId,
        modalCrearGrupo.estudiantesSeleccionados,
        modalCrearGrupo.horarioSeleccionado,
        modalCrearGrupo.limiteMaximo
      );
    } else {
      // Crear nuevo grupo
      crearGrupo(
        modalCrearGrupo.materiaId,
        modalCrearGrupo.horarioSeleccionado,
        modalCrearGrupo.estudiantesSeleccionados,
        modalCrearGrupo.limiteMaximo
      );
    }
    cerrarModalCrearGrupo();
  };

  // Descargar a Excel
  const descargarExcel = () => {
    try {
      const { datos, resumen } = generarDatosExcel();

      // Crear workbook
      const wb = XLSX.utils.book_new();

      // Hoja de datos
      const wsDatos = XLSX.utils.aoa_to_sheet(datos);
      XLSX.utils.book_append_sheet(wb, wsDatos, "Grupos");

      // Hoja de resumen
      const wsResumen = XLSX.utils.aoa_to_sheet(resumen);
      XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

      // Descargar
      const nombreArchivo = `Grupos_Modulos_${selectedCarrera?.nombreCarrera || "Carrera"}_${gestion || "Gestion"}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);

      toast.success("Excel descargado correctamente");
    } catch (error) {
      console.error("Error al generar Excel:", error);
      toast.error("Error al generar el archivo Excel");
    }
  };

  const toggleMateria = (idMateria) => {
    setMateriaExpandida(materiaExpandida === idMateria ? null : idMateria);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white min-h-screen">
      <Toaster />
      <h2 className="text-4xl font-black mb-8 text-black flex items-center gap-3">
        <span className="block w-3 h-8 bg-red-700 rounded-sm" />
        Programación de Materias por Módulo
      </h2>

      {/* Controles de búsqueda */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Carrera y Pensum
            </label>
            <Dropdown
              value={selectedCarrera}
              options={options}
              onChange={(e) => setSelectedCarrera(e.value)}
              placeholder="Seleccione carrera y pensum"
              className="w-full"
              filter
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gestión
            </label>
            <InputText
              value={gestion}
              onChange={(e) => setGestion(e.target.value)}
              placeholder="Ej: 2026-1"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Módulos Máximos
            </label>
            <InputNumber
              value={modulosMaximos}
              onValueChange={(e) => setModulosMaximos(e.value || 8)}
              min={1}
              max={20}
              className="w-full"
            />
          </div>
          <div className="flex items-end">
            <Button
              label="Cargar Datos"
              icon="pi pi-search"
              onClick={cargarDatos}
              disabled={!selectedCarrera || !gestion || loading}
              className="w-full"
            />
          </div>
        </div>

        {data && (
          <>
            {/* Selector de módulo actual */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Módulo Actual (al cambiar se reinicia la vista)
              </label>
              <div className="flex gap-2 flex-wrap">
                {modulosDisponibles.map((modulo) => (
                  <Button
                    key={modulo}
                    label={`Módulo M${modulo}`}
                    className={
                      moduloActual === modulo
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }
                    onClick={() => cambiarModulo(modulo)}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Trabajando en: <span className="font-bold text-red-700">Módulo M{moduloActual}</span>
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filtrar Materia
              </label>
              <InputText
                value={filtroMateria}
                onChange={(e) => setFiltroMateria(e.target.value)}
                placeholder="Buscar por nombre o sigla..."
                className="w-full"
              />
            </div>
          </>
        )}
      </div>

      {/* Estadísticas */}
      {data && estadisticasProgramacion && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 mb-6 border-2 border-red-200">
          <h3 className="text-2xl font-bold text-red-800 mb-4">Estadísticas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-sm text-gray-600">Total Estudiantes</div>
              <div className="text-2xl font-bold text-red-700">
                {estadisticasProgramacion.totalEstudiantes}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-sm text-gray-600">Estudiantes en Grupos</div>
              <div className="text-2xl font-bold text-green-700">
                {estadisticasProgramacion.estudiantesEnGrupos}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-sm text-gray-600">Total Grupos</div>
              <div className="text-2xl font-bold text-blue-700">
                {estadisticasProgramacion.totalGrupos}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-sm text-gray-600">Materias en Sistema</div>
              <div className="text-2xl font-bold text-purple-700">
                {data.resumen_demanda?.length || 0}
              </div>
            </div>
          </div>

          {/* Resumen por módulo */}
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-red-800 mb-2">
              Grupos por Módulo
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(estadisticasProgramacion.gruposPorModulo)
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                .map(([modulo, cantidadGrupos]) => (
                  <div
                    key={modulo}
                    className="bg-white rounded-lg px-4 py-2 shadow flex items-center gap-2"
                  >
                    <span className="font-bold text-red-700">M{modulo}:</span>
                    <span className="text-lg">
                      {cantidadGrupos} grupos, {estadisticasProgramacion.estudiantesPorModulo[modulo] || 0} estudiantes
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Botón descargar Excel */}
          <div className="mt-4">
            <Button
              label="Descargar Excel"
              icon="pi pi-file-excel"
              onClick={descargarExcel}
              className="bg-green-600 hover:bg-green-700 border-green-600"
            />
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <ProgressSpinner style={{ width: "48px", height: "48px" }} strokeWidth="6" />
          <div className="text-lg text-gray-700 mt-6 font-semibold">
            Cargando datos de planificación...
          </div>
        </div>
      )}

      {/* Lista de materias */}
      {!loading && data && materiasFiltradas.length > 0 && (
        <div className="space-y-4">
          {materiasFiltradas.map((materia) => {
            const gruposMateria = getGruposMateria(materia.id_materia);
            const estudiantesDisponibles = getEstudiantesDisponibles(materia.id_materia);

            return (
              <div
                key={materia.id_materia}
                className="bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden"
              >
                {/* Encabezado de materia */}
                <div
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 cursor-pointer hover:from-red-700 hover:to-red-800 transition"
                  onClick={() => toggleMateria(materia.id_materia)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">{materia.nombre}</h3>
                      <p className="text-red-100">{materia.sigla}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {materia.total_estudiantes} estudiantes
                      </div>
                      <div className="text-sm text-red-100">
                        {gruposMateria.length} grupos en M{moduloActual} | {estudiantesDisponibles.length} disponibles
                      </div>
                    </div>
                    <i
                      className={`pi ${
                        materiaExpandida === materia.id_materia
                          ? "pi-chevron-up"
                          : "pi-chevron-down"
                      } text-2xl`}
                    />
                  </div>
                </div>

                {/* Contenido expandible */}
                {materiaExpandida === materia.id_materia && (
                  <div className="p-4">
                    {/* Botón crear grupo */}
                    <div className="mb-4">
                      <Button
                        label="Crear Nuevo Grupo"
                        icon="pi pi-plus"
                        onClick={() => abrirModalCrearGrupo(materia.id_materia, materia.nombre)}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={estudiantesDisponibles.length === 0}
                      />
                    </div>

                    {/* Lista de grupos creados */}
                    {gruposMateria.length > 0 && (
                      <div className="space-y-3 mb-4">
                        <h4 className="font-bold text-lg text-gray-800">
                          Grupos Creados (Módulo M{moduloActual})
                        </h4>
                        {gruposMateria.map((grupo) => (
                          <div
                            key={grupo.id}
                            className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="font-bold text-lg text-blue-900 bg-blue-200 px-3 py-1 rounded">
                                    Código: {grupo.codigo || "N/A"}
                                  </span>
                                  <span className="font-bold text-blue-800">
                                    Horario: {grupo.horario}
                                  </span>
                                  <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                    Materia: {materia.sigla}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span>{grupo.estudiantes?.length || 0} estudiantes</span>
                                  {grupo.limiteMaximo && (
                                    <span className={`ml-2 ${grupo.estudiantes?.length > grupo.limiteMaximo ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                      (Límite: {grupo.limiteMaximo})
                                      {grupo.estudiantes?.length > grupo.limiteMaximo && ' ⚠️ Excedido'}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  icon="pi pi-pencil"
                                  className="p-button-warning p-button-sm"
                                  onClick={() => abrirModalEditarGrupo(materia.id_materia, materia.nombre, grupo)}
                                  title="Editar grupo"
                                />
                                <Button
                                  icon="pi pi-trash"
                                  className="p-button-danger p-button-sm"
                                  onClick={() => eliminarGrupo(materia.id_materia, grupo.id)}
                                  title="Eliminar grupo"
                                />
                              </div>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-blue-100">
                                  <tr>
                                    <th className="px-2 py-1 text-left">Registro</th>
                                    <th className="px-2 py-1 text-left">Nombre</th>
                                    <th className="px-2 py-1 text-left">Horario Original</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {grupo.estudiantes?.map((est) => (
                                    <tr key={est.id_estudiante} className="border-b border-blue-200">
                                      <td className="px-2 py-1">{est.registro}</td>
                                      <td className="px-2 py-1">{est.nombre}</td>
                                      <td className="px-2 py-1 text-gray-600">
                                        {est.horario_original || est.horario_preferido || "-"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Estudiantes disponibles */}
                    {estudiantesDisponibles.length > 0 && (
                      <div>
                        <h4 className="font-bold text-lg text-gray-800 mb-2">
                          Estudiantes Disponibles ({estudiantesDisponibles.length})
                        </h4>
                        <div className="overflow-x-auto border border-gray-300 rounded-lg">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-3 py-2 text-left">Registro</th>
                                <th className="px-3 py-2 text-left">Nombre</th>
                                <th className="px-3 py-2 text-left">Horario Preferido</th>
                                <th className="px-3 py-2 text-left">Asignado en</th>
                              </tr>
                            </thead>
                            <tbody>
                              {estudiantesDisponibles.map((est) => {
                                const asignaciones = getAsignacionEstudiante(
                                  est.id_estudiante.toString(),
                                  materia.id_materia
                                );
                                return (
                                  <tr
                                    key={est.id_estudiante}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                  >
                                    <td className="px-3 py-2">{est.registro}</td>
                                    <td className="px-3 py-2">{est.nombre}</td>
                                    <td className="px-3 py-2 text-gray-600">
                                      {est.horario_preferido || est.horario_original || "-"}
                                    </td>
                                    <td className="px-3 py-2">
                                      {asignaciones.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                          {asignaciones.map((asig, idx) => (
                                            <span
                                              key={idx}
                                              className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded cursor-help"
                                              title={`Módulo: M${asig.modulo}\nCódigo Grupo: ${asig.codigoGrupo}\nMateria: ${asig.materiaNombre} (${asig.materiaSigla})\nHorario: ${asig.horarioGrupo}`}
                                            >
                                              M{asig.modulo}-{asig.codigoGrupo}
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="text-gray-400 text-xs">Sin asignar</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {estudiantesDisponibles.length === 0 && gruposMateria.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No hay estudiantes disponibles para esta materia en el módulo actual
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && data && materiasFiltradas.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          {filtroMateria
            ? "No se encontraron materias con el filtro aplicado"
            : "No hay materias disponibles"}
        </div>
      )}

      {!loading && !data && (
        <div className="text-center py-12 text-gray-600">
          Seleccione carrera, pensum y gestión, luego haga clic en "Cargar Datos"
        </div>
      )}

      {/* Modal para crear/editar grupo */}
      <Dialog
        header={`${modalCrearGrupo.modo === "editar" ? "Editar" : "Crear"} Grupo - ${modalCrearGrupo.materiaNombre}`}
        visible={modalCrearGrupo.visible}
        style={{ width: "80vw", maxWidth: "900px" }}
        onHide={cerrarModalCrearGrupo}
        footer={
          <div>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={cerrarModalCrearGrupo}
              className="p-button-text"
            />
            <Button
              label={modalCrearGrupo.modo === "editar" ? "Guardar Cambios" : "Crear Grupo"}
              icon={modalCrearGrupo.modo === "editar" ? "pi pi-save" : "pi pi-check"}
              onClick={handleCrearGrupo}
              disabled={
                !modalCrearGrupo.horarioSeleccionado ||
                modalCrearGrupo.estudiantesSeleccionados.length === 0
              }
            />
          </div>
        }
      >
        <div className="space-y-4">
          {/* Selector de horario del grupo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Horario del Grupo *
            </label>
            <Dropdown
              value={modalCrearGrupo.horarioSeleccionado}
              options={HORARIOS_FIJOS.map((h) => ({
                label: `${h.label} (${h.turno}${h.extra ? ", " + h.extra : ""})`,
                value: h.label,
              }))}
              onChange={(e) =>
                setModalCrearGrupo((prev) => ({ ...prev, horarioSeleccionado: e.value }))
              }
              placeholder="Seleccione un horario"
              className="w-full"
            />
          </div>

          {/* Límite máximo de estudiantes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Límite Máximo de Estudiantes (opcional)
            </label>
            <InputNumber
              value={modalCrearGrupo.limiteMaximo}
              onValueChange={(e) => {
                const nuevoLimite = e.value || null;
                setModalCrearGrupo((prev) => {
                  // Si se establece un límite y hay más estudiantes seleccionados que el límite
                  if (nuevoLimite && prev.estudiantesSeleccionados.length > nuevoLimite) {
                    // Reducir la selección al límite (mantener los primeros)
                    const estudiantesLimitados = prev.estudiantesSeleccionados.slice(0, nuevoLimite);
                    const excedentes = prev.estudiantesSeleccionados.length - nuevoLimite;
                    toast(`Se redujo la selección a ${nuevoLimite} estudiantes. Se deseleccionaron ${excedentes} estudiantes.`, {
                      icon: '⚠️',
                      duration: 4000,
                    });
                    return { ...prev, limiteMaximo: nuevoLimite, estudiantesSeleccionados: estudiantesLimitados };
                  }
                  return { ...prev, limiteMaximo: nuevoLimite };
                });
              }}
              placeholder="Sin límite"
              min={1}
              max={1000}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              {modalCrearGrupo.limiteMaximo ? (
                <>
                  <span className={modalCrearGrupo.estudiantesSeleccionados.length >= modalCrearGrupo.limiteMaximo ? "text-green-600 font-semibold" : ""}>
                    Límite: {modalCrearGrupo.limiteMaximo} estudiantes | Seleccionados: {modalCrearGrupo.estudiantesSeleccionados.length}
                  </span>
                  {modalCrearGrupo.estudiantesSeleccionados.length >= modalCrearGrupo.limiteMaximo && (
                    <span className="text-green-600 font-bold ml-2">
                      ✓ Límite alcanzado
                    </span>
                  )}
                </>
              ) : (
                "Sin límite definido - Puede seleccionar todos los estudiantes disponibles"
              )}
            </p>
          </div>

          {/* Selección rápida por horarios */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Selección Rápida por Horarios (opcional)
            </label>
            <p className="text-xs text-gray-600 mb-2">
              Seleccione uno o más horarios para seleccionar automáticamente todos los estudiantes de esos horarios
            </p>
            <div className="flex flex-wrap gap-2">
              {horariosDisponibles.map((horario) => {
                const seleccionado = modalCrearGrupo.horariosSeleccionados.includes(horario);
                const cantidadEstudiantes = estudiantesDisponiblesModal.filter(
                  (est) => (est.horario_original || est.horario_preferido) === horario
                ).length;
                return (
                  <button
                    key={horario}
                    type="button"
                    onClick={() => toggleHorario(horario)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      seleccionado
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {horario} ({cantidadEstudiantes})
                  </button>
                );
              })}
            </div>
            {modalCrearGrupo.horariosSeleccionados.length > 0 && (
              <p className="text-xs text-green-600 mt-2">
                {modalCrearGrupo.horariosSeleccionados.length} horario(s) seleccionado(s)
              </p>
            )}
          </div>

          {/* Lista de estudiantes disponibles */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Seleccionar Estudiantes ({modalCrearGrupo.estudiantesSeleccionados.length} seleccionados)
            </label>
            <div className="border border-gray-300 rounded-lg max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left w-12"></th>
                    <th className="px-3 py-2 text-left">Registro</th>
                    <th className="px-3 py-2 text-left">Nombre</th>
                    <th className="px-3 py-2 text-left">Horario Preferido</th>
                    <th className="px-3 py-2 text-left">Asignado en</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesDisponiblesModal.map((est) => {
                    const seleccionado = modalCrearGrupo.estudiantesSeleccionados.includes(
                      est.id_estudiante.toString()
                    );
                    const asignaciones = getAsignacionEstudiante(
                      est.id_estudiante.toString(),
                      modalCrearGrupo.materiaId
                    );
                    // Verificar si se puede seleccionar (no está seleccionado y no se alcanzó el límite)
                    const limiteAlcanzado = modalCrearGrupo.limiteMaximo && 
                      !seleccionado && 
                      modalCrearGrupo.estudiantesSeleccionados.length >= modalCrearGrupo.limiteMaximo;
                    const puedeSeleccionar = !limiteAlcanzado;
                    
                    return (
                      <tr
                        key={est.id_estudiante}
                        className={`border-b border-gray-200 ${
                          seleccionado ? "bg-blue-50" : limiteAlcanzado ? "bg-gray-100 opacity-60" : "hover:bg-gray-50"
                        } ${puedeSeleccionar || seleccionado ? "cursor-pointer" : "cursor-not-allowed"}`}
                        onClick={() => puedeSeleccionar || seleccionado ? toggleEstudiante(est.id_estudiante.toString()) : null}
                      >
                        <td className="px-3 py-2">
                          <Checkbox
                            checked={seleccionado}
                            disabled={!puedeSeleccionar && !seleccionado}
                            onChange={() => toggleEstudiante(est.id_estudiante.toString())}
                          />
                        </td>
                        <td className="px-3 py-2">{est.registro}</td>
                        <td className="px-3 py-2">{est.nombre}</td>
                        <td className="px-3 py-2 text-gray-600">
                          {est.horario_preferido || est.horario_original || "-"}
                        </td>
                        <td className="px-3 py-2">
                          {asignaciones.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {asignaciones.map((asig, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded cursor-help"
                                  title={`Módulo: M${asig.modulo}\nCódigo Grupo: ${asig.codigoGrupo}\nMateria: ${asig.materiaNombre} (${asig.materiaSigla})\nHorario: ${asig.horarioGrupo}`}
                                >
                                  M{asig.modulo}-{asig.codigoGrupo}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">Sin asignar</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
