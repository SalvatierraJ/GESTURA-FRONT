import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/layout/menuLateral";
import Header from "@/layout/header";
import RightSidebar from "@/layout/RightSidebar";
import { useState } from "react";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedRight, setCollapsedRight] = useState(true);
  const [rightSidebar, setRightSidebar] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  const rutasConSidebar = [
  "/home/registro-materia",
  "/home/pruebaConceptual",
];

const showRightSidebar = rutasConSidebar.includes(location.pathname) && !!rightSidebar;


  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Header />
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 p-4 overflow-y-auto min-w-0">
            <Outlet
              context={{
                collapsedRight,
                setCollapsedRight,
                setRightSidebar,
                rightSidebar,
                setSuggestions,
                setCartCount
              }}
            />
          </div>
          {showRightSidebar && (
            <RightSidebar
              collapsed={collapsedRight}
              setCollapsed={setCollapsedRight}
              title="Sugerencias y Carrito"
              showCartIcon={true}
              sugerencias={suggestions}
              cartCount={cartCount}
            >
              {rightSidebar}
            </RightSidebar>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
