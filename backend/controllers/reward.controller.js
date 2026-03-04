import * as rewardService from "../services/reward.service.js";

export async function createReward(req, res) {
  try {
    const data = {...req.body, userId: req.user.id};
    const reward = await rewardService.createReward(data);
    if (!reward) return res.status(400).json({ success: false, message: "We couldn't create your reward. Please check your information and try again." });
    return res.status(201).json({ reward });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function getRewards(req, res) {
  try {
    const rewards = await rewardService.getRewards(req.user.id);
    return res.status(200).json({ rewards });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function getReward(req, res) {
  try {
    const reward = await rewardService.getReward(req.params.id);
    if (!reward) return res.status(404).json({ success: false, message: "We couldn't find the reward you're looking for." });
    return res.status(200).json({ reward });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function updateReward(req, res) {
  try {
    const reward = await rewardService.updateReward(id, req.body);
    return res.status(200).json({ reward });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}
