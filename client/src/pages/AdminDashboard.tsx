import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import DashboardStat from "@/components/DashboardStat";
import ApplicationCard from "@/components/ApplicationCard";
import { Application } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Extended application with user details
interface ApplicationWithUser extends Application {
  userName: string;
  userEmail: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [_, navigate] = useLocation();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    } else if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch all applications for admin
  const { data: applications, isLoading, error } = useQuery<ApplicationWithUser[]>({
    queryKey: ["/api/admin/applications"],
    enabled: isAuthenticated && isAdmin,
  });

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect in the useEffect
  }

  // Filter applications by status
  const pendingApplications = applications?.filter(a => a.status === "pending") || [];
  const inProgressApplications = applications?.filter(a => a.status === "draft" || a.status === "in_progress") || [];
  const approvedApplications = applications?.filter(a => a.status === "approved") || [];
  const rejectedApplications = applications?.filter(a => a.status === "rejected") || [];

  return (
    <div className="h-screen flex overflow-hidden bg-neutral-100">
      {/* Sidebar */}
      <Sidebar isAdmin={true} activePage="dashboard" />
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <MobileHeader isAdmin={true} title="Green Guard" activePage="dashboard" />
        
        {/* Dashboard content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-neutral-900">Admin Dashboard</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Overview stats */}
              <div className="mt-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <DashboardStat
                    title="Pending Review"
                    value={isLoading ? "..." : pendingApplications.length}
                    icon="ri-time-line"
                    linkText="View all"
                    linkHref="/admin/applications"
                  />
                  
                  <DashboardStat
                    title="In Progress"
                    value={isLoading ? "..." : inProgressApplications.length}
                    icon="ri-loader-4-line"
                    linkText="View details"
                    linkHref="/admin/applications"
                  />
                  
                  <DashboardStat
                    title="Approved"
                    value={isLoading ? "..." : approvedApplications.length}
                    icon="ri-check-double-line"
                    linkText="View all"
                    linkHref="/admin/applications"
                  />
                  
                  <DashboardStat
                    title="Rejected"
                    value={isLoading ? "..." : rejectedApplications.length}
                    icon="ri-close-circle-line"
                    color="text-red-500"
                    linkText="View all"
                    linkHref="/admin/applications"
                  />
                </div>
              </div>
              
              {/* Pending Applications */}
              <div className="mt-8">
                <Card className="bg-white shadow overflow-hidden sm:rounded-md">
                  <CardHeader className="px-4 py-5 border-b border-neutral-200 sm:px-6">
                    <CardTitle className="text-lg leading-6 font-medium text-neutral-900">
                      Pending Applications
                    </CardTitle>
                    <p className="mt-1 text-sm text-neutral-500">
                      Applications requiring review and certification.
                    </p>
                  </CardHeader>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-red-500">Error loading applications. Please try again.</p>
                      <Button onClick={() => window.location.reload()} className="mt-4">
                        Retry
                      </Button>
                    </div>
                  ) : pendingApplications.length > 0 ? (
                    <ul role="list" className="divide-y divide-neutral-200">
                      {pendingApplications.slice(0, 3).map((application) => (
                        <ApplicationCard
                          key={application.id}
                          application={application}
                          userName={application.userName}
                          userEmail={application.userEmail}
                          isAdmin={true}
                        />
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-neutral-500">No pending applications at the moment</p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="mt-8">
                <Card className="bg-white shadow overflow-hidden sm:rounded-md">
                  <CardHeader className="px-4 py-5 border-b border-neutral-200 sm:px-6">
                    <CardTitle className="text-lg leading-6 font-medium text-neutral-900">
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <ul role="list" className="divide-y divide-neutral-200">
                    {applications && applications.length > 0 ? (
                      <>
                        <li>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-primary truncate">
                                Certification Issued
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Completed
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-neutral-500">
                                  <i className="ri-building-line flex-shrink-0 mr-1.5 text-neutral-400"></i>
                                  Sunset Tower Apartments (PBRS)
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-neutral-500 sm:mt-0">
                                <i className="ri-time-line flex-shrink-0 mr-1.5 text-neutral-400"></i>
                                <p>
                                  {formatRelativeTime(new Date(Date.now() - 3 * 60 * 60 * 1000))}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-primary truncate">
                                Application Review
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  In Progress
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-neutral-500">
                                  <i className="ri-landscape-line flex-shrink-0 mr-1.5 text-neutral-400"></i>
                                  Marina Waterfront Park (Public Realm)
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-neutral-500 sm:mt-0">
                                <i className="ri-time-line flex-shrink-0 mr-1.5 text-neutral-400"></i>
                                <p>
                                  {formatRelativeTime(new Date(Date.now() - 24 * 60 * 60 * 1000))}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      </>
                    ) : (
                      <li>
                        <div className="px-4 py-8 text-center">
                          <p className="text-sm text-neutral-500">No recent activity</p>
                        </div>
                      </li>
                    )}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
