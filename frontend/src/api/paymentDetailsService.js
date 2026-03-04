import API from "./axiosConfig";

export const fetchPaymentDetails = async () => {
  try {
    const response = await API.get("/payment-details/getPaymentDetails");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching payment details:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to load payment details."
    );
  }
};

export const savePaymentDetails = async (details) => {
  try {
    const response = await API.post(
      "/payment-details/savePaymentDetails",
      details
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error saving payment details:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to save payment details."
    );
  }
};
