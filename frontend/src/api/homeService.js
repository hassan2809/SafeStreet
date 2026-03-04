import API from "../api/axiosConfig";

export const getStatsForHome = async () => {
  try {
    const response = await API.get("/report/statsForHome", { skipAuth: true });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get stats: ${error.message}`);
  }
};

export const sendContactMessage = async (payload) => {
  try {
    const response = await API.post("/home/contact", payload, { skipAuth: true });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to send contact message: ${error.message}`);
  }
};

export const getLatestDeathStats = async () => {
  try {
    const response = await API.get("/home/latestDeathStats", { skipAuth: true });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get latest death stats: ${error.message}`);
  }
};