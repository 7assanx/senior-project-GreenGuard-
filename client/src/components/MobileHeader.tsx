import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

type MobileHeaderProps = {
  isAdmin?: boolean;
  title: string;
  activePage?: string;
};

export default function MobileHeader({ isAdmin = false, title, activePage = "dashboard" }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [_, navigate] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (page: string) => {
    return activePage === page;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="md:hidden">
      <div className="pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center justify-between">
        <button
          onClick={toggleMenu}
          className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-neutral-500 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        >
          <span className="sr-only">Open sidebar</span>
          <i className="ri-menu-line text-2xl"></i>
        </button>
        <div className="flex items-center pr-2">
          <i className="ri-shield-check-line text-primary text-2xl mr-2"></i>
          <span className="font-bold text-lg text-primary-dark">{title}</span>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-neutral-600 bg-opacity-75"
            onClick={toggleMenu}
            aria-hidden="true"
          ></div>

          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-dark">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={toggleMenu}
              >
                <span className="sr-only">Close sidebar</span>
                <i className="ri-close-line text-white text-2xl"></i>
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="flex items-center">
                  <i className="ri-shield-check-line text-white text-2xl mr-2"></i>
                  <span className="font-bold text-xl text-white">Green Guard</span>
                </div>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {isAdmin ? (
                  <>
                    <div
                      onClick={() => navigate("/admin/dashboard")}
                      className={cn(
                        "group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer",
                        isActive("dashboard")
                          ? "bg-primary bg-opacity-25 text-white"
                          : "text-neutral-100 hover:bg-primary hover:bg-opacity-25"
                      )}
                    >
                      <i className="ri-dashboard-line mr-3 text-white text-lg"></i>
                      Dashboard
                    </div>
                    <div
                      onClick={() => navigate("/admin/applications")}
                      className={cn(
                        "group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer",
                        isActive("applications")
                          ? "bg-primary bg-opacity-25 text-white"
                          : "text-neutral-100 hover:bg-primary hover:bg-opacity-25"
                      )}
                    >
                      <i className="ri-file-list-3-line mr-3 text-white text-lg"></i>
                      Applications
                    </div>
                    <div
                      onClick={() => navigate("/admin/reports")}
                      className={cn(
                        "group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer",
                        isActive("reports")
                          ? "bg-primary bg-opacity-25 text-white"
                          : "text-neutral-100 hover:bg-primary hover:bg-opacity-25"
                      )}
                    >
                      <i className="ri-folder-chart-line mr-3 text-white text-lg"></i>
                      Reports
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => navigate("/dashboard")}
                      className={cn(
                        "group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer",
                        isActive("dashboard")
                          ? "bg-primary bg-opacity-25 text-white"
                          : "text-neutral-100 hover:bg-primary hover:bg-opacity-25"
                      )}
                    >
                      <i className="ri-dashboard-line mr-3 text-white text-lg"></i>
                      Dashboard
                    </div>
                    <div
                      onClick={() => navigate("/applications")}
                      className={cn(
                        "group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer",
                        isActive("applications")
                          ? "bg-primary bg-opacity-25 text-white"
                          : "text-neutral-100 hover:bg-primary hover:bg-opacity-25"
                      )}
                    >
                      <i className="ri-file-list-3-line mr-3 text-white text-lg"></i>
                      Applications
                    </div>
                    <div
                      onClick={() => navigate("/contact-firms")}
                      className={cn(
                        "group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer",
                        isActive("contact-firms")
                          ? "bg-primary bg-opacity-25 text-white"
                          : "text-neutral-100 hover:bg-primary hover:bg-opacity-25"
                      )}
                    >
                      <i className="ri-building-2-line mr-3 text-white text-lg"></i>
                      Contact Firms
                    </div>
                  </>
                )}
                <div
                  onClick={() => navigate(isAdmin ? "/admin/settings" : "/settings")}
                  className={cn(
                    "group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer",
                    isActive("settings")
                      ? "bg-primary bg-opacity-25 text-white"
                      : "text-neutral-100 hover:bg-primary hover:bg-opacity-25"
                  )}
                >
                  <i className="ri-settings-3-line mr-3 text-white text-lg"></i>
                  Settings
                </div>
              </nav>
            </div>

            <div className="flex-shrink-0 flex border-t border-primary p-4">
              <div className="flex-shrink-0 w-full group block" onClick={handleLogout}>
                <div className="flex items-center">
                  <div>
                    <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-primary">
                      <i className="ri-user-line text-white"></i>
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
      )}
    </div>
  );
}
