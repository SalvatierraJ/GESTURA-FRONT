import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function ProtectedRoute({ allowedRoles }) {
  const { role } = useAuthStore();
  if (!role) return <Navigate to="/" replace />;
  if (allowedRoles.includes(role)) return <Outlet />;
  return <Navigate to="/home/ajustes" replace />;
}
