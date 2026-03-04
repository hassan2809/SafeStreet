import PaymentDetails from "../models/paymentDetails.model.js";

export const createOrUpdatePaymentDetails = async (userId, data) => {
  const paymentDetails = await PaymentDetails.findOneAndUpdate(
    { user: userId },
    { ...data, user: userId },
    { new: true, upsert: true }
  );

  return paymentDetails;
};

export const getPaymentDetailsByUser = async (userId) => {
  return await PaymentDetails.findOne({ user: userId }).populate(
    "user",
    "fullName email"
  );
};
