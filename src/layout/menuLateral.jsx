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
  const role = useAuthStore((state) => state.role); // "Admin", "jefe", "estudiante"
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true }); // Redirige al login
  };
  return (
    <aside className="w-64 bg-white h-full shadow-md flex flex-col">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <img
          src="https://placehold.co/32x32?text=U"
          alt="Logo de UTEPSA"
          className="w-8 h-8 mr-2"
        />
        <span className="text-xl font-bold text-red-600">UTEPSA</span>
      </div>
      {/* Menu */}
      <nav className="flex-1 overflow-y-auto mt-4">
        <ul className="px-2">
          {sidebarOptions
            .filter(
              (item) => !item.roles || item.roles.includes(role) // Si no hay roles es section
            )
            .map((item, i) =>
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

      {/* Logout */}
      <div className="px-4 py-3 border-t border-gray-200">
        <button className="w-full flex items-center text-gray-600 hover:text-red-600"  onClick={handleLogout}>
          <i className="fas fa-sign-out-alt text-lg mr-2"></i>
          <span className="font-medium">Salir</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
