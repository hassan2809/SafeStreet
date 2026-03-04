import Reward from "../models/reward.model.js";
import Report from "../models/report.model.js";

export async function createReward(data) {
  try {
    const report = await Report.findById(data?.reportId);
    if (!report) return null;
    const newReward = new Reward(data);
    return newReward.save();
  } catch (error) {
    return null;
  }
}

export async function getRewards(userId) {
  try {
    const rewards = await Reward.find({ userId });
    return rewards;
  } catch (error) {
    return null;
  }
}

export async function getReward(id) {
  try {
    const reward = await Reward.findOne({ _id: id });
    if (!reward) return null;
    return reward;
  } catch (error) {
    return null;
  }
}

export async function updateReward(id, body) {
  try {
    const reward = await Reward.findByIdAndUpdate(id, body, { new: true });
    return reward;
  } catch (error) {
    return null;
  }
}
