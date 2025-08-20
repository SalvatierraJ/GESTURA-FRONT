// src/features/Administrador/pages/DocentesPage.jsx
import React from "react";
import ManagementLayout from "@/components/administradorContenido";
import NuevoDocente from "@/features/Administrador/components/gestionDocente/modal-nuevoDocente";
import InputBuscar from "@/components/searchInput";
import { Paginator } from "primereact/paginator";
import ConfirmDeleteModal from "@/features/Administrador/components/common/ConfirmDeleteModal";
import TeacherRow from "@/features/Administrador/components/gestionDocente/TeacherRow";
import { useDocentesPage } from "@/features/Administrador/hooks/gestionDocente/useDocentesPage";

import AsignarDocentesMaterias from "./AsignacionMateriaDocente";

export default function DocentesPage() {
  const {
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
  } = useDocentesPage();

  const tabs = [
    { key: "docentes", label: "Docentes" },
    { key: "contratos", label: "Contratos" },
    { key: "Materia", label: "Materias" },
  ];

  const actions = {
    docentes: [
      <InputBuscar
        key="search"
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar Docente..."
      />,
      <NuevoDocente
        key="nuevo"
        visible={modalDocenteVisible}
        setVisible={setModalDocenteVisible}
        docenteEditar={docenteAEditar}
        onSuccess={recargar}
      />,
      <button
        key="jurado"
        className="bg-white border border-red-600 text-red-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50"
        onClick={() => {}}
      >
        Solicitar Jurado Externo
      </button>,
    ],
  };
  

  return (
    <ManagementLayout
      title="Gestión de Docentes"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      actions={actions}
    >
      {activeTab === "docentes" && (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombres
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Apellidos
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Área de Especialización
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {docentes.map((docente) => (
                <TeacherRow
                  key={docente.id_tribunal}
                  docente={docente}
                  page={page}
                  pageSize={pageSize}
                  onEdit={openEditarDocente}
                  onToggleEstado={onToggleEstado}
                  onAskDelete={askDelete}
                />
              ))}

              {!loading && docentes.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No existen datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="w-full flex justify-center mt-4">
            <Paginator
              first={(page - 1) * pageSize}
              rows={pageSize}
              totalRecords={total}
              onPageChange={onPageChange}
              rowsPerPageOptions={[10, 25, 50]}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            />
          </div>
        </>
      )}

      {activeTab === "contratos" && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombres
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Apellidos
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo de Contrato
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                No existen datos
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {activeTab === "Materia" && <AsignarDocentesMaterias />}

      <ConfirmDeleteModal
        open={confirmOpen}
        name={toDelete.name}
        entityLabel="docente"
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </ManagementLayout>
  );
}
