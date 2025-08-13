import React from "react";
import ManagementLayout from "@/components/administradorContenido";
import RegistrarCaso from "@/features/Administrador/components/gestionDeCasos/modal-casos";
import RegistrarArea from "@/features/Administrador/components/gestionDeCasos/modal-area";
import RegistrarCarrera from "@/features/Administrador/components/gestionDeCasos/modal-carrera";
import InputBuscar from "@/components/searchInput";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { useAuthStore } from "@/store/authStore";
import ModalDocumento from "@/features/Administrador/components/gestionDeCasos/modal_Prev_PDF";
import ModalEditarCasoEstudio from "@/features/Administrador/components/gestionDeCasos/modal-editar-casoEstudio";

import useAdminGestor from "@/features/Administrador/hooks/gestionDeCasos/useAdminGestor";
import ConfirmDeleteModal from "@/features/Administrador/components/common/ConfirmDeleteModal";
import FilaCaso from "@/features/Administrador/components/gestionDeCasos/FilaCaso";
import FilaArea from "@/features/Administrador/components/gestionDeCasos/FilaArea";
import FilaCarrera from "@/features/Administrador/components/gestionDeCasos/FilaCarrera";

export default function GestionCasos() {
  const roles = useAuthStore((s) => s.getRoles());
  const isAdmin = roles.some((r) => r.Nombre === "Admin");

  const {
    activeTab, setActiveTab,
    searchTerm, setSearchTerm,
    page, pageSize, onPageChange,
    loading, total,

    confirmOpen, setConfirmOpen, toDelete, confirmDelete,

    previewOpen, setPreviewOpen, pdfUrl, openPreview,
    modalCarreraVisible, setModalCarreraVisible, carreraEditar, setCarreraEditar,
    modalAreaVisible, setModalAreaVisible, areaAEditar, setAreaAEditar,
    modalEditarVisible, setModalEditarVisible, casoEditar, setCasoEditar,

    filtered,
    toggleCarrera, toggleArea, toggleCaso,
    askDeleteCarrera, askDeleteArea, askDeleteCaso,
  } = useAdminGestor();

  const tabs = [
    { key: "Casos",   label: "Casos de Estudio" },
    { key: "Areas",   label: "Areas" },
    ...(isAdmin ? [{ key: "Carrera", label: "Carreras" }] : []),
  ];

  const actions = {
    Casos: [
      <InputBuscar key="search" value={searchTerm} onChange={setSearchTerm} placeholder="Buscar Caso..." />,
      <RegistrarCaso key="reg" />,
    ],
    Areas: [
      <InputBuscar key="search" value={searchTerm} onChange={setSearchTerm} placeholder="Buscar área..." />,
      <Button
        key="btn"
        label="Registrar Área" icon="pi pi-plus"
        className="mb-4 bg-red-700 text-white hover:bg-red-800"
        style={{ backgroundColor: "#e11d1d", hover: "#b91c1c" }}
        onClick={() => { setAreaAEditar(null); setModalAreaVisible(true); }}
      />,
    ],
    ...(isAdmin && {
      Carrera: [
        <InputBuscar key="search" value={searchTerm} onChange={setSearchTerm} placeholder="Buscar carrera..." />,
        <RegistrarCarrera
          key="reg"
          visible={modalCarreraVisible}
          setVisible={setModalCarreraVisible}
          carrera={carreraEditar}
          limpiarCarreraEditar={() => setCarreraEditar(null)}
        />,
        <Button
          key="btn"
          className="mb-4 bg-red-700 text-white hover:bg-red-800"
          style={{ backgroundColor: "#e11d1d", hover: "#b91c1c" }}
          icon="pi pi-plus"
          label="Registrar Carrera"
          onClick={() => { setCarreraEditar(null); setModalCarreraVisible(true); }}
        />,
      ],
    }),
  };

  return (
    <ManagementLayout title="Gestión de Casos" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} actions={actions}>
      {activeTab === "Casos" && (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombres</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tema</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filtered.casos || []).map((caso) => (
                <FilaCaso
                  key={caso.id_casoEstudio}
                  caso={caso}
                  onPreview={openPreview}
                  onToggle={() => toggleCaso(caso)}
                  onAskDelete={() => askDeleteCaso(caso)}
                  onEdit={() => { setCasoEditar(caso); setModalEditarVisible(true); }}
                />
              ))}
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

          <ModalDocumento visible={previewOpen} onHide={() => setPreviewOpen(false)} url={pdfUrl} />

          <ModalEditarCasoEstudio
            visible={modalEditarVisible}
            onHide={() => setModalEditarVisible(false)}
            caso={casoEditar}
            onUpdateSuccess={() => {  }}
          />
        </>
      )}

      {activeTab === "Areas" && (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Área</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carreras</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filtered.areas || []).map((area) => (
                <FilaArea
                  key={area.id_area}
                  area={area}
                  onEdit={() => { setAreaAEditar(area); setModalAreaVisible(true); }}
                  onToggle={() => toggleArea(area)}
                  onAskDelete={() => askDeleteArea(area)}
                />
              ))}
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

          <RegistrarArea
            visible={modalAreaVisible}
            setVisible={setModalAreaVisible}
            areaEditar={areaAEditar}
            onSuccess={() => {}}
          />
        </>
      )}

      {activeTab === "Carrera" && isAdmin && (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Carrera</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filtered.carreras || []).map((carrera) => (
                <FilaCarrera
                  key={carrera.id_carrera}
                  carrera={carrera}
                  onEdit={() => { setCarreraEditar(carrera); setModalCarreraVisible(true); }}
                  onToggle={() => toggleCarrera(carrera)}
                  onAskDelete={() => askDeleteCarrera(carrera)}
                />
              ))}
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

      <ConfirmDeleteModal
        open={confirmOpen}
        name={toDelete?.name}
        entityLabel={toDelete?.type === "area" ? "área" : toDelete?.type === "carrera" ? "carrera" : "caso de estudio"}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </ManagementLayout>
  );
}
