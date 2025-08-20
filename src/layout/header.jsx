import { useAuthStore } from "@/store/authStore";

const Header = () => {
  const usuario_formulario = useAuthStore((state) => state.user);

  const nombre =
    usuario_formulario?.Persona?.Nombre || "--";
  const apellido1 =
    usuario_formulario?.Persona?.Apellido1 || "";
  const apellido2 =
    usuario_formulario?.Persona?.Apellido2 || "";
  const nombreCompleto = [nombre, apellido1]
    .filter(Boolean)
    .join(" ");

  const rol =
    usuario_formulario?.roles?.[0]?.Nombre || "--";

  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <header className="flex items-center justify-between bg-white h-16 px-6 border-b border-gray-200">
      <div className="flex items-center w-1/3">
        <div className="relative w-full">
         
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <button className="relative text-gray-600 hover:text-gray-800">
          <i className="fas fa-comment-dots text-xl"></i>
        </button>
        <button className="relative text-gray-600 hover:text-gray-800">
          <i className="fas fa-bell text-xl"></i>
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">3</span>
        </button>
        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src={`https://placehold.co/32x32?text=${inicial}`}
            alt={`Avatar de ${nombreCompleto}`}
            className="w-8 h-8 rounded-full"
          />
          <div className="text-left">
            <p className="text-gray-800 font-medium">{nombreCompleto}</p>
            <p className="text-gray-500 text-sm">{rol}</p>
          </div>
          <i className="fas fa-chevron-down text-gray-500"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
