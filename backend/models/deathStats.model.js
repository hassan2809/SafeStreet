import mongoose, { Schema } from "mongoose";

const deathStatsSchema = new Schema({
  date: { type: String, required: true, unique: true },
  stats: [
    {
      number: String,
      subtitle: String,
    },
  ],
  scrapedAt: { type: Date, default: Date.now },
});

const DeathStats = mongoose.model("DeathStats", deathStatsSchema);
export default DeathStats;
