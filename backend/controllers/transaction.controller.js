import * as transactionService from "../services/transaction.service.js";

export async function createTransaction(req, res) {
  try {
    const data = { ...req.body, userId: req.user.id };
    const transaction = await transactionService.createTransaction(data);
    if (!transaction) {
      return res.status(400).json({ success: false, message: "We couldn't process your transaction. Please check your information and try again." });
    }
    return res.status(201).json(transaction);
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function getTransactions(req, res) {
  try {
    const transactions = await transactionService.getTransactions(req.user.id);
    if (!transactions) {
      return res.status(400).json({ success: false, message: "We couldn't retrieve your transaction history. Please try again later." });
    }
    return res.status(200).json(transactions);
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function getTransaction(req, res) {
  try {
    const transaction = await transactionService.getTransaction(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "We couldn't find the transaction you're looking for." });
    }
    return res.status(200).json(transaction);
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}
