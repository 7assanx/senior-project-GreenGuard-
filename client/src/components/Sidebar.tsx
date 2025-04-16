import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/lib/utils";

type SidebarProps = {
  isAdmin?: boolean;
  activePage?: string;
};

export default function Sidebar({ isAdmin = false, activePage = "dashboard" }: SidebarProps) {
  const { user, logout } = useAuth();
  const [_, navigate] = useLocation();

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
        <div className="flex flex-col h-0 flex-1 bg-primary-dark">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary">
            <div className="flex items-center">
              <i className="ri-shield-check-line text-white text-2xl mr-2"></i>
              <span className="font-bold text-xl text-white">Green Guard</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {isAdmin ? (
                <>
                  <Link href="/admin/dashboard">
                    <a
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        isActive("dashboard")
                          ? "bg-primary bg-opacity-25 text-white"
                          : "text-white hover:bg-primary hover:bg-opacity-25"
                      )}
                    >
                      <i className="ri-dashboard-line mr-3 text-white text-lg"></i>
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/admin/applications">
                    <a
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        isActive("applications")
                          ? "bg-primary bg-opacity-25 text-white"
                          : "text-white hover:bg-primary hover:bg-opacity-25"
                      )}
                    >
                      <i className="ri-file-list-3-line mr-3 text-white text-lg"></i>
                      Applications
                    </a>
                  </Link>
                  <Link href="/admin/reports">
                    <a
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        isActive("reports")
                          ? "bg-primary bg-opacity-25 text-white"
                          : "text-white hover:bg-primary hover:bg-opacity-25"
                      )}
                    >
                      <i className="ri-folder-chart-line mr-3 text-white text-lg"></i>
                      Reports
                    </a>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard">
                    <a
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        isActive("dashboard")
                          ? "bg-primary bg-opacity-25 text-white"
                          : "text-white hover:bg-primary hover:bg-opacity-25"
                      )}
                    >
                      <i className="ri-dashboard-line mr-3 text-white text-lg"></i>
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/applications">
                    <a
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        isActive("applications")
                          ? "bg-primary bg-opacity-25 text-white"
                          : "text-white hover:bg-primary hover:bg-opacity-25"
                      )}
                    >
                      <i className="ri-file-list-3-line mr-3 text-white text-lg"></i>
                      Applications
                    </a>
                  </Link>
                  <Link href="/contact-firms">
                    <a
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        isActive("contact-firms")
                          ? "bg-primary bg-opacity-25 text-white"
                          : "text-white hover:bg-primary hover:bg-opacity-25"
                      )}
                    >
                      <i className="ri-building-2-line mr-3 text-white text-lg"></i>
                      Contact Firms
                    </a>
                  </Link>
                </>
              )}
              <Link href={isAdmin ? "/admin/settings" : "/settings"}>
                <a
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive("settings")
                      ? "bg-primary bg-opacity-25 text-white"
                      : "text-white hover:bg-primary hover:bg-opacity-25"
                  )}
                >
                  <i className="ri-settings-3-line mr-3 text-white text-lg"></i>
                  Settings
                </a>
              </Link>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-primary p-4">
            <div className="flex-shrink-0 w-full group block cursor-pointer" onClick={handleLogout}>
              <div className="flex items-center">
                <div>
                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                    {user?.name ? getInitials(user.name) : <i className="ri-user-line"></i>}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs font-medium text-primary-light">
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
