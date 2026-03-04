import Transaction from "../models/transaction.model.js";

export async function createTransaction(data) {
  try {
    const transaction = new Transaction(data);
    return await transaction.save();
  } catch (error) {
    return null;
  }
}

export async function getTransactions(userId) {
  try {
    const transactions = await Transaction.find({ userId });
    return transactions;
  } catch (error) {
    return null;
  }
}

export async function getTransaction(id) {
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) return null;
    return transaction;
  } catch (error) {
    return null;
  }
}
