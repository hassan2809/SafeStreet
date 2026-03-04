import Report from "../models/report.model.js";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  subMonths,
  endOfMonth,
} from "date-fns";
import { sendEmail } from "../utils/sendEmail.js";

export async function createReport(data) {
  const newReport = new Report(data);
  await newReport.save();

  const emailContent = `
    <h2>Report Confirmation</h2>
    <p>Hi ${data.name},</p>
    <p>Thank you for submitting your report. Here’s a summary:</p>
    <ul>
      <li><strong>Incident Type:</strong> ${data.incidentType}</li>
      <li><strong>Vehicle Type:</strong> ${data.vehicleType}</li>
      <li><strong>Location:</strong> ${data.location}, ${data.suburb}, ${
    data.state
  }</li>
      <li><strong>Date:</strong> ${new Date(
        data.date
      ).toLocaleDateString()}</li>
      <li><strong>Time:</strong> ${data.time || "N/A"}</li>
      <li><strong>Description:</strong> ${data.description || "N/A"}</li>
    </ul>
    <p>We will review your report and notify you with any updates.</p>
    <p>– SafeStreet Team</p>
  `;

  await sendEmail({
    to: data.email,
    subject: "SafeStreet Report Confirmation",
    html: emailContent,
  });

  return newReport;
}

export async function getUserReports(userId) {
  const reports = await Report.find({ userId });
  if (!reports) return [];
  return reports;
}

export async function getAllReports(userId) {
  const reports = await Report.find().populate("userId", "name customId");
  // if (!reports) return [];
  return reports;
}

export async function getReport(userId, id) {
  const report = await Report.findOne({ userId, _id: id });

  if (!report) return null;

  return report;
}

export async function updateReport(id, data) {
  const report = await Report.findById(id);

  if (!report) {
    throw new Error("Report not found");
  }

  if (report.status === "rejected") {
    data.status = "pending";
  }

  const updatedReport = await Report.findByIdAndUpdate(id, data, { new: true });

  return updatedReport;
}

export async function deleteReport(id) {
  const report = await Report.findById(id);

  if (!report) {
    throw new Error("Report not found");
  }

  if (report.status !== "pending") {
    throw new Error("Only pending reports can be deleted");
  }

  await Report.findByIdAndDelete(id);
  return { message: "Report deleted successfully" };
}

export async function deleteReportByAdmin(id) {
  const report = await Report.findById(id);

  if (!report) {
    throw new Error("Report not found");
  }

  await Report.findByIdAndDelete(id);
  return { message: "Report deleted successfully" };
}

export async function getUserReportStats(userId) {
  try {
    const totalReports = await Report.countDocuments({ userId });
    const pendingReports = await Report.countDocuments({
      userId,
      status: "pending",
    });
    const approvedReports = await Report.countDocuments({
      userId,
      status: "approved",
    });

    const latestReport = await Report.findOne({ userId })
      .sort({ createdAt: -1 })
      .select("-userId");

    return { totalReports, pendingReports, approvedReports, latestReport };
  } catch (error) {
    console.error(`Error getting report stats: ${error.message}`);
    throw error;
  }
}

export async function filterReports(filters) {
  try {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.incidentType) {
      query.incidentType = filters.incidentType;
    }

    if (filters.mediaFlag !== undefined) {
      query.mediaFlag = filters.mediaFlag === "true"; // Convert string to boolean
    }

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.date.$lte = new Date(filters.endDate);
      }
    }

    const reports = await Report.find(query);
    return reports;
  } catch (error) {
    console.error(`Error filtering reports: ${error.message}`);
    throw error;
  }
}

// Fetch all reports stats (daily, weekly, monthly, last month, and change)

// Count reports based on filter
export async function countReports(filter) {
  return await Report.countDocuments(filter);
}

// Fetch reports stats (daily, weekly, monthly, last month, and change)
export async function getReportsStats() {
  try {
    // Define time ranges
    const today = startOfDay(new Date());
    const startOfWeekDate = startOfWeek(new Date());
    const startOfMonthDate = startOfMonth(new Date());
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    // Fetch counts
    const totalReports = await countReports({});
    const dailyReports = await countReports({ createdAt: { $gte: today } });
    const weeklyReports = await countReports({
      createdAt: { $gte: startOfWeekDate },
    });
    const monthlyReports = await countReports({
      createdAt: { $gte: startOfMonthDate },
    });
    const lastMonthReports = await countReports({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });

    // Calculate percentage change
    const changePercentage = lastMonthReports
      ? (
          ((monthlyReports - lastMonthReports) / lastMonthReports) *
          100
        ).toFixed(2)
      : 0;

    return {
      total: totalReports,
      daily: dailyReports,
      weekly: weeklyReports,
      monthly: monthlyReports,
      lastMonth: lastMonthReports,
      changePercentage,
      positive: changePercentage >= 0,
    };
  } catch (error) {
    throw new Error(`Error fetching reports stats: ${error.message}`);
  }
}

export const getReportStatsForHome = async (req, res) => {
  try {
    const totalApprovedReports = await Report.countDocuments({ status: "approved" });
    const highRiskDrivers = await Report.countDocuments({
      incidentType: {
        $in: [
          "Excessive Speed",
          "Road Rage",
          "Hoon Driving (Including burnouts, racing)",
          "Tailgating",
          "Dangerous/Reckless Driving",
        ],
      },
    });

    const insurancePartner = 1;

    return res.status(200).json({
      totalApprovedReports,
      highRiskDrivers,
      insurancePartner,
    });
  } catch (error) {
    console.error("Failed to get report stats:", error);
    return res.status(500).json({ message: "Failed to fetch statistics" });
  }
};

export const addWitnessInfo = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { info, contactEmail } = req.body;

    if (!info || info.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Please provide witness information to submit this report." });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found." });
    }

    report.witnessInfo.push({
      info: info.trim(),
      contactEmail: contactEmail?.trim() || null, 
      submittedAt: new Date(),
    });

    await report.save();

    return res
      .status(200)
      .json({ message: "Witness info added successfully." });
  } catch (err) {
    console.error("Error adding witness info:", err);
    return res.status(500).json({ error: "Failed to add witness info." });
  }
};
