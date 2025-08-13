// src/features/Administrador/pages/AccessControlPage.jsx
import React, { useRef, useState } from "react";
import ManagementLayout from "@/components/administradorContenido";
import RegistrarUsuarios from "@/features/Administrador/components/controlDeAcceso/modal-controlAcceso";
import Permiso from "@/features/Administrador/components/controlDeAcceso/modal-Roles";
import UsersTable from "@/features/Administrador/components/controlDeAcceso/UsersTable";
import RolesTable from "@/features/Administrador/components/controlDeAcceso/RolesTable";
import InputBuscar from "@/components/searchInput";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import ConfirmDeleteModal from "@/features/Administrador/components/common/ConfirmDeleteModal";
import useAccessControl from "@/features/Administrador/hooks/controlDeAcceso/useAccessControl";

export default function AccessControlPage() {
  const {
    activeTab, setActiveTab,
    searchTerm, setSearchTerm,
    page, pageSize, onPageChange,
    confirmOpen, setConfirmOpen, toDelete, confirmDelete,
    usersDisplayed, totalUsers, restoreUserHandler,
    rolesDisplayed, totalRoles, restoreRoleHandler,
    askDeleteUser, askDeleteRole,
  } = useAccessControl();

  const modalUserRef = useRef(null);
  const [modalRoleVisible, setModalRoleVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const abrirModalNuevoUsuario = () => modalUserRef.current?.openForCreate();
  const abrirModalEditarUsuario = (usuario) => modalUserRef.current?.openForEdit(usuario);

  const tabs = [
    { key: "Control", label: "Control de Acceso" },
    { key: "Rol", label: "Roles y Permisos" },
  ];

  const actions = {
    Control: [
      <InputBuscar
        key="search-user"
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar Usuario.."
      />,
      <Button key="nuevo" label="Registrar Usuario" onClick={abrirModalNuevoUsuario} />,
    ],
    Rol: [
      <InputBuscar
        key="search-rol"
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar Rol.."
      />,
      <button
        key="agregar"
        onClick={() => {
          setEditingRole(null);
          setModalRoleVisible(true);
        }}
        className="bg-red-600 text-white px-4 py-2 rounded-full font-bold hover:bg-red-700"
      >
        Agregar Rol
      </button>,
    ],
  };

  return (
    <ManagementLayout
      title="Control de acceso"
      tabs={tabs}
      actions={actions}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "Control" && (
        <>
          <UsersTable
            users={usersDisplayed}
            onEdit={abrirModalEditarUsuario}
            onAskDelete={askDeleteUser}
            onRestore={restoreUserHandler}
          />
          <div className="w-full flex justify-center mt-4">
            <Paginator
              first={(page - 1) * pageSize}
              rows={pageSize}
              totalRecords={totalUsers}
              onPageChange={onPageChange}
              rowsPerPageOptions={[10, 25, 50]}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            />
          </div>
          <RegistrarUsuarios
            ref={modalUserRef}
            onSubmit={() => {
              // El hook ya recarga al cambiar page/pageSize; si quieres forzar:
              // nada aquí
            }}
          />
        </>
      )}

      {activeTab === "Rol" && (
        <>
          <RolesTable
            roles={rolesDisplayed}
            onEdit={(rol) => {
              setEditingRole(rol);
              setModalRoleVisible(true);
            }}
            onAskDelete={askDeleteRole}
            onRestore={restoreRoleHandler}
          />
          <div className="w-full flex justify-center mt-4">
            <Paginator
              first={(page - 1) * pageSize}
              rows={pageSize}
              totalRecords={totalRoles}
              onPageChange={onPageChange}
              rowsPerPageOptions={[10, 25, 50]}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            />
          </div>
          <Permiso
            initialData={editingRole}
            visible={modalRoleVisible}
            onSave={() => setModalRoleVisible(false)} 
            onClose={() => {
              setModalRoleVisible(false);
              setEditingRole(null);
            }}
            onSuccess={() => {
            }}
          />
        </>
      )}

      <ConfirmDeleteModal
        open={confirmOpen}
        name={toDelete.name}
        entityLabel={toDelete.type === "rol" ? "rol" : "usuario"}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </ManagementLayout>
  );
}
