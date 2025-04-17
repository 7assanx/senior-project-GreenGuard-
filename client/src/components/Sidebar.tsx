import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Application } from "@/lib/types";
import logoImage from "../assets/logo.png";

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
        <div className="flex flex-col h-0 flex-1 bg-gradient-to-b from-green-900 to-green-700">
          <div className="flex items-center h-20 flex-shrink-0 px-4 bg-gradient-to-r from-green-900 to-green-600 border-b border-green-500/30 shadow-md">
            <div className="flex items-center">
              <img src={logoImage} alt="Green Guard Logo" className="h-12 w-auto mr-3 drop-shadow-lg" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl tracking-wide">Green Guard</span>
                <span className="text-green-100 text-xs">Building Certification</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-5">
            <nav className="flex-1 px-3 py-4 space-y-2 mx-2 mb-2">
              {isAdmin ? (
                <>
                  <div
                    onClick={() => navigate("/admin/dashboard")}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-150",
                      isActive("dashboard")
                        ? "bg-green-500 text-white shadow-md"
                        : "text-white hover:bg-green-600/50"
                    )}
                  >
                    <i className={`ri-dashboard-line mr-3 text-lg ${isActive("dashboard") ? "text-white" : "text-green-200"}`}></i>
                    Dashboard
                  </div>
                  <div
                    onClick={() => navigate("/admin/applications")}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-150",
                      isActive("applications")
                        ? "bg-green-500 text-white shadow-md"
                        : "text-white hover:bg-green-600/50"
                    )}
                  >
                    <i className={`ri-file-list-3-line mr-3 text-lg ${isActive("applications") ? "text-white" : "text-green-200"}`}></i>
                    Applications
                  </div>
                  <div
                    onClick={() => navigate("/admin/reports")}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-150",
                      isActive("reports")
                        ? "bg-green-500 text-white shadow-md"
                        : "text-white hover:bg-green-600/50"
                    )}
                  >
                    <i className={`ri-folder-chart-line mr-3 text-lg ${isActive("reports") ? "text-white" : "text-green-200"}`}></i>
                    Reports
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => navigate("/dashboard")}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-150",
                      isActive("dashboard")
                        ? "bg-green-500 text-white shadow-md"
                        : "text-white hover:bg-green-600/50"
                    )}
                  >
                    <i className={`ri-dashboard-line mr-3 text-lg ${isActive("dashboard") ? "text-white" : "text-green-200"}`}></i>
                    Dashboard
                  </div>
                  <div
                    onClick={() => navigate("/applications")}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-150",
                      isActive("applications-list")
                        ? "bg-green-500 text-white shadow-md"
                        : "text-white hover:bg-green-600/50"
                    )}
                  >
                    <i className={`ri-file-list-3-line mr-3 text-lg ${isActive("applications-list") ? "text-white" : "text-green-200"}`}></i>
                    Applications
                  </div>
                  <div
                    onClick={() => navigate("/contact-firms")}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-150",
                      isActive("contact-firms")
                        ? "bg-green-500 text-white shadow-md"
                        : "text-white hover:bg-green-600/50"
                    )}
                  >
                    <i className={`ri-building-2-line mr-3 text-lg ${isActive("contact-firms") ? "text-white" : "text-green-200"}`}></i>
                    Contact Firms
                  </div>
                </>
              )}
              <div
                onClick={() => navigate(isAdmin ? "/admin/settings" : "/settings")}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-150",
                  isActive("settings")
                    ? "bg-green-500 text-white shadow-md"
                    : "text-white hover:bg-green-600/50"
                )}
              >
                <i className={`ri-settings-3-line mr-3 text-lg ${isActive("settings") ? "text-white" : "text-green-200"}`}></i>
                Settings
              </div>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-green-500/30 p-4 bg-green-800/70 mt-4 shadow-inner">
            <div className="flex-shrink-0 w-full group block cursor-pointer transition-all duration-150 hover:bg-green-700/50 p-2 rounded-md" onClick={handleLogout}>
              <div className="flex items-center">
                <div>
                  <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-r from-green-500 to-green-400 text-white shadow-md">
                    {user?.name ? getInitials(user.name) : <i className="ri-user-line"></i>}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {user?.name || "User"}
                  </p>
                  <div className="flex items-center text-xs font-medium text-green-200 mt-0.5">
                    <i className="ri-logout-box-line mr-1"></i>
                    Sign out
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
