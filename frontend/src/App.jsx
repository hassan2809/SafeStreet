import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./Scrollbar.css";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/user/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Report from "./pages/user/Report";
import UserDashboard from "./pages/user/Dashboard";
import ClientDashboard from "./pages/client/dashboard";
import NotFound from "./pages/NotFound";
import RoleRedirect from "./routes/roleRedirect";
import MediaRequests from "./pages/user/MediaRequests";
import AdminMediaReview from "./pages/admin/mediaReview";
import Advertisement from "./pages/admin/advertisment";
import Homepage from "./pages/Home";

import UserProfile from "./pages/UserProfile";

import ProtectedRoute from "./routes/protectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OurPartner from "./pages/OurPartner";
import IncidentHeatMap from "./pages/IncidentHeatMap";
import ScrollToTop from "./components/layout/ScrollToTop";
import { Toaster } from "react-hot-toast";
import SiteLayout from "./components/layout/SiteLayout";
import TermsAndConditions from "./pages/TermsAndConditions";
import { useRoleVerification } from "./hooks/useRoleVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const AppContent = () => {
  const location = useLocation();
  
  // Initialize role verification
  useRoleVerification();
  
  const hideNavbarRoutes = [
    "/",
    "/login",
    "/signup",
    "/home",
    "/our-partners",
    "/incident-heatMap",
    "/terms",
    "/forgot-password",
    "/reset-password/:token",
  ];
  const isAdminRoute = location.pathname.startsWith("/admin");
  const shouldShowNavbar =
    !hideNavbarRoutes.includes(location.pathname) && !isAdminRoute;
  const noPaddingRoutes = [
    "/login",
    "/signup",
    "/home",
    "/incident-heatMap",
    "/our-partners",
    "/terms",
    "/forgot-password",
    "/reset-password/:token",
  ];
  const shouldApplyPadding =
    !noPaddingRoutes.includes(location.pathname) && !isAdminRoute;

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <SiteLayout withTopPadding={shouldApplyPadding}>
        <Routes>
          {/* Role-Based Redirect */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/our-partners" element={<OurPartner />} />
          <Route path="/incident-heatMap" element={<IncidentHeatMap />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* 🔒User Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/user" element={<Home />} />
            <Route path="/media-requests" element={<MediaRequests />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/report" element={<Report />} />
          </Route>

          {/* Client Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
            <Route path="/client" element={<ClientDashboard />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route
            element={<ProtectedRoute allowedRoles={["admin", "super-admin"]} />}
          >
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Unified User Profile Route */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["user", "client", "admin", "super-admin"]}
              />
            }
          >
            <Route path="/user-profile" element={<UserProfile />} />
          </Route>

          {/* Catch-All 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SiteLayout>
    </>
  );
};
const App = () => (
  <Router>
    <ScrollToTop />
    <AppContent />
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
  </Router>
);

export default App;
