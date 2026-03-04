import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  LogOut,
  ChevronDown,
  Home,
  User,
  FileText,
  Settings,
  LayoutDashboard,
  Camera,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserName(user.fullName);
  }, [user.fullName]);

  const homePath = user?.role ? `/${user.role}` : "/login";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    ...(user?.role === "user"
      ? [
          {
            name: "Home",
            path: "/home",
            icon: <Home size={16} />,
          },
          {
            name: "Dashboard",
            path: "/dashboard",
            icon: <LayoutDashboard size={16} />,
          },
          {
            name: "Media Requests",
            path: "/media-requests",
            icon: <Camera size={16} />,
          },
        ]
      : []),

    ...(user?.role === "admin"
      ? [
          {
            name: "Media Review",
            path: "/media-review",
            icon: <FileText size={16} />,
          },
          { name: "Manage Ads", path: "/ads", icon: <Settings size={16} /> },
        ]
      : []),
  ];

  const getUserInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  return (
    <nav className="bg-white fixed w-full z-50 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link to={homePath} className="transition-transform hover:scale-105">
          <img src="/images/bg.png" className="h-24" alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md flex items-center text-sm transition-colors duration-200 ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50 font-medium"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                }`
              }
            >
              <span className="mr-1.5 text-indigo-500">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-3 py-2 h-auto hover:bg-gray-100 transition-colors duration-200"
                >
                  <Avatar className="w-8 h-8 bg-indigo-100">
                    <AvatarFallback className="text-indigo-700 text-sm font-semibold">
                      {getUserInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-700 max-w-[120px] truncate capitalize">
                    {userName || "User"}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none capitalize">
                      {userName || "User"}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="capitalize text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/user-profile"
                    className="flex items-center cursor-pointer"
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Log in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu size={24} />
                <span className="sr-only">Open main menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between pb-6 border-b">
                  <img src="/images/bg.png" className="h-12" alt="Logo" />
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 py-6">
                  <nav className="space-y-2">
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                          `px-3 py-2 rounded-md flex items-center text-sm transition-colors duration-200 ${
                            isActive
                              ? "text-indigo-600 bg-indigo-50 font-medium"
                              : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                          }`
                        }
                      >
                        <span className="mr-1.5 text-indigo-500">
                          {link.icon}
                        </span>
                        {link.name}
                      </NavLink>
                    ))}
                  </nav>
                </div>

                {/* Mobile User Section */}
                <div className="border-t pt-6 space-y-4">
                  {user ? (
                    <div className="space-y-4">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 px-3">
                        <Avatar className="w-10 h-10 bg-indigo-100">
                          <AvatarFallback className="text-indigo-600 text-sm font-semibold">
                            {getUserInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-base font-medium text-gray-800 capitalize">
                            {userName || "User"}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      </div>

                      {/* User Actions */}
                      <div className="space-y-2">
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link
                            to="/user-profile"
                            className="flex items-center space-x-3"
                          >
                            <User size={16} />
                            <span>Profile</span>
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut size={16} className="mr-3" />
                          Sign out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to="/login">Log in</Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to="/signup">Sign up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
