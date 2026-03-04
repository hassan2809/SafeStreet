import { create } from "zustand";
import { loginUser, signupUser, logoutUser } from "../api/authService";
import { getCurrentUser } from "../api/userService";

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: true,
  isRoleVerified: false,

  verifyRole: async () => {
    try {
      const currentUser = get().user;
      if (!currentUser) {
        set({ isRoleVerified: false, loading: false });
        return false;
      }

      const serverUser = await getCurrentUser();
      if (serverUser.role !== currentUser.role) {
        console.warn("Role mismatch detected. Updating from server.");
        set({
          user: serverUser,
          isRoleVerified: true,
          loading: false,
        });
        localStorage.setItem("user", JSON.stringify(serverUser));
        return true;
      }

      set({ isRoleVerified: true, loading: false });
      return true;
    } catch (error) {
      console.error("Error verifying role:", error);
      set({
        user: null,
        isRoleVerified: false,
        loading: false,
      });
      localStorage.removeItem("user");
      localStorage.removeItem("csrfToken");
      return false;
    }
  },

  fetchUser: async () => {
    try {
      const user = await getCurrentUser();
      set({ user, loading: false, isRoleVerified: true });
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ user: null, loading: false, isRoleVerified: false });
      localStorage.removeItem("user");
    }
  },

  login: async (credentials) => {
    const user = await loginUser(credentials);
    set({ user, loading: false, isRoleVerified: true });
    localStorage.setItem("user", JSON.stringify(user));
  },

  signup: async (userData) => {
    const user = await signupUser(userData);
    set({ user, loading: false, isRoleVerified: true });
    localStorage.setItem("user", JSON.stringify(user));
  },

  logout: () => {
    logoutUser();
    set({ user: null, isRoleVerified: false });
    localStorage.removeItem("user");
    localStorage.removeItem("csrfToken");
  },

  isSuperAdmin: () => {
    const state = get();
    return state.user?.role === "super-admin" && state.isRoleVerified;
  },

  isAdmin: () => {
    const state = get();
    return state.user?.role === "admin" && state.isRoleVerified;
  },

  isClient: () => {
    const state = get();
    return state.user?.role === "client" && state.isRoleVerified;
  },

  getUserRole: () => {
    const state = get();
    return state.isRoleVerified ? state.user?.role : null;
  },

  hasRoleAccess: (requiredRole) => {
    const state = get();
    if (!state.isRoleVerified || !state.user) return false;

    const userRole = state.user.role;

    if (requiredRole === "super-admin") return userRole === "super-admin";
    if (requiredRole === "admin")
      return userRole === "admin" || userRole === "super-admin";
    if (requiredRole === "client")
      return (
        userRole === "client" ||
        userRole === "admin" ||
        userRole === "super-admin"
      );
    if (requiredRole === "user")
      return (
        userRole === "user" ||
        userRole === "client" ||
        userRole === "admin" ||
        userRole === "super-admin"
      );

    return false;
  },
}));

export default useAuthStore;
