import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isRoleVerified, verifyRole, loading } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyUserRole = async () => {
      if (user && !isRoleVerified) {
        setIsVerifying(true);
        await verifyRole();
        setIsVerifying(false);
      } else {
        setIsVerifying(false);
      }
    };

    verifyUserRole();
  }, [user, isRoleVerified, verifyRole]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (loading || isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isRoleVerified) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    const roleRoutes = {
      "super-admin": "/admin",
      "admin": "/admin",
      "client": "/client",
      "user": "/user"
    };
    
    const redirectPath = roleRoutes[user.role] || "/";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
