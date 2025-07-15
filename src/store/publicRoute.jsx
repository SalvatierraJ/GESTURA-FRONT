
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function PublicRoute() {
  const { role } = useAuthStore();
  if (role === "Estudiante") {
    return <Navigate to="/estudiante" replace />;
  }
  if (role) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
}
