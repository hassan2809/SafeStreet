import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { requestMedia } from "../../api/mediaRequestService";
import PDFExport from "./PdfExport";
import { toast } from "react-hot-toast";

const ReportsTable = ({
  reports,
  requestedReports,
  onRequestMedia,
  compact = false,
}) => {
  const [localRequestedReports, setLocalRequestedReports] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      inquiryText: "",
    },
  });

  useEffect(() => {
    setLocalRequestedReports(new Set(requestedReports));
  }, [requestedReports]);

  const openRequestModal = (report) => {
    setSelectedReport(report);
    reset({ inquiryText: "" }); // Reset form
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    if (!selectedReport) return;

    try {
      const reportId = selectedReport._id;

      await requestMedia(reportId, { inquiryText: data.inquiryText });

      setLocalRequestedReports((prev) => new Set([...prev, reportId]));

      if (onRequestMedia) {
        onRequestMedia(reportId);
      }

      setIsModalOpen(false);
      reset({ inquiryText: "" });
    } catch (error) {
      console.error("Error requesting media:", error.message);
      toast.error("Failed to request media. Please try again.");
    }
  };

  const getRiskScore = (report) => {
    const incidentWeights = {
      Speeding: 8,
      "Running Red Light": 9,
      "Reckless Driving": 10,
      Tailgating: 7,
      Other: 5,
    };

    const baseScore = incidentWeights[report.incidentType] || 5;
    const mediaBonus = report.hasDashcam ? 2 : 0;

    return Math.min(10, baseScore + mediaBonus);
  };

  const getRiskColor = (score) => {
    if (score >= 9) return "text-red-700 bg-red-100";
    if (score >= 7) return "text-orange-700 bg-orange-100";
    if (score >= 5) return "text-yellow-700 bg-yellow-100";
    return "text-green-700 bg-green-100";
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">
            {compact ? "Recent Reports" : "Driver Incident Reports"}
          </h3>
          {compact && (
            <p className="text-sm text-gray-500 mt-1">
              Showing the 5 most recent reports. View all in Report Search.
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Vehicle
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Location
                </th>
                <th scope="col" className="px-6 py-3">
                  Incident Type
                </th>
                {!compact && (
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                )}
                <th scope="col" className="px-6 py-3">
                  Media
                </th>
                {!compact && (
                  <th scope="col" className="px-6 py-3">
                    Risk Score
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={compact ? "7" : "8"}
                    className="p-6 text-center text-gray-500"
                  >
                    No reports found.
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
                  const riskScore = getRiskScore(report);
                  const riskColorClass = getRiskColor(riskScore);
                  const isRequested = localRequestedReports.has(report._id);

                  return (
                    <tr
                      key={report._id}
                      className="bg-white border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {report.vehicles[0].registration}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(report.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{report.location}</td>
                      <td className="px-6 py-4">{report.incidentType}</td>

                      {!compact && (
                        <td
                          className={`px-6 py-4 capitalize ${
                            report.status === "approved"
                              ? "text-green-700"
                              : report.status === "rejected"
                              ? "text-red-700"
                              : "text-yellow-700"
                          }`}
                        >
                          {report.status}
                        </td>
                      )}

                      <td className="px-6 py-4">
                        {report.hasDashcam ? (
                          <span className="text-gray-500">Available</span>
                        ) : (
                          <span className="text-gray-500">None</span>
                        )}
                      </td>

                      {!compact && (
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${riskColorClass}`}
                          >
                            {riskScore.toFixed(1)} / 10
                          </span>
                        </td>
                      )}

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end space-x-2">
                          {report.hasDashcam && !isRequested && (
                            <button
                              onClick={() => openRequestModal(report)}
                              disabled={isSubmitting}
                              className={`px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition ${
                                isSubmitting
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              Request Media
                            </button>
                          )}

                          {report.hasDashcam && isRequested && (
                            <span className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                              Requested
                            </span>
                          )}

                          <button
                            onClick={() =>
                              PDFExport.downloadReportAsPDF(report)
                            }
                            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition"
                          >
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!compact && reports.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {reports.length} reports
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Media Request Modal */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 transition-opacity">
              <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={() => setIsModalOpen(false)}
              ></div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Request Footage Access
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isSubmitting}
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Please provide details about why you're requesting access
                      to this footage. This will help process your request
                      faster.
                    </p>

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div>
                          <span className="font-medium text-gray-700">
                            Vehicle:
                          </span>
                          <span className="ml-2">
                            {selectedReport.vehicles[0].registration}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Date:
                          </span>
                          <span className="ml-2">
                            {new Date(selectedReport.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium text-gray-700">
                            Location:
                          </span>
                          <span className="ml-2">
                            {selectedReport.location}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium text-gray-700">
                            Incident:
                          </span>
                          <span className="ml-2">
                            {selectedReport.incidentType}
                          </span>
                        </div>
                      </div>

                      <label className="block text-sm font-medium text-gray-700">
                        Reason for Request *
                      </label>
                      <textarea
                        rows="4"
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors.inquiryText ? "border-red-500" : ""
                        }`}
                        placeholder="Please explain why you need access to this footage (e.g., insurance claim, legal case, safety investigation)"
                        {...register("inquiryText", {
                          required: "Please provide a reason for this request",
                          minLength: {
                            value: 10,
                            message: "Please provide at least 10 characters",
                          },
                        })}
                      />
                      {errors.inquiryText && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.inquiryText.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportsTable;
