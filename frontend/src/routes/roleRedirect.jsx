import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

const RoleRedirect = () => {
  const { user, isRoleVerified, verifyRole, loading } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);

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
    return <Navigate to="/home" />;
  }

  if (loading || isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isRoleVerified) {
    return <Navigate to="/home" />;
  }

  const roleBasedRoutes = {
    "super-admin": "/admin",
    "admin": "/admin",
    "client": "/client",
    "user": "/user",
  };

  const redirectPath = roleBasedRoutes[user.role] || "/home";
  return <Navigate to={redirectPath} />;
};

export default RoleRedirect;
