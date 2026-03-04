import { getLatestDeathStats } from "../services/deathStats.service.js";

export async function fetchLatestStats(req, res) {
  try {
    const latestStats = await getLatestDeathStats();
    if (!latestStats) {
      return res.status(404).json({ message: "No stats found" });
    }
    res.json(latestStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
}
