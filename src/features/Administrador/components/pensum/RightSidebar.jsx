import React from "react";

// Ejemplo de sugerencias [{icon: "fa-book", title: "Matemáticas"}, ...]
const RightSidebar = ({
  children,
  title = "Panel Derecho",
  iconClass = "fas fa-layer-group",
  sugerencias = [],
  showCartIcon = false,
  cartCount = 0,
  collapsed,
  setCollapsed,
}) => {
  return (
    <aside
      className={`
        transition-all duration-300
        bg-white shadow-xl border-l border-gray-200
        h-[calc(100vh-5rem)]
        ${collapsed ? "w-16" : "w-[380px]"}
        flex flex-col
        z-20
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b min-h-[48px]">
        <div className="flex items-center gap-2 pl-1">
          <i className={`${iconClass} text-xl text-red-700`} />
          {!collapsed && (
            <span className="text-base font-bold text-red-700">{title}</span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-gray-500 hover:text-red-600 focus:outline-none ml-auto"
          title={collapsed ? "Expandir panel" : "Colapsar panel"}
        >
          <i className={`fas fa-angle-${collapsed ? "left" : "right"}`}></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col items-center">
        {collapsed ? (
          <>
            {sugerencias && sugerencias.length > 0 && (
              <div className="flex flex-col gap-3 mt-2">
                {sugerencias.map((sug, idx) => (
                  <span
                    key={idx}
                    className="relative group flex flex-col items-center"
                  >
                    <i
                      className={`${sug.icon || "fas fa-lightbulb"} text-lg text-gray-500 group-hover:text-red-700 transition`}
                      title={sug.title}
                    />
                    {sug.count > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                        {sug.count}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
            {showCartIcon && (
              <div className="mt-5 relative">
                <i className="fas fa-shopping-cart text-2xl text-red-700" title="Carrito" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-2">
                    {cartCount}
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          children
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;
