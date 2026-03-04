import { useEffect, useState } from "react";
import { getUserReportStats } from "../../api/reportService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Car,
  Mail,
  Phone,
  User,
  FileText,
  Camera,
  Info,
  CheckSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const ReportsStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getUserReportStats();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Calculate percentage for progress bar
    const calculatePercentage = () => {
        if (!stats) return 0;
        const total = stats.totalReports || 1; // Avoid division by zero
        return Math.round((stats.approvedReports / total) * 100);
    };

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Your Report Statistics
            </h2>

            {loading ? (
                <StatsLoading />
            ) : error ? (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                        <p className="text-red-600">Error loading statistics: {error}</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard 
                            title="Total Reports" 
                            value={stats.totalReports} 
                            icon={<AlertTriangle className="h-5 w-5" />}
                            color="indigo"
                        />
                        <StatCard 
                            title="Pending Review" 
                            value={stats.pendingReports} 
                            icon={<Clock className="h-5 w-5" />}
                            color="amber"
                        />
                        <StatCard 
                            title="Approved Reports" 
                            value={stats.approvedReports} 
                            icon={<CheckCircle className="h-5 w-5" />}
                            color="emerald"
                        />
                    </div>
                    
                    {/* Latest Report Card */}
                    {stats.latestReport && (
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-5 w-5" />
                                        <CardTitle className="text-lg font-medium">Latest Report Details</CardTitle>
                                    </div>
                                    <StatusBadge status={stats.latestReport.status} variant="whiteOutline" />
                                </div>
                                <CardDescription className="text-white/80 mt-1">
                                    Submitted on {new Date(stats.latestReport.createdAt).toLocaleDateString()} at {new Date(stats.latestReport.createdAt).toLocaleTimeString()}
                                </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="p-0">
                                <Tabs defaultValue="summary" className="w-full">
                                    <TabsList className="w-full border-b rounded-none justify-start h-12 bg-gray-50 px-4">
                                        <TabsTrigger value="summary" className="data-[state=active]:bg-background">Summary</TabsTrigger>
                                        <TabsTrigger value="reporter" className="data-[state=active]:bg-background">Reporter Info</TabsTrigger>
                                        <TabsTrigger value="vehicle" className="data-[state=active]:bg-background">Vehicle</TabsTrigger>
                                        <TabsTrigger value="evidence" className="data-[state=active]:bg-background">Evidence</TabsTrigger>
                                    </TabsList>
                                    
                                    {/* Summary Tab */}
                                    <TabsContent value="summary" className="p-6 m-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h3 className="font-medium text-gray-800 flex items-center">
                                                    <Info className="h-4 w-4 mr-2 text-indigo-500" />
                                                    Incident Information
                                                </h3>
                                                <div className="space-y-3">
                                                    <InfoItem 
                                                        icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
                                                        label="Incident Type"
                                                        value={stats.latestReport.incidentType}
                                                    />
                                                    <InfoItem 
                                                        icon={<Car className="h-4 w-4 text-gray-500" />}
                                                        label="Vehicle Type"
                                                        value={stats.latestReport.vehicleType}
                                                    />
                                                    <InfoItem 
                                                        icon={<Calendar className="h-4 w-4 text-indigo-500" />}
                                                        label="Incident Date"
                                                        value={new Date(stats.latestReport.date).toLocaleDateString()}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <h3 className="font-medium text-gray-800 flex items-center">
                                                    <MapPin className="h-4 w-4 mr-2 text-rose-500" />
                                                    Location Details
                                                </h3>
                                                <div className="space-y-3">
                                                    <InfoItem 
                                                        label="Street Address"
                                                        value={stats.latestReport.location}
                                                    />
                                                    {stats.latestReport.crossStreet && (
                                                        <InfoItem 
                                                            label="Cross Street"
                                                            value={stats.latestReport.crossStreet}
                                                        />
                                                    )}
                                                    <InfoItem 
                                                        label="Suburb"
                                                        value={stats.latestReport.suburb}
                                                    />
                                                    <InfoItem 
                                                        label="State"
                                                        value={stats.latestReport.state}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {stats.latestReport.description && (
                                            <div className="mt-6">
                                                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                                                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                                    Incident Description
                                                </h3>
                                                <p className="text-gray-700 bg-gray-50 p-4 rounded-md">
                                                    {stats.latestReport.description || "No description provided."}
                                                </p>
                                            </div>
                                        )}
                                    </TabsContent>
                                    
                                    {/* Reporter Info Tab */}
                                    <TabsContent value="reporter" className="p-6 m-0">
                                        <div className="space-y-4">
                                            <h3 className="font-medium text-gray-800 flex items-center">
                                                <User className="h-4 w-4 mr-2 text-indigo-500" />
                                                Reporter Details
                                            </h3>
                                            <div className="space-y-3">
                                                <InfoItem 
                                                    icon={<User className="h-4 w-4 text-gray-500" />}
                                                    label="Name"
                                                    value={stats.latestReport.name}
                                                />
                                                <InfoItem 
                                                    icon={<Mail className="h-4 w-4 text-gray-500" />}
                                                    label="Email"
                                                    value={stats.latestReport.email}
                                                />
                                                <InfoItem 
                                                    icon={<Phone className="h-4 w-4 text-gray-500" />}
                                                    label="Phone"
                                                    value={stats.latestReport.phone}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                    
                                    {/* Vehicle Tab */}
                                    <TabsContent value="vehicle" className="p-6 m-0">
                                        <div className="space-y-6">
                                            {stats.latestReport.vehicles.map((vehicle, idx) => (
                                                <div key={vehicle._id} className="bg-gray-50 p-4 rounded-lg">
                                                    <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                                                        <Car className="h-4 w-4 mr-2 text-indigo-500" />
                                                        Vehicle {idx + 1} Details
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InfoItem 
                                                            label="Registration"
                                                            value={vehicle.registration}
                                                            highlight={true}
                                                        />
                                                        <InfoItem 
                                                            label="Registration State"
                                                            value={vehicle.registrationState}
                                                        />
                                                        <InfoItem 
                                                            label="Make"
                                                            value={vehicle.make}
                                                        />
                                                        <InfoItem 
                                                            label="Model"
                                                            value={vehicle.model}
                                                        />
                                                        <InfoItem 
                                                            label="Body Type"
                                                            value={vehicle.bodyType}
                                                        />
                                                        <InfoItem 
                                                            label="Registration Visible"
                                                            value={vehicle.isRegistrationVisible}
                                                        />
                                                    </div>
                                                    {vehicle.identifyingFeatures && (
                                                        <div className="mt-4">
                                                            <p className="text-sm text-gray-500 mb-1">Identifying Features</p>
                                                            <p className="text-sm text-gray-700">
                                                                {vehicle.identifyingFeatures}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                    
                                    {/* Evidence Tab */}
                                    <TabsContent value="evidence" className="p-6 m-0">
                                        <div className="space-y-4">
                                            <h3 className="font-medium text-gray-800 flex items-center">
                                                <Camera className="h-4 w-4 mr-2 text-indigo-500" />
                                                Dashcam Evidence
                                            </h3>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                                                <div className="flex items-center space-x-2">
                                                    {stats.latestReport.hasDashcam ? (
                                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                                    )}
                                                    <p className="text-gray-700">
                                                        <span className="font-medium">Dashcam Footage:</span>{" "}
                                                        <span>{stats.latestReport.hasDashcam ? "Available" : "Not Available"}</span>
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    {stats.latestReport.hasAudio ? (
                                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                                    )}
                                                    <p className="text-gray-700">
                                                        <span className="font-medium">Audio:</span>{" "}
                                                        <span>{stats.latestReport.hasAudio ? "Available" : "Not Available"}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 space-y-3">
                                                <div className="flex items-start space-x-2">
                                                    {stats.latestReport.canProvideFootage ? (
                                                        <CheckSquare className="h-5 w-5 text-green-500 mt-0.5" />
                                                    ) : (
                                                        <CheckSquare className="h-5 w-5 text-gray-300 mt-0.5" />
                                                    )}
                                                    <p className="text-sm text-gray-700">
                                                        Can provide footage if requested
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-start space-x-2">
                                                    {stats.latestReport.acceptTerms ? (
                                                        <CheckSquare className="h-5 w-5 text-green-500 mt-0.5" />
                                                    ) : (
                                                        <CheckSquare className="h-5 w-5 text-gray-300 mt-0.5" />
                                                    )}
                                                    <p className="text-sm text-gray-700">
                                                        Accepted terms and conditions
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

const InfoItem = ({ icon, label, value, highlight = false }) => (
    <div className="flex items-start">
        {icon && <span className="mr-2 mt-0.5">{icon}</span>}
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-sm font-medium ${highlight ? "text-indigo-600" : "text-gray-900"}`}>
                {value || "N/A"}
            </p>
        </div>
    </div>
);

const StatCard = ({ title, value, icon, color }) => {
    // Dynamic color classes based on color prop
    const colorClasses = {
        indigo: {
            bg: "bg-indigo-50",
            text: "text-indigo-700",
            iconBg: "bg-indigo-100",
            iconText: "text-indigo-500",
            border: "border-indigo-200"
        },
        amber: {
            bg: "bg-amber-50",
            text: "text-amber-700",
            iconBg: "bg-amber-100",
            iconText: "text-amber-500",
            border: "border-amber-200"
        },
        emerald: {
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            iconBg: "bg-emerald-100",
            iconText: "text-emerald-500",
            border: "border-emerald-200"
        }
    };
    
    const classes = colorClasses[color] || colorClasses.indigo;
    
    return (
        <Card className={`${classes.bg} border-none shadow-sm`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <h3 className={`text-3xl font-bold ${classes.text} mt-1`}>{value}</h3>
                    </div>
                    <div className={`${classes.iconBg} p-3 rounded-full`}>
                        <div className={classes.iconText}>{icon}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
};

const StatusBadge = ({ status, variant = "default" }) => {
    const statusConfig = {
        approved: { 
            default: "bg-green-100 text-green-800 border-green-200",
            whiteOutline: "bg-green-500 text-white border-green-400 border-white/20"
        },
        pending: { 
            default: "bg-yellow-100 text-yellow-800 border-yellow-200",
            whiteOutline: "bg-yellow-500 text-white border-yellow-400 border-white/20"
        },
        rejected: { 
            default: "bg-red-100 text-red-800 border-red-200",
            whiteOutline: "bg-red-500 text-white border-red-400 border-white/20"
        }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const colorClass = config[variant] || config.default;
    
    const icons = {
        approved: <CheckCircle className="h-3 w-3 mr-1" />,
        pending: <Clock className="h-3 w-3 mr-1" />,
        rejected: <AlertCircle className="h-3 w-3 mr-1" />
    };
    
    return (
        <Badge className={`px-2 py-1 border ${colorClass} capitalize flex items-center`} variant="outline">
            {icons[status] || icons.pending}
            {status}
        </Badge>
    );
};

const StatsLoading = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <Card key={i}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-16" />
                            </div>
                            <Skeleton className="h-12 w-12 rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
        
        <Card>
            <CardHeader className="pb-2">
                <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-4 w-48 mt-2" />
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader className="bg-gray-50">
                <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);

export default ReportsStats;