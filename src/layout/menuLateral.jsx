import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { sidebarOptions } from "@/components/menuItems";

const SidebarItem = ({ iconClass, label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center p-3 mb-1 rounded-lg cursor-pointer ${
          isActive
            ? "bg-red-100 text-red-600"
            : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        <i className={`${iconClass} text-lg mr-3`}></i>
        <span className="font-medium">{label}</span>
      </Link>
    </li>
  );
};

const Sidebar = () => {
  const getAvailableModules = useAuthStore((state) => state.getAvailableModules);
  const availableModules = getAvailableModules().map(m => m.toLowerCase());
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // Nuevo estado para mostrar el modal
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <aside className="w-64 bg-white h-full shadow-md flex flex-col">
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <img
          src="https://placehold.co/32x32?text=U"
          alt="Logo de UTEPSA"
          className="w-8 h-8 mr-2"
        />
        <span className="text-xl font-bold text-red-600">UTEPSA</span>
      </div>
      <nav className="flex-1 overflow-y-auto mt-4">
        <ul className="px-2">
          {sidebarOptions
            .filter((item) => {
              if (item.type === "section") return true;
              if (item.label === "Ajustes") return true;
              if (item.label === "Inicio") return true;
              return availableModules.includes(item.label.toLowerCase());
            })
            .map((item) =>
              item.type === "section" ? (
                <li
                  key={item.label}
                  className="mb-4 px-3 text-gray-500 uppercase text-xs tracking-wide"
                >
                  {item.label}
                </li>
              ) : (
                <SidebarItem
                  key={item.to}
                  iconClass={item.iconClass}
                  label={item.label}
                  to={item.to}
                />
              )
            )}
        </ul>
      </nav>
      <div className="px-4 py-3 border-t border-gray-200">
        <button
          className="w-full flex items-center text-gray-600 hover:text-red-600"
          onClick={() => setShowConfirm(true)}
        >
          <i className="fas fa-sign-out-alt text-lg mr-2"></i>
          <span className="font-medium">Salir</span>
        </button>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xs flex flex-col items-center animate-fadeIn">
            <i className="fas fa-exclamation-triangle text-4xl text-red-600 mb-3"></i>
            <div className="text-lg font-semibold mb-2 text-gray-900 text-center">¿Deseas cerrar sesión?</div>
            <div className="text-gray-600 text-sm mb-6 text-center">Tu sesión se cerrará y tendrás que volver a iniciar sesión para acceder nuevamente.</div>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setTimeout(handleLogout, 100); 
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold shadow"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
