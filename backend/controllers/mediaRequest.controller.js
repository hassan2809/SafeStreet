import * as mediaRequestService from "../services/mediaRequest.service.js";
import { sendEmail } from "../utils/sendEmail.js";
import Report from "../models/report.model.js";
import MediaRequest from "../models/mediaRequest.model.js";
import PaymentDetails from "../models/paymentDetails.model.js";

export async function requestMedia(req, res) {
  try {
    const mediaRequest = await mediaRequestService.createMediaRequest(
      req.body.reportId,
      req.body.inquiryText,
      req.user.id
    );

    const report = await Report.findById(req.body.reportId).populate(
      "userId",
      "email fullName"
    );

    if (!report || !report.userId) {
      return res.status(404).json({ success: false, message: "We couldn't find the report or its owner. Please check the report ID and try again." });
    }

    const subject = "Media Request Notification";
    const message = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2563eb;">Congratulations!</h2>

    <p>
      An agency has formally requested the dashcam footage associated with your recent 
      <strong>SafeStreet</strong> report.
    </p>    
    <p>
      Please click the link below to upload your media, or log in to your SafeStreet account 
      to upload it directly:
    </p>
    <p>
      <a href="${process.env.CLIENT_URL}/media-requests" 
         style="display: inline-block; background-color: #2563eb; color: #fff; 
                padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Upload Your Media
      </a>
    </p>
    <p>
      Once your footage has been submitted and approved, your reward payment will be processed 
      to your nominated bank account within <strong>45 days</strong>. Please add your bank details in the 
      “Payment Details” section under your User Profile.
    </p>
    <p>
      Thank you for supporting SafeStreet and helping make our roads safer for everyone.
    </p>
    <p>
      Kind regards,<br/>
      <strong>The SafeStreet Team</strong><br/>
      SafeStreet AU Pty Ltd
    </p>
  </div>
`;

    await sendEmail({
      to: report.userId.email,
      subject,
      html: message,
    });

    res.status(201).json(mediaRequest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function sendEmailAndRequestMediaByAdmin(req, res) {
  try {
    const { reportId, subject, message, email } = req.body;
    const inquiryText = "";

    const emailResult = await sendEmail({
      to: email,
      subject,
      html: message,
    });

    if (!emailResult.success) {
      return res
        .status(500)
        .json({ success: false, message: "We're having trouble sending the email. Please try again later." });
    }

    const mediaRequest = await mediaRequestService.createMediaRequest(
      reportId,
      inquiryText,
      req.user.id
    );

    res.status(201).json({ mediaRequest, emailSent: true });
  } catch (error) {
    console.error("sendEmailAndRequestMediaByAdmin error:", error);
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function getUserMediaRequests(req, res) {
  try {
    const mediaRequests = await mediaRequestService.getMediaRequestsForUser(
      req.user.id
    );
    res.status(200).json(mediaRequests);
  } catch (error) {
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function getClientMediaRequests(req, res) {
  try {
    const mediaRequests = await mediaRequestService.getClientMediaRequests(
      req.user.id
    );
    res.status(200).json(mediaRequests);
  } catch (error) {
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function getPendingUploads(req, res) {
  try {
    const requests = await mediaRequestService.getMediaRequestsForUploader(
      req.user.id
    );
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function getAllMediaRequests(req, res) {
  try {
    const requests = await mediaRequestService.getAllMediaRequests();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export async function uploadMedia(req, res) {
  try {
    const { id } = req.params;
    const mediaFiles = req.files;
    const fileUrls = mediaFiles.map((file) => file.path);

    const updatedMediaRequest = await mediaRequestService.uploadMedia(
      id,
      fileUrls
    );
    res.status(200).json(updatedMediaRequest);
  } catch (error) {
    console.error("Error uploading media:", error.message);
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

export const getUploadedMediaRequests = async (req, res) => {
  try {
    const mediaRequests = await mediaRequestService.getAllUploadedMedia();
    return res.status(200).json(mediaRequests);
  } catch (error) {
    console.error("Error in controller:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export async function changeMediaStatus(req, res) {
  try {
    const mediaRequest = await mediaRequestService.updateMediaStatus(
      req.params.id,
      req.body.status
    );
    res.status(200).json(mediaRequest);
  } catch (error) {
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
}

// Fetch media request stats (daily, weekly, monthly, last month, and change)

export async function getMediaRequests(req, res) {
  try {
    const stats = await mediaRequestService.getMediaRequestsStats();
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching media requests:", error);
    return res.status(500).json({ message: error.message });
  }
}

export async function deleteMediaRequest(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Please provide a valid media request ID." });
    }

    const deleted = await mediaRequestService.deleteMediaRequestById(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "We couldn't find the media request you're trying to delete." });
    }

    return res
      .status(200)
      .json({ message: "Media request deleted successfully" });
  } catch (error) {
    console.error("Error deleting media request:", error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getUploaderPaymentDetails(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Please provide a valid media request ID." });
    }

    const mediaRequest = await MediaRequest.findById(id).populate("report");
    if (!mediaRequest) {
      return res.status(404).json({ success: false, message: "We couldn't find the media request you're looking for." });
    }

    const report = await Report.findById(mediaRequest.report);
    if (!report) {
      return res.status(404).json({ success: false, message: "We couldn't find the report associated with this media request." });
    }

    const userId = report.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "This report doesn't have an associated user account." });
    }

    const paymentDetails = await PaymentDetails.findOne({ user: userId });
    if (!paymentDetails) {
      return res
        .status(404)
        .json({ success: false, message: "The report creator hasn't set up their payment details yet." });
    }

    return res.status(200).json({
      accountName: paymentDetails.accountName,
      bsb: paymentDetails.bsb,
      accountNumber: paymentDetails.accountNumber,
    });
  } catch (error) {
    console.error("Error fetching uploader payment details:", error);
    return res.status(500).json({ message: error.message });
  }
}
