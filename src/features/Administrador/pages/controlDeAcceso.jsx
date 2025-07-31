import React, { useRef } from "react";
import ManagementLayout from "@/components/administradorContenido";
import RegistrarUsuarios from "@/features/Administrador/components/modal-controlAcceso";
import Permiso from "@/features/Administrador/components/modal-Roles";
import { useEffect, useState } from "react";
import { useRolStore } from "@/store/roles.store";
import { Paginator } from "primereact/paginator";
import { useUserStore } from "@/store/users.store";
import { Button } from "primereact/button";
import InputBuscar from "@/components/searchInput";
const Usuarios = ({ user, abrirModalEditar }) => (
  <tr className="border-b last:border-none hover:bg-gray-50">
    <td className="px-4 py-3 text-sm text-gray-700">{user.id}</td>
    <td className="px-4 py-3 text-sm text-gray-700">
      {user.nombres ? user.nombres : "Sin nombre"}
    </td>
    <td className="px-4 py-3 text-sm text-gray-700">
      {user.correo ? user.correo : "sin correo"}
    </td>
    <td className="px-4 py-3 text-sm text-gray-700">
      {user.roles && user.roles.length > 0
        ? user.roles.map((r) => r.nombre).join(", ")
        : "Sin roles"}
    </td>
       <td className="px-4 py-3 text-sm text-gray-700">
      {user.carreras && user.carreras.length > 0
        ? user.carreras.map((c) => c.nombre).join(", ")
        : "Sin carreras"}
    </td>

    <td className="px-4 py-3 text-center space-x-2">
      <button
        className="text-blue-600 hover:text-blue-800"
        onClick={() => abrirModalEditar(user)}
      >
        <i className="fas fa-edit"></i>
      </button>
    </td>
  </tr>
);

const Roles = ({ rol, setEditingRole, setModalVisible }) => (
  <tr className="border-b last:border-none hover:bg-gray-50">
    <td className="px-4 py-3 text-sm text-gray-700">{rol.id}</td>
    <td className="px-4 py-3 text-sm text-gray-700">{rol.nombre}</td>
    <td className="px-4 py-3 text-sm text-gray-700">
      {rol.modulos && rol.modulos.length > 0
        ? rol.modulos
            .map((m, i) => m.nombre)
            .filter((v, i, a) => a.indexOf(v) === i)
            .join(", ")
        : "Sin permisos"}
    </td>
   
    <td className="px-4 py-3 text-center space-x-2">
      <button
        className="text-blue-600 hover:text-blue-800"
        onClick={() => {
          setEditingRole(rol);
          setModalVisible(true);
        }}
      >
        <i className="fas fa-edit"></i>
      </button>
    </td>
  </tr>
);

const MainContent = () => {
  const [activeTab, setActiveTab] = useState("Control");
  const {
    roles,
    loading,
    error,
    cargarRoles,
    totalPaginas,
    crearNuevoRol,
    actualizarRolExistente,
  } = useRolStore();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const modalRef = useRef();
  const abrirModalNuevo = () => modalRef.current.openForCreate();

  const abrirModalEditar = (usuario) => modalRef.current.openForEdit(usuario);
  const { loadUsers, total, users } = useUserStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const handleSave = async (data) => {
    if (data.id) {
      await actualizarRolExistente(data);
      cargarRoles(page, pageSize);
    } else {
      await crearNuevoRol(data);
      cargarRoles(page, pageSize);
    }
    setModalVisible(false);
    setEditingRole(null);
  };
  useEffect(() => {
    if (activeTab === "Rol") cargarRoles(page, pageSize);
    else if (activeTab === "Control") loadUsers(page, pageSize);
  }, [activeTab,page, pageSize, cargarRoles, page, pageSize, loadUsers]);
  useEffect(() => {
    setPage(1);
    setPageSize(10);
  }, [activeTab]);
  const filteredRoles = roles.filter((c) =>
    (c.nombre || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredUser = users.filter((c) =>
    (c.nombres || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const onPageChange = (event) => {
    setPage(event.page + 1);
    setPageSize(event.rows);
  };
  const actions = {
    Control: [
      <InputBuscar
            key="search"
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar Usuario.."
          />,
      <Button label="Registrar Usuario" onClick={abrirModalNuevo} />,
    ],
    Rol: [
       <InputBuscar
            key="search"
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar Rol.."
          />,
      <button
        onClick={() => {
          setEditingRole(null);
          setModalVisible(true);
        }}
        className="bg-red-600 text-white px-4 py-2 rounded-full font-bold hover:bg-red-700"
      >
        Agregar Rol
      </button>,
    ],
  };
  const tabs = [
    {
      key: "Control",
      label: "Control de Acceso",
    },
    {
      key: "Rol",
      label: "Roles y Permisos",
    },
  ];

  return (
    <ManagementLayout
      title="Control de acceso"
      actions={actions}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "Control" && (
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
                  correo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carreras Administradas
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUser.map((user) => (
                <Usuarios
                  key={user.id}
                  user={user}
                  abrirModalEditar={abrirModalEditar}
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
          <RegistrarUsuarios
            ref={modalRef}
            onSubmit={() => {
              loadUsers(page, pageSize);
            }}
          />
        </>
      )}

      {activeTab === "Rol" && (
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
                  Permisos
                </th>
             
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoles.map((rol) => (
                <Roles
                  key={rol.id}
                  rol={rol}
                  setEditingRole={setEditingRole}
                  setModalVisible={setModalVisible}
                />
              ))}
            </tbody>
          </table>
          <div className="w-full flex justify-center mt-4">
            <Paginator
              first={(page - 1) * pageSize}
              rows={pageSize}
              totalRecords={totalPaginas}
              onPageChange={onPageChange}
              rowsPerPageOptions={[10, 25, 50]}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            />
          </div>

          <Permiso
            initialData={editingRole}
            visible={modalVisible}
            onSave={handleSave}
            onClose={() => {
              setModalVisible(false);
              setEditingRole(null);
            }}
            onSuccess={() => {
              cargarRoles(page, pageSize);
            }}
          />
        </>
      )}
    </ManagementLayout>
  );
};

export default function MainLayout() {
  return <MainContent />;
}
