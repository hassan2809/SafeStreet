import { useState, useEffect } from "react";
import { getAllReports } from "../../api/reportService";
import { fetchClientRequests } from "../../api/mediaRequestService";
import WelcomeBanner from "./WelcomeBanner";
import ReportsTable from "./ReportsTable";
import ReportSearch from "./ReportSearch";
import DataAnalytics from "./DataAnalytics";
import MediaAccessManagement from "./MediaAccessManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Search, 
  BarChart3, 
  Camera,
  Loader2 
} from "lucide-react";

const ClientDashboard = () => {
  const [reports, setReports] = useState([]);
  const [mediaRequests, setMediaRequests] = useState([]);
  const [filters, setFilters] = useState({
    vehicleRegistration: "",
    startDate: "",
    endDate: "",
    location: "",
    incidentType: "",
    status: "",
    hasMedia: false,
  });
  const [requestedReports, setRequestedReports] = useState(new Set());
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportsData, mediaRequestsData] = await Promise.all([
          getAllReports(),
          fetchClientRequests(),
        ]);
        const approvedReports = reportsData.filter(report => report.status === "approved");
        setReports(approvedReports);
        setMediaRequests(mediaRequestsData);

        const requestedIds = new Set(
          mediaRequestsData.map((req) => req.report._id)
        );
        setRequestedReports(requestedIds);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const filteredReports = reports.filter((report) => {
    const matchesVehicle =
      !filters.vehicleRegistration ||
      report.vehicles?.some(vehicle => 
        vehicle.registration?.toLowerCase().includes(filters.vehicleRegistration.toLowerCase())
      );

    const matchesDateRange =
      (!filters.startDate ||
        new Date(report.date) >= new Date(filters.startDate)) &&
      (!filters.endDate || 
        new Date(report.date) <= new Date(filters.endDate));

    const matchesLocation =
      !filters.location ||
      report.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
      report.suburb?.toLowerCase().includes(filters.location.toLowerCase()) ||
      report.state?.toLowerCase().includes(filters.location.toLowerCase());

    // Incident type filter
    const matchesIncidentType =
      !filters.incidentType || 
      report.incidentType === filters.incidentType;

    // Status filter
    const matchesStatus = 
      !filters.status || 
      report.status === filters.status;

    // Media filter - check hasDashcam field
    const matchesMedia = 
      !filters.hasMedia || 
      report.hasDashcam === true;

    return (
      matchesVehicle &&
      matchesDateRange &&
      matchesLocation &&
      matchesIncidentType &&
      matchesStatus &&
      matchesMedia
    );
  });

  const handleMediaRequest = (reportId) => {
    setRequestedReports(prev => new Set([...prev, reportId]));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-10"> 
        <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-6 py-4"> 
          {loading ? (
            <Card>
              <CardContent className="flex justify-center items-center h-64">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="text-gray-600">Loading dashboard...</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4"> 
              <Card className="shadow-sm">
                <CardContent className="p-4 w-full"> 
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger 
                      value="overview" 
                      className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="hidden sm:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reports"
                      className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                    >
                      <Search className="w-4 h-4" />
                      <span className="hidden sm:inline">Report Search</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="analytics"
                      className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Analytics</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="media"
                      className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                    >
                      <Camera className="w-4 h-4" />
                      <span className="hidden sm:inline">Media Access</span>
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>

              {/* Tab Content */}
              <TabsContent value="overview" className="space-y-4"> 
                <WelcomeBanner />
                <Card>
                  <CardContent className="p-4"> 
                    <div className="flex items-center justify-between mb-3"> 
                      <h3 className="text-lg font-semibold">Recent Reports</h3>
                      <Badge variant="outline">
                        Showing latest 5 reports
                      </Badge>
                    </div>
                    <ReportsTable
                      reports={filteredReports.slice(0, 5)}
                      requestedReports={requestedReports}
                      onRequestMedia={handleMediaRequest}
                      compact={true}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4"> 
                <Card>
                  <CardContent className="p-4"> 
                    <div className="mb-4"> 
                      <h3 className="text-lg font-semibold mb-2">Search & Filter Reports</h3>
                      <p className="text-sm text-gray-600">
                        Use the filters below to find specific incident reports
                      </p>
                    </div>
                    <ReportSearch
                      onFilterChange={handleFilterChange}
                      filters={filters}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4"> 
                    <div className="flex items-center justify-between mb-3"> 
                      <h3 className="text-lg font-semibold">Search Results</h3>
                      <Badge variant="outline">
                        {filteredReports.length} reports found
                      </Badge>
                    </div>
                    <ReportsTable
                      reports={filteredReports}
                      requestedReports={requestedReports}
                      onRequestMedia={handleMediaRequest}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4"> 
                <Card>
                  <CardContent className="p-4"> 
                    <div className="mb-4"> 
                      <h3 className="text-lg font-semibold mb-2">Data Analytics</h3>
                      <p className="text-sm text-gray-600">
                        Comprehensive insights and trends from your report data
                      </p>
                    </div>
                    <DataAnalytics reports={filteredReports} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="space-y-4"> 
                <Card>
                  <CardContent className="p-4"> 
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Media Access Management</h3>
                      <p className="text-sm text-gray-600">
                        Manage your media requests and access permissions
                      </p>
                    </div>
                    <MediaAccessManagement
                      mediaRequests={mediaRequests}
                      reports={reports.filter((r) => r.hasDashcam)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;