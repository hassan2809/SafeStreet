import * as paymentDetailsService from "../services/paymentDetails.service.js";

export const savePaymentDetails = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { accountName, bsb, accountNumber } = req.body;

    if (!accountName || !bsb || !accountNumber) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields: account name, BSB, and account number." });
    }

    const paymentDetails = await paymentDetailsService.createOrUpdatePaymentDetails(userId, {
      accountName,
      bsb,
      accountNumber,
    });

    res.status(200).json({
      message: "Payment details saved successfully",
      data: paymentDetails,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "We're having trouble saving your payment details. Please try again later." });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const paymentDetails = await paymentDetailsService.getPaymentDetailsByUser(userId);

    if (!paymentDetails) {
      return res.status(404).json({ success: false, message: "You haven't set up your payment details yet. Please add them to receive rewards." });
    }

    res.status(200).json({ data: paymentDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: "We're having trouble retrieving your payment details. Please try again later." });
  }
};
