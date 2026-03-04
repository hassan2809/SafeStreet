import * as adsService from "../services/advertisement.service.js";
import Advertisement from "../models/advertisement.model.js";

// ✅ Get all active advertisements
export const fetchActiveAds = async (req, res) => {
  try {
    const ads = await adsService.getActiveAdvertisements();
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
};

// ✅ Create a new advertisement
export const uploadAdvertisement = async (req, res) => {
  try {
    const { title, description, expiryDate, mediaType, link } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "Please upload at least one media file to create an advertisement." });
    }

    const newAd = new Advertisement({
      title,
      description,
      mediaUrl: req.files[0].path, // Single file upload (Cloudinary URL)
      mediaType,
      link,
      expiryDate,
      active: true,
    });

    await newAd.save();
    res.status(201).json({ message: "Advertisement uploaded successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
};


// ✅ Update an advertisement
export const modifyAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAd = await adsService.updateAdvertisement(id, req.body);
    res.status(200).json(updatedAd);
  } catch (error) {
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
};

// ✅ Delete an advertisement
export const removeAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    await adsService.deleteAdvertisement(id);
    res.status(200).json({ message: "Advertisement deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "We're experiencing technical difficulties. Please try again later." });
  }
};
