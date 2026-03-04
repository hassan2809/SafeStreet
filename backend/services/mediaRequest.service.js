import MediaRequest from "../models/mediaRequest.model.js";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  subMonths,
  endOfMonth,
} from "date-fns";

export async function createMediaRequest(reportId, inquiryText, clientId) {
  return await MediaRequest.create({
    report: reportId,
    inquiryText,
    requestedBy: clientId,
  });
}

export async function getAllMediaRequests() {
  return await MediaRequest.find().populate("report");
}

export async function getMediaRequestsForUser(userId) {
  return await MediaRequest.find()
    .populate([
      {
        path: "report",
        match: { userId: userId },
      },
      {
        path: "requestedBy",
        select: "fullName email role",
      },
    ])
    .then((requests) => requests.filter((request) => request.report !== null));
}

export async function getClientMediaRequests(userId) {
  return await MediaRequest.find({ requestedBy: userId }).populate("report");
}

export async function getMediaRequestsForUploader(userId) {
  return await MediaRequest.find({ status: "pending" }).populate("report");
}

export const uploadMedia = async (requestId, fileUrls) => {
  const mediaRequest = await MediaRequest.findById(requestId);

  if (!mediaRequest) {
    throw new Error("Media request not found");
  }

  let update = {};

  if (mediaRequest.status === "rejected") {
    update = {
      mediaUrls: fileUrls,
      status: "uploaded",
    };
  } else {
    update = {
      mediaUrls: fileUrls,
      status: "uploaded",
    };
  }

  const updatedMediaRequest = await MediaRequest.findByIdAndUpdate(
    requestId,
    update,
    { new: true }
  );

  return updatedMediaRequest;
};

export async function updateMediaStatus(requestId, status) {
  return await MediaRequest.findByIdAndUpdate(
    requestId,
    { status },
    { new: true }
  );
}

export const getAllUploadedMedia = async () => {
  const mediaRequests = await MediaRequest.find({ status: "uploaded" })
    .populate("report")
    .populate("requestedBy")
    .populate("uploadedBy");
  return mediaRequests;
};

// Fetch media requests (daily, weekly, monthly, last month, and change)

// Count media requests based on filter
export async function countMediaRequests(filter) {
  return await MediaRequest.countDocuments(filter);
}

// Fetch media request stats (daily, weekly, monthly, last month, and change)
export async function getMediaRequestsStats() {
  try {
    // Define time ranges
    const today = startOfDay(new Date());
    const startOfWeekDate = startOfWeek(new Date());
    const startOfMonthDate = startOfMonth(new Date());
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    // Fetch counts
    const totalRequests = await countMediaRequests({});
    const dailyRequests = await countMediaRequests({
      createdAt: { $gte: today },
    });
    const weeklyRequests = await countMediaRequests({
      createdAt: { $gte: startOfWeekDate },
    });
    const monthlyRequests = await countMediaRequests({
      createdAt: { $gte: startOfMonthDate },
    });
    const lastMonthRequests = await countMediaRequests({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });

    // Calculate percentage change
    const changePercentage = lastMonthRequests
      ? (
          ((monthlyRequests - lastMonthRequests) / lastMonthRequests) *
          100
        ).toFixed(2)
      : 0;

    return {
      total: totalRequests,
      daily: dailyRequests,
      weekly: weeklyRequests,
      monthly: monthlyRequests,
      lastMonth: lastMonthRequests,
      changePercentage,
      positive: changePercentage >= 0,
    };
  } catch (error) {
    throw new Error(`Error fetching media request stats: ${error.message}`);
  }
}
export async function deleteMediaRequestById(id) {
  const deleted = await MediaRequest.findByIdAndDelete(id);
  return deleted;
}

export default { countMediaRequests, getMediaRequestsStats };
