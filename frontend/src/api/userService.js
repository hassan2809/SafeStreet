import API from "./axiosConfig";

export const getCurrentUser = async () => {
  try {
    const response = await API.get("/user");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user:",
      error.response?.data?.message || error.message
    );
    throw error.response?.data || error;
  }
};

export const getAllClientsAndAdmins = async () => {
  try {
    const response = await API.get("/user/getClientsAndAdmins");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all users:",
      error.response?.data?.message || error.message
    );
    throw error.response?.data || error;
  }
};

// Update user profile
export const updateUser = async (userData) => {
  try {
    const response = await API.patch("/user", userData);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user:",
      error.response?.data?.message || error.message
    );
    throw error.response?.data || error;
  }
};

export const getUsersSignup = async () => {
  try {
    const response = await API.get("/user/new-signups");
    return response.data;
  } catch (error) {
    console.error(
      "Error in getting new users:",
      error.response?.data?.message || error.message
    );
    throw error.response?.data || error;
  }
};

export const createUserByAdmin = async (userData) => {
  try {
    const response = await API.post("/user/createUserByAdmin", userData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating user:",
      error.response?.data?.message || error.message
    );
    throw error.response?.data || error;
  }
};

export const updateUserByAdmin = async (userId, userData) => {
  try {
    const response = await API.put(
      `/user/updateUserByAdmin/${userId}`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user by admin:",
      error.response?.data?.message || error.message
    );
    throw error.response?.data || error;
  }
};

export const deleteUserByAdmin = async (userId) => {
  try {
    const response = await API.delete(`/user/deleteUserByAdmin/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting user:",
      error.response?.data?.message || error.message
    );
    throw error.response?.data || error;
  }
};
