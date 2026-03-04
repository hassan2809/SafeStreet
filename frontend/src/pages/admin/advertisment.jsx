import { useState, useEffect } from "react";
import { uploadAd, getActiveAds, deleteAd } from "../../api/adsService";
import { X, Plus, Trash, UploadCloud, FileText } from "lucide-react";
import { Loader } from "lucide-react";
import { toast } from "react-hot-toast";

const Advertisement = () => {
  const [ads, setAds] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expiryDate: "",
    mediaType: "image",
    link: "",
  });

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const fetchAds = async () => {
    try {
      const data = await getActiveAds();
      setAds(data);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (formData.mediaType === "image" && !isImage) {
      setFileError("Please upload a valid image file (JPG, PNG, GIF).");
      return;
    }

    if (formData.mediaType === "video" && !isVideo) {
      setFileError("Please upload a valid video file (MP4, MOV, AVI).");
      return;
    }

    setFileError(""); // Clear previous error if the file is valid
    setSelectedFile(file);

    // Create preview for images
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null); // No preview for videos
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    // Reset the file input
    const fileInput = document.getElementById("adUpload");
    if (fileInput) fileInput.value = "";
  };

  const [isUploading, setIsUploading] = useState(false);

  // Update your handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !selectedFile || !formData.expiryDate) {
      toast.error("Title, media file, and expiry date are required.");
      return;
    }

    const adData = new FormData();
    adData.append("title", formData.title);
    adData.append("description", formData.description);
    adData.append("expiryDate", formData.expiryDate);
    adData.append("mediaType", formData.mediaType);
    adData.append("link", formData.link);
    adData.append("files", selectedFile); // Upload file to Cloudinary

    setIsUploading(true);

    try {
      await uploadAd(adData);
      fetchAds();
      setIsOpen(false);
      setSelectedFile(null);
      setFilePreview(null);
      // Reset form data
      setFormData({
        title: "",
        description: "",
        expiryDate: "",
        mediaType: "image",
        link: "",
      });
    } catch (error) {
      console.error("Error uploading ad:", error);
      toast.error("Failed to upload advertisement. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Advertisement Management
      </h2> */}

      {/* Create Ad Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        <Plus className="mr-2 w-5 h-5" />
        Upload Advertisement
      </button>

      {/* Advertisement List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {ads.map((ad) => (
          <div key={ad._id} className="p-4 bg-white shadow rounded-lg">
            <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold">{ad.title}</h3>
              <p className="text-sm text-gray-600">{ad.description}</p>
              <p className="text-xs text-gray-500">
                Expiry: {new Date(ad.expiryDate).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-2">
              <button
                onClick={() => deleteAd(ad._id).then(() => fetchAds())}
                className="text-red-500 hover:text-red-700 mx-2"
                title="Delete advertisement"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
            </div>
            {ad.mediaType === "image" ? (
              <img
                src={ad.mediaUrl}
                alt="Ad"
                className="mt-2 rounded-lg w-full h-40 object-cover"
              />
            ) : (
              <video controls className="mt-2 rounded-lg w-full h-40">
                <source src={ad.mediaUrl} type="video/mp4" />
              </video>
            )}
            {ad.link && (
              <a
                href={ad.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 block"
              >
                Visit Ad Link
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto p-4"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-full overflow-y-auto">
            <div className="flex justify-between items-center bg-white pb-4">
              <h3 className="text-lg font-bold">Upload Advertisement</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-100 p-1 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Advertisement title"
                  className="w-full p-2 border rounded"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Add a description"
                  className="w-full p-2 border rounded"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  required
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media Type
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.mediaType}
                  onChange={(e) => {
                    setFormData({ ...formData, mediaType: e.target.value });
                    // Reset selected file when changing media type
                    if (selectedFile) {
                      removeSelectedFile();
                    }
                  }}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="w-full p-2 border rounded"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                />
              </div>

              {/* File Upload with Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload {formData.mediaType === "image" ? "Image" : "Video"}
                </label>

                {!selectedFile ? (
                  <div
                    className="border-dashed border-2 border-gray-400 p-6 text-center rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => document.getElementById("adUpload").click()}
                  >
                    <UploadCloud className="mx-auto text-gray-500 w-10 h-10" />
                    <p className="text-sm text-gray-500 mt-2">
                      Click or drag to upload{" "}
                      {formData.mediaType === "image" ? "an image" : "a video"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formData.mediaType === "image"
                        ? "Allowed: JPG, PNG, GIF"
                        : "Allowed: MP4, MOV, AVI"}
                    </p>
                    <input
                      type="file"
                      id="adUpload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept={
                        formData.mediaType === "image" ? "image/*" : "video/*"
                      }
                    />
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {filePreview ? (
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <FileText className="w-10 h-10 text-gray-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="text-gray-500 hover:text-red-500 hover:bg-gray-100 p-1 rounded-full transition-colors"
                        title="Remove file"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {fileError && (
                  <p className="text-red-500 text-xs mt-1">{fileError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUploading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Advertisement"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Advertisement;
