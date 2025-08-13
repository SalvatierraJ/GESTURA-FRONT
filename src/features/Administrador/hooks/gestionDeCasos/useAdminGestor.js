import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { useCasosStore } from "@/store/casos.store";

export default function useAdminGestor() {
  const [activeTab, setActiveTab] = useState("Casos");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, name: "", type: null });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalCarreraVisible, setModalCarreraVisible] = useState(false);
  const [carreraEditar, setCarreraEditar] = useState(null);

  const [modalAreaVisible, setModalAreaVisible] = useState(false);
  const [areaAEditar, setAreaAEditar] = useState(null);

  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [casoEditar, setCasoEditar] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const {
    carreras, areas, casos, total, loading,
    cargarCarreras, cargarAreasEstudio, cargarCasosEstudio,
    actualizarEstadoCarrera, actualizarEstadoAreaEstudio, actualizarEstadoCasoEstudio,
    borrarCarrera, borrarAreaEstudio, borrarCasoEstudio,
  } = useCasosStore();

  // Carga inicial y por pestaña
  useEffect(() => {
    if (activeTab === "Casos") cargarCasosEstudio(page, pageSize);
    if (activeTab === "Areas") cargarAreasEstudio(page, pageSize);
    if (activeTab === "Carrera") cargarCarreras(page, pageSize);
  }, [activeTab, page, pageSize]);

  // Reset de paginación al cambiar tab
  useEffect(() => {
    setPage(1);
    setPageSize(10);
  }, [activeTab]);

  // Búsqueda con debounce
  useEffect(() => {
    const run = debounce(() => {
      if (activeTab === "Casos") cargarCasosEstudio(page, pageSize, searchTerm);
      if (activeTab === "Areas") cargarAreasEstudio(page, pageSize, searchTerm);
      if (activeTab === "Carrera") cargarCarreras(page, pageSize, searchTerm);
    }, 500);
    run();
    return () => run.cancel();
  }, [searchTerm, activeTab, page, pageSize]);

  const onPageChange = (event) => {
    setPage(event.page + 1);
    setPageSize(event.rows);
  };

  // Handlers de visibilidad (toggle)
  const toggleCarrera = async (carrera) => {
    await actualizarEstadoCarrera({ id: carrera.id_carrera, estado: !carrera.estado });
    await cargarCarreras(page, pageSize, searchTerm);
  };
  const toggleArea = async (area) => {
    await actualizarEstadoAreaEstudio({ id: area.id_area, estado: !area.estado });
    await cargarAreasEstudio(page, pageSize, searchTerm);
  };
  const toggleCaso = async (caso) => {
    await actualizarEstadoCasoEstudio({ id: caso.id_casoEstudio, estado: !caso.estado });
    await cargarCasosEstudio(page, pageSize, searchTerm);
  };

  // Eliminar (mismo modal) — setear intención
  const askDeleteCarrera = (c) => { setToDelete({ id: c.id_carrera, name: c.nombre_carrera, type: "carrera" }); setConfirmOpen(true); };
  const askDeleteArea    = (a) => { setToDelete({ id: a.id_area, name: a.nombre_area, type: "area" }); setConfirmOpen(true); };
  const askDeleteCaso    = (c) => { setToDelete({ id: c.id_casoEstudio, name: c.Nombre_Archivo, type: "caso" }); setConfirmOpen(true); };

  const confirmDelete = async () => {
    if (!toDelete.id || !toDelete.type) return;
    if (toDelete.type === "carrera") { await borrarCarrera(toDelete.id); await cargarCarreras(page, pageSize, searchTerm); }
    if (toDelete.type === "area")    { await borrarAreaEstudio(toDelete.id); await cargarAreasEstudio(page, pageSize, searchTerm); }
    if (toDelete.type === "caso")    { await borrarCasoEstudio(toDelete.id); await cargarCasosEstudio(page, pageSize, searchTerm); }
    setConfirmOpen(false);
  };

  // Preview
  const openPreview = (url) => { setPdfUrl(url); setPreviewOpen(true); };

  // Datos filtrados para búsqueda (si quieres filtrar además del backend)
  const filtered = useMemo(() => ({
    carreras,
    areas,
    casos,
  }), [carreras, areas, casos]);

  return {
    // estado UI
    activeTab, setActiveTab,
    searchTerm, setSearchTerm,
    page, pageSize, onPageChange,
    loading, total,

    // modales
    confirmOpen, setConfirmOpen, toDelete, setToDelete, confirmDelete,
    previewOpen, setPreviewOpen, pdfUrl, openPreview,
    modalCarreraVisible, setModalCarreraVisible, carreraEditar, setCarreraEditar,
    modalAreaVisible, setModalAreaVisible, areaAEditar, setAreaAEditar,
    modalEditarVisible, setModalEditarVisible, casoEditar, setCasoEditar,

    // data
    filtered,

    // handlers de filas
    toggleCarrera, toggleArea, toggleCaso,
    askDeleteCarrera, askDeleteArea, askDeleteCaso,
  };
}
