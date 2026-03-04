import React, { useState } from "react";

const MediaAccessManagement = ({ mediaRequests = [] }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const approvedMediaRequests = mediaRequests.filter(
    (request) => request.status === "approved"
  );

  const handleMediaSelect = (media) => {
    setSelectedMedia(media);
  };

  const closeMediaViewer = () => {
    setSelectedMedia(null);
  };

  const getMediaType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    const videoFormats = ["mp4", "mov", "avi", "wmv", "mkv"];

    if (videoFormats.includes(extension)) {
      return "video";
    } else {
      return "image";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Requested Media</h2>
        <p className="text-sm text-gray-500">
          View media files you've requested for incident reports
        </p>
      </div>

      {approvedMediaRequests.length === 0 ? (
        <div className="p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No Approved Media Files Found
          </h3>
          <p className="mt-1 text-gray-500">
            You don't have any approved media files yet.
          </p>
        </div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedMediaRequests.map((request) => (
              <div
                key={request._id}
                className="bg-gray-50 rounded-lg overflow-hidden border"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {request.report.vehicles &&
                        request.report.vehicles.length > 0
                          ? request.report.vehicles[0].registration
                          : "Unknown Registration"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {request.report.incidentType} -{" "}
                        {formatDate(request.report.date)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {request.report.location}, {request.report.suburb},{" "}
                        {request.report.state}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === "uploaded"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Media Display Section */}
                <div className="p-4">
                  <div className="flex justify-center">
                    {request.mediaUrls.map((mediaUrl, index) => {
                      const mediaType = getMediaType(mediaUrl);
                      return (
                        <div
                          key={index}
                          className="relative overflow-hidden bg-gray-200 rounded-lg h-48 w-full cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() =>
                            handleMediaSelect({
                              url: mediaUrl,
                              type: mediaType,
                            })
                          }
                        >
                          {mediaType === "image" ? (
                            <img
                              src={mediaUrl}
                              alt={`Evidence from ${
                                request.report.vehicles
                                  ? request.report.vehicles[0].registration
                                  : "incident"
                              }`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
                              <div className="absolute inset-0 bg-black opacity-50"></div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-white z-10"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 text-center">
                            {mediaType.charAt(0).toUpperCase() +
                              mediaType.slice(1)}{" "}
                            {index + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    <p>Requested on: {formatDate(request.createdAt)}</p>
                    {request.inquiryText && (
                      <p className="mt-2">
                        <span className="font-medium">Inquiry note:</span>{" "}
                        {request.inquiryText}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full h-[90vh] max-h-screen flex flex-col">
            <button
              onClick={closeMediaViewer}
              className="absolute top-2 right-2 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-300 z-10 shadow-lg"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="bg-white rounded-lg overflow-hidden shadow-xl flex flex-col h-full">
              <div className="bg-gray-100 p-3 text-center border-b">
                <h3 className="text-lg font-semibold">Media Preview</h3>
              </div>

              <div className="flex-1 flex justify-center items-center bg-gray-900 overflow-hidden min-h-0">
                {selectedMedia.type === "image" ? (
                  <img
                    src={selectedMedia.url}
                    alt="Evidence media"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <video controls className="max-w-full max-h-full">
                    <source src={selectedMedia.url} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              <div className="p-4 bg-white border-t">
                <a
                  href={selectedMedia.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download {selectedMedia.type}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaAccessManagement;
