import API from "./axiosConfig";

// 📌 Get All Active Advertisements
export const getActiveAds = async () => {
  try {
    const response = await API.get("/advertisements");
    return response.data;
  } catch (error) {
    console.error("Error fetching active advertisements:", error);
    throw error;
  }
};

// 📌 Upload a New Advertisement
export const uploadAd = async (adData) => {
  try {
    const response = await API.post("/advertisements", adData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading advertisement:", error);
    throw error;
  }
};

// 📌 Update an Existing Advertisement
export const updateAd = async (adId, adData) => {
  try {
    const response = await API.put(`/advertisements/${adId}`, adData);
    return response.data;
  } catch (error) {
    console.error("Error updating advertisement:", error);
    throw error;
  }
};

// 📌 Delete an Advertisement
export const deleteAd = async (adId) => {
  try {
    const response = await API.delete(`/advertisements/${adId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    throw error;
  }
};
