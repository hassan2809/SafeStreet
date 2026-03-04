import React, { useState, useEffect } from "react";
import { getUserReports, filterReports } from "../../api/reportService";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  FileText,
  ClipboardList,
  Car,
  Info,
  Search,
  Filter,
  Clock,
  Edit,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Mail,
  Camera,
  CheckSquare,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import EditReportForm from "../../components/forms/EditReportForm";

const UserDashboard = () => {
  const [allReports, setAllReports] = useState([]); // Stores all reports (unfiltered)
  const [reports, setReports] = useState([]); // Stores filtered reports
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isEditingReport, setIsEditingReport] = useState(false);

  // Fetch reports on mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserReports();
      setAllReports(data); // Store all user reports
      setReports(data); // Initially set filtered reports to all reports
    } catch (err) {
      setError(err.error || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  // ✅ Filtering Logic
  const [filters, setFilters] = useState({
    status: "",
    incidentType: "",
    mediaFlag: "",
    startDate: "",
    endDate: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const applyFilters = () => {
    let filtered = [...allReports]; // Use unfiltered data as base

    // Apply search query first (across multiple fields)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (report) =>
          (report.location && report.location.toLowerCase().includes(query)) ||
          (report.incidentType &&
            report.incidentType.toLowerCase().includes(query)) ||
          (report.description &&
            report.description.toLowerCase().includes(query)) ||
          (report.suburb && report.suburb.toLowerCase().includes(query)) ||
          (report.vehicles &&
            report.vehicles.some(
              (v) =>
                (v.registration &&
                  v.registration.toLowerCase().includes(query)) ||
                (v.make && v.make.toLowerCase().includes(query)) ||
                (v.model && v.model.toLowerCase().includes(query))
            ))
      );
    }

    if (filters.status) {
      filtered = filtered.filter((report) => report.status === filters.status);
    }
    if (filters.incidentType) {
      filtered = filtered.filter(
        (report) => report.incidentType === filters.incidentType
      );
    }
    if (filters.mediaFlag) {
      const mediaBool = filters.mediaFlag === "true";
      filtered = filtered.filter((report) => report.mediaFlag === mediaBool);
    }
    if (filters.startDate) {
      filtered = filtered.filter(
        (report) => new Date(report.date) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (report) => new Date(report.date) <= new Date(filters.endDate)
      );
    }

    setReports(filtered); // Update reports with filtered data
  };

  // Apply filters whenever searchQuery or filters change
  useEffect(() => {
    applyFilters();
  }, [searchQuery]); // Only auto-apply for search, use button for other filters

  const resetFilters = () => {
    setFilters({
      status: "",
      incidentType: "",
      mediaFlag: "",
      startDate: "",
      endDate: "",
    });
    setSearchQuery("");
    setReports(allReports); // Reset reports to original fetched list
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          label: "Pending",
        };
      case "approved":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-green-100 text-green-800 border-green-200",
          label: "Approved",
        };
      case "rejected":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "bg-red-100 text-red-800 border-red-200",
          label: "Rejected",
        };
      default:
        return {
          icon: <Info className="h-4 w-4" />,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Unknown",
        };
    }
  };

  const formatReportDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search bar */}
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search reports..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Expandable Filters */}
        {isFilterExpanded && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Filter Reports</CardTitle>
              <CardDescription>
                Narrow down your reports using filters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      handleFilterChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Incident Type</Label>
                  <Select
                    value={filters.incidentType}
                    onValueChange={(value) =>
                      handleFilterChange("incidentType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All incidents" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Collision">Collision</SelectItem>
                      <SelectItem value="Excessive Speed">Road Rage</SelectItem>
                      <SelectItem value="Hoon Driving (Including burnouts, racing)">
                        Hoon Driving (Including burnouts, racing)
                      </SelectItem>
                      <SelectItem value="Tailgating">Tailgating</SelectItem>
                      <SelectItem value="Dangerous/Reckless Driving">
                        Dangerous/Reckless Driving
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Media File</Label>
                  <Select
                    value={filters.mediaFlag}
                    onValueChange={(value) =>
                      handleFilterChange("mediaFlag", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All media" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
              <Button onClick={applyFilters}>Apply Filters</Button>
            </CardFooter>
          </Card>
        )}

        {/* Status Message */}
        {loading && (
          <div className="flex justify-center my-12">
            <div className="flex items-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
              <span className="text-gray-600">Loading reports...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Error:</span> {error}
            </div>
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No reports found
            </h3>
            <p className="mt-2 text-gray-500">
              No reports match your current filters. Try adjusting your search
              or filters.
            </p>

            {(searchQuery || Object.values(filters).some((v) => v !== "")) && (
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Reports List */}
        {!loading && reports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => {
              const { icon, color } = getStatusDetails(report.status);
              const vehicleInfo = report.vehicles && report.vehicles[0];

              return (
                <Card
                  key={report._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openModal(report)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`${color} capitalize flex items-center gap-1`}
                        variant="outline"
                      >
                        {icon}
                        {report.status}
                      </Badge>

                      <div className="text-xs text-gray-500">
                        {formatReportDate(report.date)}
                      </div>
                    </div>
                    <CardTitle className="mt-2 text-lg">
                      {report.incidentType}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span className="line-clamp-1">{report.location}</span>
                      </div>

                      {vehicleInfo && (
                        <div className="flex items-start text-sm text-gray-600">
                          <Car className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>
                            {vehicleInfo.registration ? (
                              <span className="font-medium">
                                {vehicleInfo.registration}
                              </span>
                            ) : (
                              <span>
                                {[vehicleInfo.make, vehicleInfo.model]
                                  .filter(Boolean)
                                  .join(" ") || "Vehicle info not provided"}
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-1 flex items-center text-xs text-indigo-600">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    View details
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-indigo-600" />
                    Report Details
                  </DialogTitle>
                  <Badge
                    className={`${
                      getStatusDetails(selectedReport.status).color
                    } flex items-center gap-1 mr-4`}
                    variant="outline"
                  >
                    {getStatusDetails(selectedReport.status).icon}
                    {getStatusDetails(selectedReport.status).label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Submitted on{" "}
                  {new Date(selectedReport.createdAt).toLocaleDateString()} at{" "}
                  {new Date(selectedReport.createdAt).toLocaleTimeString()}
                </p>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
                  <TabsTrigger value="reporter">Reporter</TabsTrigger>
                  <TabsTrigger value="evidence">Evidence</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent
                  value="details"
                  className="p-4 border rounded-md mt-4"
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 text-indigo-700 mb-3">
                        <Info className="h-5 w-5" />
                        Incident Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Incident Type</p>
                          <p className="font-medium">
                            {selectedReport.incidentType}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Vehicle Type</p>
                          <p className="font-medium">
                            {selectedReport.vehicleType}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Incident Date</p>
                          <p className="font-medium">
                            {formatReportDate(selectedReport.date)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Report ID</p>
                          <p className="font-medium text-xs text-gray-600">
                            {selectedReport.customId}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 text-indigo-700 mb-3">
                        <MapPin className="h-5 w-5" />
                        Location Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                        <div className="space-y-1 md:col-span-2">
                          <p className="text-sm text-gray-500">
                            Street Address
                          </p>
                          <p className="font-medium">
                            {selectedReport.location}
                          </p>
                        </div>

                        {selectedReport.crossStreet && (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                              Cross Street
                            </p>
                            <p className="font-medium">
                              {selectedReport.crossStreet}
                            </p>
                          </div>
                        )}

                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Suburb</p>
                          <p className="font-medium">{selectedReport.suburb}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">State</p>
                          <p className="font-medium">{selectedReport.state}</p>
                        </div>
                      </div>
                    </div>

                    {selectedReport.description && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2 text-indigo-700 mb-3">
                            <FileText className="h-5 w-5" />
                            Incident Description
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-gray-700 whitespace-pre-wrap">
                              {selectedReport.description ||
                                "No description provided."}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                {/* Vehicle Tab */}
                <TabsContent
                  value="vehicle"
                  className="p-4 border rounded-md mt-4"
                >
                  {selectedReport.vehicles &&
                  selectedReport.vehicles.length > 0 ? (
                    <div className="space-y-6">
                      {selectedReport.vehicles.map((vehicle, idx) => (
                        <div
                          key={vehicle._id || idx}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <h3 className="font-medium text-lg text-indigo-700 mb-4 flex items-center gap-2">
                            <Car className="h-5 w-5" />
                            Vehicle {idx + 1} Details
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">
                                Registration
                              </p>
                              <p className="font-medium text-indigo-700">
                                {vehicle.registration || "Not provided"}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">
                                Registration State
                              </p>
                              <p className="font-medium">
                                {vehicle.registrationState}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Make</p>
                              <p className="font-medium">
                                {vehicle.make || "Not provided"}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Model</p>
                              <p className="font-medium">
                                {vehicle.model || "Not provided"}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Body Type</p>
                              <p className="font-medium">{vehicle.bodyType}</p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">
                                Registration Visible on Dashcam
                              </p>
                              <p className="font-medium">
                                {vehicle.isRegistrationVisible}
                              </p>
                            </div>
                          </div>

                          {vehicle.identifyingFeatures && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-500 mb-1">
                                Identifying Features
                              </p>
                              <p className="text-gray-700 bg-white p-3 rounded-md">
                                {vehicle.identifyingFeatures}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">
                      No vehicle information available
                    </p>
                  )}
                </TabsContent>

                {/* Reporter Tab */}
                <TabsContent
                  value="reporter"
                  className="p-4 border rounded-md mt-4"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2 text-indigo-700 mb-3">
                      <User className="h-5 w-5" />
                      Reporter Details
                    </h3>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <User className="h-4 w-4" />
                            Name
                          </div>
                          <p className="font-medium">{selectedReport.name}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Mail className="h-4 w-4" />
                            Email
                          </div>
                          <p className="font-medium">{selectedReport.email}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Phone className="h-4 w-4" />
                            Phone
                          </div>
                          <p className="font-medium">{selectedReport.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Evidence Tab */}
                <TabsContent
                  value="evidence"
                  className="p-4 border rounded-md mt-4"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2 text-indigo-700 mb-3">
                      <Camera className="h-5 w-5" />
                      Dashcam Evidence
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        {selectedReport.hasDashcam ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <p className="text-sm text-gray-500">
                            Dashcam Footage
                          </p>
                          <p className="font-medium">
                            {selectedReport.hasDashcam
                              ? "Available"
                              : "Not Available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedReport.hasAudio ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <p className="text-sm text-gray-500">
                            Audio Recording
                          </p>
                          <p className="font-medium">
                            {selectedReport.hasAudio
                              ? "Available"
                              : "Not Available"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mt-6">
                      <div className="flex items-start gap-2">
                        {selectedReport.canProvideFootage ? (
                          <CheckSquare className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <CheckSquare className="h-5 w-5 text-gray-300 flex-shrink-0" />
                        )}
                        <p className="text-gray-700">
                          Reporter confirmed they can provide footage if
                          requested
                        </p>
                      </div>

                      <div className="flex items-start gap-2">
                        {selectedReport.acceptTerms ? (
                          <CheckSquare className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <CheckSquare className="h-5 w-5 text-gray-300 flex-shrink-0" />
                        )}
                        <p className="text-gray-700">
                          Reporter accepted terms and conditions
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div>
                {selectedReport && selectedReport.status === "rejected" && (
                  <>
                    <p className="text-sm text-gray-600 mb-2">
                      This report was rejected due to insufficient or incorrect
                      information. You may update the report to provide
                      additional details and resubmit it for review.
                    </p>
                  </>
                )}

                <div className="flex justify-between items-center">
                  {selectedReport?.status === "rejected" && (
                    <Button
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      onClick={() => {
                        setIsModalOpen(false);
                        setIsEditingReport(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Report
                    </Button>
                  )}

                  <Button onClick={() => setIsModalOpen(false)}>Close</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Report Modal */}
      {isEditingReport && selectedReport && (
        <>
          <Dialog open={isEditingReport} onOpenChange={setIsEditingReport}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <Edit className="h-5 w-5 text-amber-600" />
                  Edit Rejected Report
                </DialogTitle>
              </DialogHeader>

              <EditReportForm
                reportToEdit={selectedReport}
                onSuccess={() => {
                  setIsEditingReport(false);
                  fetchReports();
                }}
                onCancel={() => setIsEditingReport(false)}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
