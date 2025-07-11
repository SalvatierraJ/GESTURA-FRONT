import ManagementLayout from "@/components/administradorContenido";
import RegistrarSecretario from "@/features/Administrador/components/modal-controlAcceso";
import Permiso from "@/features/Administrador/components/modal-Roles";
import { useEffect, useState } from "react";
import { useRolStore } from "@/store/roles.store";
import { Paginator } from "primereact/paginator";
import { useUserStore } from "@/store/users.store";
const Usuarios = ({ user }) => (
  <tr className="border-b last:border-none hover:bg-gray-50">
    <td className="px-4 py-3 text-sm text-gray-700">{user.id}</td>
    <td className="px-4 py-3 text-sm text-gray-700">
      {user.nombres ? user.nombre : "Sin nombre"}
    </td>
    <td className="px-4 py-3 text-sm text-gray-700">
      {user.correo ? user.correo : "sin correo"}
    </td>
    <td className="px-4 py-3 text-sm text-gray-700">
      {user.roles && user.roles.length > 0
        ? user.roles.map((r) => r.nombre).join(", ")
        : "Sin roles"}
    </td>

    <td className="px-4 py-3 text-center space-x-2">
      <button className="text-blue-600 hover:text-blue-800">
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
    <td className="px-4 py-3 text-sm text-gray-700">
      {rol.carreras && rol.carreras.length > 0
        ? rol.carreras.map((c) => c.nombre).join(", ")
        : "Sin carreras"}
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
    pagina,
    limite,
    loading,
    error,
    cargarRoles,
    totalPaginas,
    crearNuevoRol,
    actualizarRolExistente,
  } = useRolStore();

  const { loadUsers, total, page, pageSize, users } = useUserStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const handleSave = async (data) => {
    if (data.id) {
      await actualizarRolExistente(data);
      cargarRoles(pagina, limite);
    } else {
      await crearNuevoRol(data);
      cargarRoles(pagina, limite);
    }
    setModalVisible(false);
    setEditingRole(null);
  };
  useEffect(() => {
    cargarRoles(pagina, limite);
    loadUsers(page, pageSize);
  }, [pagina, limite, cargarRoles, page, pageSize, loadUsers]);
  const filteredRoles = roles.filter((c) =>
    (c.nombre || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredUser = users.filter((c) =>
    (c.nombres || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const onPageChange = (event) => {
    cargarRoles(event.page + 1, event.rows);
    loadUsers(event.page + 1, event.rows);
  };
  const actions = {
    Control: [
      <div key="search" className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <i className="fas fa-search"></i>
        </span>
        <input
          type="text"
          placeholder="Search"
          className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>,
      <RegistrarSecretario />,
    ],
    Rol: [
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
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUser.map((user) => (
                <Usuarios key={user.id} user={user} />
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carreras Administradas
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
              first={(pagina - 1) * limite}
              rows={limite}
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
              cargarRoles(pagina, limite);
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
