import React from "react";

const SearchInput = ({ value, onChange, placeholder = "Buscar..." }) => (
  <div className="relative">
    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
      <i className="fas fa-search"></i>
    </span>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
    />
  </div>
);

export default SearchInput;