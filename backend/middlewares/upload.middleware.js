import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./../config/cloudinary.config.js";

// Function to create storage dynamically
const getStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folder, // Dynamic folder name
      allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "mov", "avi"],
      resource_type: "auto", // Supports both images and videos
    },
  });

// Multer instance with dynamic storage
const getUploadMiddleware = (folder, maxFiles = 10, maxSizeMB = 10) =>
  multer({
    storage: getStorage(folder),
    limits: { fileSize: maxSizeMB * 1024 * 1024 }, // Max file size (MB)
  }).array("files", maxFiles);

// Middleware function
const handleUpload = (folder, maxFiles = 10, maxSizeMB = 50) => {
  return (req, res, next) => {
    const upload = getUploadMiddleware(folder, maxFiles, maxSizeMB);
    upload(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: `We're having trouble uploading your files. ${error.message}. Please try again.`,
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "Please select at least one file to upload." });
      }

      next();
    });
  };
};

export default handleUpload;
