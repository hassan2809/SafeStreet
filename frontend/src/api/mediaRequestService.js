import API from "./axiosConfig";

export const fetchUserRequests = async () => {
  try {
    const response = await API.get("/media-requests");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user media requests:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to load media requests."
    );
  }
};

export const fetchClientRequests = async () => {
  try {
    const response = await API.get("/media-requests/client");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching client media requests:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to load media requests."
    );
  }
};

export const fetchPendingUploads = async () => {
  try {
    const response = await API.get("/media-requests/pending");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching pending media uploads:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to load pending media requests."
    );
  }
};

export const requestMedia = async (reportId, { inquiryText } = {}) => {
  try {
    const payload = { reportId };

    if (inquiryText && inquiryText.trim() !== "") {
      payload.inquiryText = inquiryText;
    }

    const response = await API.post("/media-requests/request", payload);
    return response.data;
  } catch (error) {
    console.error(
      "Error requesting media:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to request media."
    );
  }
};

export const uploadMedia = async (requestId, files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await API.post(
      `/media-requests/upload/${requestId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error uploading media:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to upload media.");
  }
};

export const changeMediaStatus = async (requestId, status) => {
  try {
    const response = await API.patch(`/media-requests/${requestId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error changing media status to ${status}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to change media status."
    );
  }
};

export const getAllUploadedMedia = async () => {
  try {
    const response = await API.get("/media-requests/uploaded");
    // console.log(response.data);
    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error fetching uploaded media:", error);
    throw new Error("Failed to fetch uploaded media");
  }
};

export const getAllMediaStats = async () => {
  try {
    const response = await API.get("/media-requests/media-requests-stats");
    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error fetching uploaded media:", error);
    throw new Error("Failed to fetch uploaded media");
  }
};

export const deleteMediaRequest = async (requestId) => {
  const res = await API.delete(`/media-requests/${requestId}`);
  return res.data;
};
