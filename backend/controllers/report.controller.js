import Report from "../models/report.model.js";
import * as reportService from "../services/report.service.js";

export async function createReport(req, res) {
  try {
    // console.log("in create report")
    // console.log(req.body)
    const data = { ...req.body, userId: req.user.id };
    const report = await reportService.createReport(data);

    return res.status(201).json({ report });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function getUserReports(req, res) {
  try {
    // console.log(req.user);
    const reports = await reportService.getUserReports(req.user.id);
    return res.status(200).json({ reports });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function getAllReports(req, res) {
  try {
    const reports = await reportService.getAllReports();
    return res.status(200).json({ reports });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function getReport(req, res) {
  try {
    const report = await reportService.getReport(req.user.id, req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: "We couldn't find the report you're looking for." });
    }
    return res.status(200).json({ report });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function updateReport(req, res) {
  try {
    const report = await reportService.getReport(
      req.query.userId,
      req.query.reportId
    );

    if (!report) {
      return res.status(404).json({ success: false, message: "We couldn't find the report you're looking for." });
    }

    if (report.status === "approved") {
      return res
        .status(403)
        .json({ success: false, message: "You can only update reports that are still pending approval." });
    }

    const updatedReport = await reportService.updateReport(
      req.params.id,
      req.body
    );
    return res.status(200).json({ report: updatedReport });
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function addComment(req, res) {
  const { id } = req.params;
  const { adminComments } = req.body;

  if (!adminComments) {
    return res.status(400).json({ success: false, message: "Please provide a comment before submitting." });
  }

  try {
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: "We couldn't find the report you're looking for." });
    }

    report.adminComments = adminComments;
    await report.save();

    res.status(200).json({ message: "Comment added", report });
  } catch (error) {
    console.error("Error in addComment controller:", error);
    res.status(500).json({ success: false, message: "We're having trouble adding your comment. Please try again later." });
  }
}

export async function deleteReport(req, res) {
  try {
    const report = await reportService.getReport(req.user.id, req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: "We couldn't find the report you're looking for." });
    }

    if (report.status !== "pending") {
      return res
        .status(403)
        .json({ success: false, message: "You can only delete reports that are still pending approval." });
    }

    // Proceed with deletion
    await reportService.deleteReport(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function deleteByAdmin(req, res) {
  try {
    await reportService.deleteReportByAdmin(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function getUserReportStats(req, res) {
  try {
    const stats = await reportService.getUserReportStats(req.user.id);
    return res.status(200).json(stats);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function filterReports(req, res) {
  try {
    const filters = req.query; // Get filters from query parameters
    const reports = await reportService.filterReports(filters);
    return res.status(200).json({ reports });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

// Fetch all reports stats (daily, weekly, monthly, last month, and change)
export async function getTotalReports(req, res) {
  try {
    const stats = await reportService.getReportsStats();
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function reportsForHeatMap(req, res) {
  try {
    const reports = await Report.find(
      { status: "approved" },
      {
        _id: 1,
        incidentType: 1,
        date: 1,
        location: 1,
        streetNumber: 1,
        crossStreet: 1,
        suburb: 1,
        state: 1,
        description: 1,
        vehicleType: 1,
      }
    );

    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}
