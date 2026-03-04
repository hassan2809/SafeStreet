import { useEffect, useState } from "react";
import {
  BarChart,
  FileText,
  Activity,
  Menu,
  LogOut,
  X,
  Video,
  Shield,
  User2,
} from "lucide-react";
import Advertisement from "./advertisment";
import OverviewDashboard from "./OverviewDashboard";
import UserManagement from "./UserManagement";
import ReportModeration from "./ReportModeration";
import useAuthStore from "../../store/authStore";
import UserIcon from "../../assets/svgs/UserIcon";
import MediaAccessManagement from "./MediaAccessManagement";
import UserProfile from "../UserProfile";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [userName, setUserName] = useState("");
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const isSuperAdmin = user?.role === "super-admin";

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <Activity className="w-5 h-5" />,
      allowedRoles: ["super-admin", "admin"],
    },
    {
      id: "users",
      label: "User Management",
      icon: <Shield className="w-5 h-5" />,
      allowedRoles: ["super-admin"],
    },
    {
      id: "reports",
      label: "Report Moderation",
      icon: <FileText className="w-5 h-5" />,
      allowedRoles: ["super-admin", "admin"],
    },
    {
      id: "media",
      label: "Media Access Management",
      icon: <Video className="w-5 h-5" />,
      allowedRoles: ["super-admin", "admin"],
    },
    {
      id: "ads",
      label: "Advertisement",
      icon: <BarChart className="w-5 h-5" />,
      allowedRoles: ["super-admin", "admin"],
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User2 className="w-5 h-5" />,
      allowedRoles: ["super-admin", "admin"],
    },
  ].filter((item) => item.allowedRoles.includes(user?.role));

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewDashboard />;
      case "users":
        return isSuperAdmin ? <UserManagement /> : <div>Access Denied</div>;
      case "reports":
        return <ReportModeration />;
      case "ads":
        return <Advertisement />;
      case "media":
        return <MediaAccessManagement />;
      case "revenue":
        return <RevenueDashboard />;
      case "profile":
        return <UserProfile />;
      default:
        return <OverviewDashboard />;
    }
  };

  const handleContentClick = () => {
    if (sidebarOpen && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (user?.fullName) {
      setUserName(user.fullName);
    } else {
      setUserName("User");
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-gray-800 transition duration-300 transform 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:inset-0
        `}
      >
        <div className="flex items-center justify-between h-16 bg-gray-900 px-4">
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg">
              Admin Dashboard
            </span>
            <span className="text-gray-300 text-xs capitalize">
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </span>
          </div>
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col flex-grow">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors w-full ${
                  activeTab === item.id
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                className="p-1 mr-3 text-gray-500 rounded-full hover:bg-gray-100 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h1>
              {isSuperAdmin && (
                <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                  Super Admin
                </span>
              )}
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2"
                >
                  <UserIcon
                    size={24}
                    className="text-gray-700 cursor-pointer"
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md overflow-hidden">
                    <div className="px-4 py-2 border-b">
                      <h1 className="font-medium capitalize">
                        Hi, {userName || "User"}
                      </h1>
                      <p className="text-xs text-gray-500 capitalize">
                        {user?.role?.replace("-", " ")}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab("profile");
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <User2 size={16} className="mr-2" /> Profile
                    </button>
                    <button
                      onClick={logout}
                      className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main
          className="flex-1 overflow-y-auto bg-gray-100"
          onClick={handleContentClick}
        >
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
