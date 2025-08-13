import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { useUserStore } from "@/store/users.store";
import { useRolStore } from "@/store/roles.store";

export default function useAccessControl() {
  // pestaña
  const [activeTab, setActiveTab] = useState("Control");

  // búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // confirm modal (genérico)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState({ type: null, id: null, name: "" });

  // USERS store
  const {
    users,
    total,
    loadUsers,
    softDeleteUser,  
    restoreUser,    
  } = useUserStore();

  // ROLES store
  const {
    roles,
    cargarRoles,
    eliminarRolLogico,
    restaurarRol,      
    totalPaginas,      
  } = useRolStore();

  // cargar datos por pestaña/paginación
  useEffect(() => {
    if (activeTab === "Control") loadUsers(page, pageSize);
    if (activeTab === "Rol") cargarRoles(page, pageSize);
  }, [activeTab, page, pageSize, loadUsers, cargarRoles]);

  // reset paginación al cambiar de tab
  useEffect(() => {
    setPage(1);
    setPageSize(10);
  }, [activeTab]);

  // debounce de búsqueda (aquí filtramos localmente)
  const [localSearch, setLocalSearch] = useState("");
  useEffect(() => {
    const run = debounce(() => setLocalSearch(searchTerm), 300);
    run();
    return () => run.cancel();
  }, [searchTerm]);

  // filtrados locales
  const filteredUsers = useMemo(() => {
    const q = (localSearch || "").toLowerCase();
    return users.filter((u) =>
      (u.nombres || "").toLowerCase().includes(q)
    );
  }, [users, localSearch]);

  const filteredRoles = useMemo(() => {
    const q = (localSearch || "").toLowerCase();
    return roles.filter((r) =>
      (r.nombre || "").toLowerCase().includes(q)
    );
  }, [roles, localSearch]);

  const rolesPaginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRoles.slice(start, start + pageSize);
  }, [filteredRoles, page, pageSize]);

  // handlers de confirmación
  const askDeleteUser = (user) => {
    setToDelete({
      type: "user",
      id: user.id,
      name: user.nombres || user.username || `Usuario #${user.id}`,
    });
    setConfirmOpen(true);
  };

  const askDeleteRole = (rol) => {
    setToDelete({
      type: "rol",
      id: rol.id,
      name: rol.nombre || `Rol #${rol.id}`,
    });
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete?.id || !toDelete?.type) return;
    if (toDelete.type === "user") {
      await softDeleteUser(toDelete.id);
      await loadUsers(page, pageSize);
    } else if (toDelete.type === "rol") {
      await eliminarRolLogico(toDelete.id);
      await cargarRoles(page, pageSize);
    }
    setConfirmOpen(false);
    setToDelete({ type: null, id: null, name: "" });
  };

  const restoreUserHandler = async (user) => {
    await restoreUser(user.id);
    await loadUsers(page, pageSize);
  };

  const restoreRoleHandler = async (rol) => {
    await restaurarRol(rol.id);
    await cargarRoles(page, pageSize);
  };

  const onPageChange = (event) => {
    setPage(event.page + 1);
    setPageSize(event.rows);
  };

  return {
    // estado UI
    activeTab, setActiveTab,
    searchTerm, setSearchTerm,
    page, pageSize, onPageChange,

    // confirm modal
    confirmOpen, setConfirmOpen,
    toDelete, askDeleteUser, askDeleteRole, confirmDelete,

    // data users
    users,
    usersDisplayed: filteredUsers,
    totalUsers: total,
    restoreUserHandler,

    // data roles
    roles,
    rolesDisplayed: rolesPaginated,
    totalRoles: totalPaginas || filteredRoles.length, 
    restoreRoleHandler,
  };
}
