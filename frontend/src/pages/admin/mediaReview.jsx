import { useState, useEffect } from "react";
import { getAllUploadedMedia } from "../../api/mediaRequestService"; // Ensure this is the correct import path

const AdminMediaReview = () => {
  const [mediaRequests, setMediaRequests] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchMediaRequests = async () => {
      setIsLoading(true);
      try {
        const mediaData = await getAllUploadedMedia(); // Ensure this returns correct data
        setMediaRequests(mediaData);
      } catch (error) {
        console.error("Error fetching media requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaRequests();
  }, []);

  const handleViewMedia = (media) => {
    setSelectedMedia(media);
    setCurrentSlide(0); // Reset to first slide
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const nextSlide = () => {
    if (currentSlide < selectedMedia.mediaUrls.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Media Review</h2>

      {isLoading ? (
        <p className="text-gray-500 text-center">Loading media requests...</p>
      ) : mediaRequests.length === 0 ? (
        <p className="text-gray-500 text-center">
          No media requests to review.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaRequests.map((mediaRequest) => (
            <div
              key={mediaRequest._id}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <h5 className="mb-2 text-xl font-bold text-gray-900">
                Incident Type: {mediaRequest.report.incidentType}
              </h5>
              <p className="mb-3 text-sm text-gray-600">
                Vehicle Registration:{" "}
                <span className="font-medium">
                  {mediaRequest.report.vehicleRegistration}
                </span>
              </p>
              <p className="mb-3 text-sm text-gray-600">
                Location:{" "}
                <span className="font-medium">
                  {mediaRequest.report.location}
                </span>
              </p>
              <p className="mb-3 text-sm text-gray-600">
                Description:{" "}
                <span className="font-medium">
                  {mediaRequest.report.description}
                </span>
              </p>
              <button
                onClick={() => handleViewMedia(mediaRequest)}
                className="flex bg-gray-800 hover:bg-gray-700 text-white text-base px-3 py-2 outline-none rounded w-max cursor-pointer"
              >
                View Media
              </button>
            </div>
          ))}
        </div>
      )}

      {/* View Media Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-[50%]">
            <h3 className="text-xl font-bold text-gray-700 mb-4">View Media</h3>

            {/* Carousel for images/videos */}
            <div
              id="default-carousel"
              className="relative w-full"
              data-carousel="slide"
            >
              <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                {selectedMedia.mediaUrls.map((media, index) => (
                  <div
                    key={index}
                    className={`duration-700 ease-in-out ${
                      index === currentSlide ? "block" : "hidden"
                    }`}
                    data-carousel-item
                  >
                    {media.includes("image") ? (
                      <img
                        src={media}
                        alt="media"
                        className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                      />
                    ) : media.includes("video") ? (
                      <video
                        controls
                        className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                      >
                        <source src={media} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-red-600">
                        Unsupported media type
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Slider controls */}
              <button
                type="button"
                onClick={prevSlide}
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                  <svg
                    className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path stroke="currentColor" d="M5 1 1 5l4 4" />
                  </svg>
                  <span className="sr-only">Previous</span>
                </span>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                  <svg
                    className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path stroke="currentColor" d="m1 9 4-4-4-4" />
                  </svg>
                  <span className="sr-only">Next</span>
                </span>
              </button>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMediaReview;
