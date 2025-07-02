import { BrowserRouter as Router, Routes, Route, Outlet} from "react-router-dom";
import Sidebar from "@/layout/menuLateral";
import Header from "@/layout/header";

const mainLayout = () => {
  return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-4 overflow-y-auto">      
              <Outlet />
          </div>
        </div>
      </div>
  );
};

export default mainLayout;