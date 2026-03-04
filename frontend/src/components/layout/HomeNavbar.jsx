import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Home, 
  Map, 
  Users, 
  LogIn, 
  UserPlus, 
  LayoutDashboard, 
  FileText
} from "lucide-react";

const HomeNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/home", label: "Home", icon: Home },
    { path: "/incident-heatMap", label: "Incident HeatMap", icon: Map },
    { path: "/our-partners", label: "Our Partners", icon: Users },
    { path: "/terms", label: "Terms & Conditions", icon: FileText },
  ];

  const getUserInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <nav className={`bg-white fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? "border-b border-gray-200 shadow-sm" : ""
    }`}>
      <div className="container mx-auto flex justify-between items-center px-4 py-6">
        {/* Logo */}
        <Link to="/" className="transition-transform hover:scale-105">
          <img src="/images/logo.jpg" className="h-8" alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Button
                key={link.path}
                asChild
                variant="ghost"
                size="sm"
                className={`transition-all duration-200 ${
                  isActive(link.path)
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                <Link to={link.path} className="flex items-center space-x-2">
                  <span className="text-indigo-500">{React.createElement(IconComponent, { size: 16 })}</span>
                  <span className="text-sm">{link.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center">
          {user?.role === "user" ? (
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8 bg-indigo-100">
                <AvatarFallback className="text-indigo-700 text-sm font-semibold">
                  {getUserInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <Button 
                asChild 
                size="sm" 
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login" className="flex items-center space-x-2">
                  <LogIn size={16} />
                  <span>Log in</span>
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                <Link to="/signup" className="flex items-center space-x-2">
                  <UserPlus size={16} />
                  <span>Sign up</span>
                </Link>
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
                    {navLinks.map((link) => {
                      const IconComponent = link.icon;
                      return (
                        <Button
                          key={link.path}
                          asChild
                          variant="ghost"
                          className={`w-full justify-start transition-all duration-200 ${
                            isActive(link.path)
                              ? "text-indigo-600 bg-indigo-50"
                              : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link to={link.path} className="flex items-center space-x-3">
                            <span className="text-indigo-500">{React.createElement(IconComponent, { size: 16 })}</span>
                            <span>{link.label}</span>
                          </Link>
                        </Button>
                      );
                    })}
                  </nav>
                </div>

                {/* Mobile User Section */}
                <div className="border-t pt-6 space-y-4">
                  {user?.role === "user" ? (
                    <div className="space-y-4">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 px-3">
                        <Avatar className="w-10 h-10 bg-indigo-100">
                          <AvatarFallback className="text-indigo-600 text-sm font-semibold">
                            {getUserInitials(user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-base font-medium text-gray-800 capitalize">
                            {user.fullName || "User"}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      </div>

                      {/* Dashboard Button */}
                      <div className="space-y-2">
                        <Button
                          asChild
                          className="w-full bg-indigo-600 hover:bg-indigo-700"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link to="/dashboard" className="flex items-center justify-center space-x-2">
                            <LayoutDashboard size={16} />
                            <span>Dashboard</span>
                          </Link>
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
                        <Link to="/login" className="flex items-center justify-center space-x-2">
                          <LogIn size={16} />
                          <span>Log in</span>
                        </Link>
                      </Button>
                      <Button 
                        asChild 
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to="/signup" className="flex items-center justify-center space-x-2">
                          <UserPlus size={16} />
                          <span>Sign up</span>
                        </Link>
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

export default HomeNavbar;