import React, { useEffect, useState } from "react";
import { usePensumStore } from "@/store/materia.store";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import { Calendar, Search, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function EstudiantesMateriasView() {
  const {
    loadingEliminar,
    eliminarInscripcionMateria,
    estudiantesMaterias,
    fetchEstudiantesMateriasPaginado,
    loadingEstudiantes,
  } = usePensumStore();

  const [search, setSearch] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [openGestiones, setOpenGestiones] = useState({});
  const [page, setPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [materiaToDelete, setMateriaToDelete] = useState(null);

  // Debounce para búsqueda
  const handleSearch = debounce((value) => {
    fetchEstudiantesMateriasPaginado({
      page: 1,
      pageSize: 10,
      nombre: value.trim(),
      fechaInicio,
      fechaFin,
    });
    setPage(1);
  }, 400);

  // Fetch cuando cambian fechas/página
  useEffect(() => {
    fetchEstudiantesMateriasPaginado({
      page,
      pageSize: 10,
      fechaInicio,
      fechaFin,
    });
    // eslint-disable-next-line
  }, [page, fechaInicio, fechaFin]);

  // Fetch inicial
  useEffect(() => {
    fetchEstudiantesMateriasPaginado({ page, pageSize: 10 });
    // eslint-disable-next-line
  }, []);

  const handleSelectEstudiante = (id) => {
    setSelectedEstudiante(selectedEstudiante === id ? null : id);
    setOpenGestiones({});
  };

  const handleToggleGestion = (gestion) => {
    setOpenGestiones((prev) => ({
      ...prev,
      [gestion]: !prev[gestion],
    }));
  };

  // Primera confirmación: abrir modal
  const handleDeleteMateria = (mat) => {
    setMateriaToDelete(mat);
    setShowDeleteDialog(true);
  };

  // Segunda confirmación: en el modal
  const confirmDeleteMateria = async () => {
    if (!materiaToDelete) return;
    try {
      const response = await eliminarInscripcionMateria({
        codigo_horario: materiaToDelete.id_estudiante_materia,
      });
      if (response.ok) {
        toast.success("Materia eliminada correctamente.", {
          style: {
            background: "#fff",
            color: "#111",
            border: "2px solid #E3342F"
          },
          iconTheme: {
            primary: "#E3342F",
            secondary: "#fff",
          },
        });
        setShowDeleteDialog(false);
        setMateriaToDelete(null);
        // Recarga la lista actual
        fetchEstudiantesMateriasPaginado({
          page,
          pageSize: 10,
          fechaInicio,
          fechaFin,
        });
      } else {
        toast.error(response.message || "No se pudo eliminar la inscripción.", {
          style: {
            background: "#fff",
            color: "#111",
            border: "2px solid #E3342F"
          },
          iconTheme: {
            primary: "#E3342F",
            secondary: "#fff",
          },
        });
      }
    } catch (err) {
      toast.error("Error inesperado al eliminar inscripción.", {
        style: {
          background: "#fff",
          color: "#111",
          border: "2px solid #E3342F"
        },
        iconTheme: {
          primary: "#E3342F",
          secondary: "#fff",
        },
      });
      setShowDeleteDialog(false);
      setMateriaToDelete(null);
      console.error(err);
    }
  };

  // Cancelar modal
  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setMateriaToDelete(null);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 font-sans">
      {/* Barra superior */}
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-6">
        <h2 className="flex-1 text-2xl font-bold text-black">
          Estudiantes y Materias
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              className="pl-10 pr-3 py-2 border rounded-lg focus:outline-red-700 bg-white shadow-sm text-black"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearch(e.target.value);
              }}
              style={{ borderColor: "#E3342F" }}
            />
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="text-gray-400 w-5 h-5" />
            <input
              type="date"
              className="px-2 py-1 border rounded focus:outline-red-700 text-black"
              value={fechaInicio}
              onChange={(e) => {
                setFechaInicio(e.target.value);
                setPage(1);
              }}
              title="Fecha inicio"
              style={{ borderColor: "#E3342F" }}
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-black font-bold px-1">-</span>
            <input
              type="date"
              className="px-2 py-1 border rounded focus:outline-red-700 text-black"
              value={fechaFin}
              onChange={(e) => {
                setFechaFin(e.target.value);
                setPage(1);
              }}
              title="Fecha fin"
              style={{ borderColor: "#E3342F" }}
            />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="rounded-lg shadow bg-white p-4 min-h-[300px] border border-black">
        {loadingEstudiantes ? (
          <div className="text-red-700 font-semibold text-lg text-center">
            Cargando...
          </div>
        ) : estudiantesMaterias.items.length === 0 ? (
          <div className="text-black text-center">
            No hay estudiantes registrados.
          </div>
        ) : (
          <ul className="space-y-4">
            {estudiantesMaterias.items.map((est) => (
              <li
                key={est.id_estudiante}
                className="rounded border border-black bg-white shadow p-3"
              >
                {/* Nombre de estudiante */}
                <button
                  className="flex items-center gap-2 w-full text-left text-black font-semibold hover:bg-red-50 px-2 py-1 rounded transition"
                  onClick={() => handleSelectEstudiante(est.id_estudiante)}
                >
                  <span>{est.nombre_completo}</span>
                  {selectedEstudiante === est.id_estudiante ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Gestiones */}
                {selectedEstudiante === est.id_estudiante && (
                  <ul className="mt-2 space-y-2 ml-2">
                    {Object.entries(est.materias_por_gestion).map(
                      ([gestion, materias]) => (
                        <li
                          key={gestion}
                          className="bg-white rounded shadow-sm border border-black p-2"
                        >
                          <button
                            className="flex items-center gap-2 text-red-700 font-medium w-full hover:bg-red-50 rounded px-2 py-1 transition"
                            onClick={() => handleToggleGestion(gestion)}
                          >
                            <span>Gestión {gestion}</span>
                            {openGestiones[gestion] ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                          {/* Materias */}
                          {openGestiones[gestion] && (
                            <ul className="pl-4 mt-1 space-y-1">
                              {materias.map((mat) => (
                                <li
                                  key={mat.id_estudiante_materia}
                                  className="flex justify-between items-center bg-red-50 rounded px-3 py-1 border border-red-200"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-black">
                                      {mat.materia}
                                    </span>
                                    <span className="text-sm text-gray-700">
                                      Grupo: <b>{mat.grupo}</b> | Horario:{" "}
                                      <b>{mat.horario}</b> | Estado:{" "}
                                      <b>{mat.estado}</b>
                                    </span>
                                  </div>
                                  <button
                                    className="text-red-700 hover:bg-red-200 border border-red-300 rounded p-1 transition"
                                    onClick={() => handleDeleteMateria(mat)}
                                    disabled={loadingEliminar}
                                    title="Eliminar materia"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dialog de doble confirmación */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg border-2 border-red-700 p-6 w-[350px] text-center flex flex-col gap-4">
            <span className="text-lg font-bold text-red-700">
              ¿Eliminar materia?
            </span>
            <span className="text-black">
              Esta acción es <b>irreversible</b>.<br />
              ¿Deseas eliminar la inscripción?
            </span>
            <div className="flex gap-3 justify-center mt-2">
              <button
                onClick={confirmDeleteMateria}
                disabled={loadingEliminar}
                className="bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded transition border border-black"
              >
                Sí, eliminar
              </button>
              <button
                onClick={closeDeleteDialog}
                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded transition border border-black"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paginación */}
      <div className="flex justify-center items-center gap-3 mt-5">
        <button
          className="px-3 py-1 rounded bg-black hover:bg-red-700 font-bold text-white border border-black disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => {
            setPage((p) => p - 1);
            fetchEstudiantesMateriasPaginado({
              page: page - 1,
              pageSize: 10,
              fechaInicio,
              fechaFin,
            });
          }}
        >
          Anterior
        </button>
        <span className="text-black font-semibold">
          Página {page} de {estudiantesMaterias.totalPages}
        </span>
        <button
          className="px-3 py-1 rounded bg-black hover:bg-red-700 font-bold text-white border border-black disabled:opacity-50"
          disabled={page >= estudiantesMaterias.totalPages}
          onClick={() => {
            setPage((p) => p + 1);
            fetchEstudiantesMateriasPaginado({
              page: page + 1,
              pageSize: 10,
              fechaInicio,
              fechaFin,
            });
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
