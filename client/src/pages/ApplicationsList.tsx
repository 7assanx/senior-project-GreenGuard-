import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { Application } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime, getProjectTypeLabel, getProjectTypeIcon } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ApplicationsList() {
  const { isAuthenticated } = useAuth();
  const [_, navigate] = useLocation();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch user's applications
  const { data: applications, isLoading, error } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    enabled: isAuthenticated,
  });
  
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
      case "pending": return "Pending Review";
      case "needs_info": return "Action Required";
      case "draft": return "In Progress";
      default: return status;
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="h-screen flex overflow-hidden bg-neutral-100">
      {/* Sidebar */}
      <Sidebar activePage="applications-list" />
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <MobileHeader title="Applications" activePage="applications-list" />
        
        {/* Content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-neutral-900">Your Applications</h1>
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <i className="ri-add-line mr-2"></i> Create New
                </Button>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="mt-8">
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
                ) : applications && applications.length > 0 ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul role="list" className="divide-y divide-neutral-200">
                      {applications.map((app) => (
                        <li key={app.id} className="hover:bg-neutral-50">
                          <Link to={`/applications/${app.id}`} className="block">
                            <div className="px-4 py-5 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <i className={`${getProjectTypeIcon(app.projectType)} text-xl text-neutral-500 mr-3`}></i>
                                  <div>
                                    <p className="text-sm font-medium text-primary">
                                      {app.projectName}
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                      {getProjectTypeLabel(app.projectType)}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Status Badge */}
                                <p className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                  {getStatusLabel(app.status)}
                                </p>
                              </div>
                              
                              <div className="mt-2 flex justify-between items-center">
                                <div className="text-xs text-neutral-500">
                                  <i className="ri-time-line mr-1"></i> 
                                  Last updated {formatRelativeTime(new Date(app.updatedAt))}
                                </div>
                                
                                {/* Action Indicators */}
                                {app.status === "approved" && (
                                  <p className="text-xs text-green-600 flex items-center">
                                    <i className="ri-download-2-line mr-1"></i> Certificate available
                                  </p>
                                )}
                                {app.status === "needs_info" && (
                                  <p className="text-xs text-orange-600 flex items-center">
                                    <i className="ri-alert-line mr-1"></i> Response needed
                                  </p>
                                )}
                                {app.status === "draft" && (
                                  <p className="text-xs text-blue-600 flex items-center">
                                    <i className="ri-edit-line mr-1"></i> Continue editing
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Card className="bg-white shadow overflow-hidden sm:rounded-md">
                    <CardHeader className="px-4 py-5 border-b border-neutral-200 sm:px-6">
                      <CardTitle className="text-lg leading-6 font-medium text-neutral-900">
                        No Applications Found
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 py-5 sm:p-6 text-center">
                      <p className="text-neutral-500 mb-4">
                        You don't have any applications yet. Start your certification process by creating a new application.
                      </p>
                      <Button
                        onClick={() => navigate("/dashboard")}
                        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <i className="ri-add-line mr-2"></i> Create Application
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Recent Notifications Section for Applications needing attention */}
              {applications && applications.some(app => app.status === "needs_info") && (
                <div className="mt-8">
                  <Card className="bg-white shadow overflow-hidden sm:rounded-md border-orange-200">
                    <CardHeader className="px-4 py-5 border-b border-orange-200 sm:px-6 bg-orange-50">
                      <CardTitle className="text-lg leading-6 font-medium text-orange-800 flex items-center">
                        <i className="ri-notification-3-line mr-2"></i> 
                        Applications Requiring Attention
                      </CardTitle>
                    </CardHeader>
                    <ul role="list" className="divide-y divide-orange-100">
                      {applications.filter(app => app.status === "needs_info").map((app) => (
                        <li key={app.id} className="bg-orange-50 bg-opacity-30 hover:bg-orange-50">
                          <Link to={`/applications/${app.id}`} className="block">
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-orange-800">
                                  {app.projectName}
                                </p>
                                <p className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                  Action Required
                                </p>
                              </div>
                              <div className="mt-2">
                                <p className="text-xs text-orange-700 line-clamp-2">
                                  <i className="ri-information-line mr-1"></i> 
                                  {app.feedbackMessage || "The administrator has requested additional information for this application."}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}