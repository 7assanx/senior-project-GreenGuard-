import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Application } from "@/lib/types";

type SidebarProps = {
  isAdmin?: boolean;
  activePage?: string;
};

export default function Sidebar({ isAdmin = false, activePage = "dashboard" }: SidebarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [_, navigate] = useLocation();
  
  // Fetch user's applications
  const { data: applications } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    enabled: isAuthenticated && !isAdmin,
  });

  const isActive = (page: string) => {
    return activePage === page;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-green-800">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-green-700">
            <div className="flex items-center">
              <i className="ri-shield-check-line text-white text-2xl mr-2"></i>
              <span className="font-bold text-xl text-white">Green Guard</span>
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
                  <div
                    onClick={() => {
                      if (applications && applications.length > 0) {
                        navigate(`/applications/${applications[0].id}`);
                      } else {
                        navigate("/dashboard");
                      }
                    }}
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
