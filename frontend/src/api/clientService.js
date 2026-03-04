import API from "./axiosConfig";

export const updateClient = async (userId, updateData) => {
  try {
    const response = await API.patch(`/user/${userId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update client status: ${error.message}`);
  }
};

export const fetchClients = async () => {
  try {
    const response = await API.get("/user/all");
    return response.data.filter((user) => user.role !== "admin");
    // return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to load clients: ", error.message);
  }
};
