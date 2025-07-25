  // Header Component
  const Header = () => {
    return (
      <header className="flex items-center justify-between bg-white h-16 px-6 border-b border-gray-200">
        {/* Search Bar */}
        <div className="flex items-center w-1/3">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        {/* Icons and User */}
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
              src="https://placehold.co/32x32?text=R"
              alt="Avatar of Rahmah Admin"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-left">
              <p className="text-gray-800 font-medium">Rahmah</p>
              <p className="text-gray-500 text-sm">Admin</p>
            </div>
            <i className="fas fa-chevron-down text-gray-500"></i>
          </div>
        </div>
      </header>
    );
  };
  export default Header;