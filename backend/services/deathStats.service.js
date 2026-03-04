import DeathStats from "../models/deathStats.model.js";

export async function getLatestDeathStats() {
  try {
    const latest = await DeathStats.findOne().sort({ date: -1 });
    return latest;
  } catch (error) {
    console.error("Error fetching latest stats:", error);
    throw error;
  }
}
