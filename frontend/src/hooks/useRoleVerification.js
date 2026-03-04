import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";

export const useRoleVerification = () => {
  const { user, isRoleVerified, verifyRole } = useAuthStore();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (user && !isRoleVerified) {
      verifyRole();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user, isRoleVerified, verifyRole]);

  useEffect(() => {
    const handleFocus = () => {
      if (user && isRoleVerified) {
        verifyRole();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, isRoleVerified, verifyRole]);
};
