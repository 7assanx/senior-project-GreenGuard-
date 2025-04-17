import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getInitials, getProjectTypeIcon } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Application } from "@/lib/types";
import logoImage from "../assets/logo.png";
import { useState, useRef, useEffect } from "react";

type SidebarProps = {
  isAdmin?: boolean;
  activePage?: string;
};

export default function Sidebar({ isAdmin = false, activePage = "dashboard" }: SidebarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [_, navigate] = useLocation();
  const [showApplicationsDropdown, setShowApplicationsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Fetch user's applications
  const { data: applications } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    enabled: isAuthenticated && !isAdmin,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowApplicationsDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (page: string) => {
    return activePage === page;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "needs_info": return "bg-orange-100 text-orange-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };
  
  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      case "pending": return "Pending";
      case "needs_info": return "Action Required";
      case "draft": return "In Progress";
      default: return status;
    }
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-green-800">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-green-700">
            <div className="flex items-center">
              <img src={logoImage} alt="Green Guard Logo" className="h-10 w-auto mr-1" />
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1 bg-green-100 rounded-md mx-1">
              {isAdmin ? (
                <>
                  <div
                    onClick={() => navigate("/admin/dashboard")}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
                      isActive("dashboard")
                        ? "bg-green-600 text-white"
                        : "text-green-800 hover:bg-green-200"
                    )}
                  >
                    <i className={`ri-dashboard-line mr-3 text-lg ${isActive("dashboard") ? "text-white" : "text-green-700"}`}></i>
                    Dashboard
                  </div>
                  <div
                    onClick={() => navigate("/admin/applications")}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
                      isActive("applications")
                        ? "bg-green-600 text-white"
                        : "text-green-800 hover:bg-green-200"
                    )}
                  >
                    <i className={`ri-file-list-3-line mr-3 text-lg ${isActive("applications") ? "text-white" : "text-green-700"}`}></i>
                    Applications
                  </div>
                  <div
                    onClick={() => navigate("/admin/reports")}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
                      isActive("reports")
                        ? "bg-green-600 text-white"
                        : "text-green-800 hover:bg-green-200"
                    )}
                  >
                    <i className={`ri-folder-chart-line mr-3 text-lg ${isActive("reports") ? "text-white" : "text-green-700"}`}></i>
                    Reports
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => navigate("/dashboard")}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
                      isActive("dashboard")
                        ? "bg-green-600 text-white"
                        : "text-green-800 hover:bg-green-200"
                    )}
                  >
                    <i className={`ri-dashboard-line mr-3 text-lg ${isActive("dashboard") ? "text-white" : "text-green-700"}`}></i>
                    Dashboard
                  </div>
                  <div ref={dropdownRef} className="relative">
                    <div
                      onClick={() => setShowApplicationsDropdown(!showApplicationsDropdown)}
                      className={cn(
                        "group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
                        isActive("applications")
                          ? "bg-green-600 text-white"
                          : "text-green-800 hover:bg-green-200"
                      )}
                    >
                      <div className="flex items-center">
                        <i className={`ri-file-list-3-line mr-3 text-lg ${isActive("applications") ? "text-white" : "text-green-700"}`}></i>
                        Applications
                      </div>
                      <i className={`ri-arrow-down-s-line text-lg ${showApplicationsDropdown ? 'transform rotate-180' : ''}`}></i>
                    </div>
                    
                    {/* Applications Dropdown */}
                    {showApplicationsDropdown && (
                      <div className="absolute left-0 mt-2 w-full bg-white rounded-md shadow-lg py-1 z-10 max-h-60 overflow-y-auto">
                        {applications && applications.length > 0 ? (
                          applications.map((app) => (
                            <div 
                              key={app.id}
                              onClick={() => {
                                navigate(`/applications/${app.id}`);
                                setShowApplicationsDropdown(false);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                            >
                              <i className={`${getProjectTypeIcon(app.projectType)} mr-2 text-neutral-500`}></i>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 truncate">
                                  {app.projectName}
                                </p>
                              </div>
                              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(app.status)}`}>
                                {getStatusLabel(app.status)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-neutral-500">
                            No applications found
                          </div>
                        )}
                        <div 
                          onClick={() => {
                            navigate("/dashboard");
                            setShowApplicationsDropdown(false);
                          }}
                          className="flex items-center justify-center mt-1 px-4 py-2 text-sm text-green-700 hover:bg-green-50 cursor-pointer border-t border-neutral-100"
                        >
                          <i className="ri-add-line mr-1"></i> Create New
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    onClick={() => navigate("/contact-firms")}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
                      isActive("contact-firms")
                        ? "bg-green-600 text-white"
                        : "text-green-800 hover:bg-green-200"
                    )}
                  >
                    <i className={`ri-building-2-line mr-3 text-lg ${isActive("contact-firms") ? "text-white" : "text-green-700"}`}></i>
                    Contact Firms
                  </div>
                </>
              )}
              <div
                onClick={() => navigate(isAdmin ? "/admin/settings" : "/settings")}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
                  isActive("settings")
                    ? "bg-green-600 text-white"
                    : "text-green-800 hover:bg-green-200"
                )}
              >
                <i className={`ri-settings-3-line mr-3 text-lg ${isActive("settings") ? "text-white" : "text-green-700"}`}></i>
                Settings
              </div>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-green-700 p-4">
            <div className="flex-shrink-0 w-full group block cursor-pointer" onClick={handleLogout}>
              <div className="flex items-center">
                <div>
                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white">
                    {user?.name ? getInitials(user.name) : <i className="ri-user-line"></i>}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs font-medium text-green-300">
                    Sign out
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
