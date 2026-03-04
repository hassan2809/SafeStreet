import API from "./axiosConfig";

const saveUserSession = (user, csrfToken) => {
  if (csrfToken) localStorage.setItem("csrfToken", csrfToken);
  localStorage.setItem("user", JSON.stringify(user));
};

// Remove token & user from localStorage
const clearUserSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
};

export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials, { withCredentials: true });
  const user = response.data.user;

  if (user.role === "client") {
    if (user.approvalStatus === "pending") {
      throw new Error(
        "Your account is pending approval. Please wait for admin approval."
      );
    }
    if (user.approvalStatus === "rejected") {
      throw new Error("Your account has been rejected. Contact support.");
    }
  }

  saveUserSession(user, response.data.csrfToken);
  return user;
};

export const signupUser = async (userData) => {
  try {
    const response = await API.post("/auth/register", userData, { withCredentials: true });

    if (!response.data.user) {
      throw new Error("Invalid response from server");
    }

    saveUserSession(response.data.user, response.data.csrfToken);
    return response.data.user;
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error;
  }
};


export const logoutUser = () => {
  clearUserSession();
  return API.post("/auth/logout", {}, { withCredentials: true });
};
