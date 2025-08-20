// src/features/Administrador/hooks/useDocentesPage.js
import { useEffect, useState, useCallback } from "react";
import { useDocentesStore } from "@/store/docentes.store";

function useDebouncedEffect(fn, deps, delay = 500) {
  useEffect(() => {
    const id = setTimeout(fn, delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}

export function useDocentesPage() {
  const {
    cargarDocentes,
    docentes,
    total,
    loading,
    actualizarEstadoDocente,
    borrarDocente,
  } = useDocentesStore();

  const [activeTab, setActiveTab] = useState("docentes");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalDocenteVisible, setModalDocenteVisible] = useState(false);
  const [docenteAEditar, setDocenteAEditar] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, name: "" });

  useEffect(() => {
    if (activeTab === "docentes") {
      cargarDocentes(page, pageSize);
    }
  }, [activeTab, page, pageSize, cargarDocentes]);

  useDebouncedEffect(() => {
    if (activeTab === "docentes") {
      cargarDocentes(page, pageSize, searchTerm);
    }
  }, [searchTerm, activeTab, page, pageSize]);

  useEffect(() => {
    setPage(1);
    setPageSize(10);
  }, [activeTab]);

  const onPageChange = useCallback((event) => {
    setPage(event.page + 1);
    setPageSize(event.rows);
  }, []);

  const openNuevoDocente = () => {
    setDocenteAEditar(null);
    setModalDocenteVisible(true);
  };
  const openEditarDocente = (docente) => {
    setDocenteAEditar(docente);
    setModalDocenteVisible(true);
  };

  const askDelete = (name, id) => {
    setToDelete({ id, name });
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    if (!toDelete.id) return;
    await borrarDocente(toDelete.id);
    await cargarDocentes(page, pageSize);
  };

  const onToggleEstado = async (id_tribunal, next) => {
    await actualizarEstadoDocente({ id: id_tribunal, estado: next });
    await cargarDocentes(page, pageSize);
  };

  const recargar = () => cargarDocentes(page, pageSize);

  return {
    docentes,
    total,
    loading,

    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    page,
    pageSize,
    onPageChange,

    modalDocenteVisible,
    setModalDocenteVisible,
    docenteAEditar,
    openNuevoDocente,
    openEditarDocente,

    confirmOpen,
    setConfirmOpen,
    toDelete,
    askDelete,
    confirmDelete,

    onToggleEstado,
    recargar,
  };
}
