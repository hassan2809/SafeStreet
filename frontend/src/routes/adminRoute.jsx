import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

const AdminRoute = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

export default AdminRoute;
