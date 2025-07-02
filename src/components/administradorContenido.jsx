const ManagementLayout = ({
  title,
  tabs = [],
  activeTab = null,
  onTabChange = () => {},
  actions = [],
  children,
}) => {
  // Calcula qué acciones mostrar:
  const actionsToShow = Array.isArray(actions)
    ? actions
    : (actions && activeTab && actions[activeTab]) || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Breadcrumb */}
      <div className="bg-white py-4 px-6 border-b border-gray-200">
        <nav className="text-gray-500 text-sm">
          Home <span className="mx-2">›</span> {title}
        </nav>
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="bg-white px-6 pt-4">
          <div className="flex space-x-4 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`pb-2 text-sm font-medium ${
                  activeTab === tab.key
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-gray-300 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-1 overflow-auto">
        <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <div className="flex items-center space-x-4">
              {actionsToShow}
            </div>
          </div>

          {/* Contenido principal */}
          <div className="overflow-auto flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ManagementLayout;
