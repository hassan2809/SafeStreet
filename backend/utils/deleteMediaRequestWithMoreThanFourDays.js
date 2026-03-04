import MediaRequest from "../models/mediaRequest.model.js";

export async function deleteOldMediaRequests() {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 4);

    const result = await MediaRequest.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    console.log(`${result.deletedCount} old media requests deleted.`);
    return result;
  } catch (error) {
    console.error("Error deleting old media requests:", error);
    throw error;
  }
}
