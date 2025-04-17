import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import DashboardStat from "@/components/DashboardStat";
import ApplicationProgress from "@/components/ApplicationProgress";
import { Application } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime, getProjectTypeLabel, getProjectTypeIcon } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [isCreatingApplication, setIsCreatingApplication] = useState(false);

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

  const handleCreateApplication = async () => {
    setIsCreatingApplication(true);
    try {
      if (!user) {
        throw new Error("Not authenticated");
      }
      
      const response = await apiRequest("POST", "/api/applications", {
        projectName: "New Building Project",
        projectType: "PBRS",
        status: "draft",
        progress: 10,
        currentStep: "requirements",
        userId: user.id
      });
      
      const newApplication = await response.json();
      
      toast({
        title: "Application created",
        description: "Your new application has been created successfully!",
      });
      
      // Refresh applications list
      await queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      
      // Navigate to the new application
      navigate(`/applications/${newApplication.id}`);
    } catch (error) {
      console.error("Error creating application:", error);
      toast({
        title: "Error",
        description: "Could not create a new application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingApplication(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="h-screen flex overflow-hidden bg-neutral-100">
      {/* Sidebar */}
      <Sidebar activePage="dashboard" />
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <MobileHeader title="Green Guard" activePage="dashboard" />
        
        {/* Dashboard content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Overview stats */}
              <div className="mt-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <DashboardStat
                    title="Total Applications"
                    value={isLoading ? "..." : applications?.length || 0}
                    icon="ri-file-list-3-line"
                    linkText="View all"
                    linkHref="/dashboard"
                  />
                  
                  <DashboardStat
                    title="In Progress"
                    value={isLoading ? "..." : applications?.filter(a => a.status === "draft" || a.status === "pending").length || 0}
                    icon="ri-time-line"
                    linkText="View details"
                    linkHref={applications && applications.length > 0 ? `/applications/${applications[0].id}` : "/dashboard"}
                  />
                  
                  {(() => {
                    // Handle certification data safely with proper null checks
                    const hasApprovedApps = applications && applications.length > 0 && 
                      applications.some(a => a.status === "approved");
                    
                    const approvedApp = applications && 
                      applications.find(a => a.status === "approved");
                    
                    const certLink = hasApprovedApps && approvedApp 
                      ? `/api/applications/${approvedApp.id}/certification/download`
                      : "/dashboard";
                    
                    return (
                      <DashboardStat
                        title="Approved"
                        value={isLoading ? "..." : applications?.filter(a => a.status === "approved").length || 0}
                        icon="ri-check-double-line"
                        linkText={hasApprovedApps ? "View certificates" : "View all"}
                        linkHref={certLink}
                        approvedApplications={applications?.filter(a => a.status === "approved") || []}
                      />
                    );
                  })()}
                </div>
              </div>
              
              {/* Action Button Row */}
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleCreateApplication}
                  disabled={isCreatingApplication}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {isCreatingApplication ? (
                    <>
                      <i className="ri-loader-2-line animate-spin mr-2"></i> Creating...
                    </>
                  ) : (
                    <>
                      <i className="ri-add-line mr-2"></i> Create New Application
                    </>
                  )}
                </Button>
              </div>
              
              {/* Application Progress */}
              <div className="mt-4">
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
                  <ApplicationProgress application={applications[0]} />
                ) : (
                  <Card className="bg-white shadow overflow-hidden sm:rounded-md">
                    <CardHeader className="px-4 py-5 border-b border-neutral-200 sm:px-6">
                      <CardTitle className="text-lg leading-6 font-medium text-neutral-900">
                        No Active Applications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 py-5 sm:p-6 text-center">
                      <p className="text-neutral-500 mb-4">
                        You don't have any active applications. Start your certification process by creating a new application.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Applications List */}
              <div className="mt-8">
                <Card className="bg-white shadow overflow-hidden sm:rounded-md">
                  <CardHeader className="px-4 py-5 border-b border-neutral-200 sm:px-6 flex justify-between items-center">
                    <CardTitle className="text-lg leading-6 font-medium text-neutral-900">
                      Your Applications
                    </CardTitle>
                  </CardHeader>
                  
                  {applications && applications.length > 0 ? (
                    <ul role="list" className="divide-y divide-neutral-200">
                      {applications.map((app) => (
                        <li key={app.id} className="hover:bg-neutral-50">
                          <Link to={`/applications/${app.id}`} className="block">
                            <div className="px-4 py-4 sm:px-6">
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
                                
                                <div className="flex items-center">
                                  {/* Application Progress Indicator */}
                                  <div className="hidden md:block mr-4">
                                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full ${
                                          app.status === "approved" ? "bg-green-500" : 
                                          app.status === "rejected" ? "bg-red-500" : 
                                          app.status === "needs_info" ? "bg-orange-500" : 
                                          "bg-primary"
                                        }`} 
                                        style={{width: `${app.progress}%`}}
                                      ></div>
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-1 text-right">{app.progress}% complete</p>
                                  </div>
                                  
                                  {/* Status Badge */}
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    app.status === "approved" ? "bg-green-100 text-green-800" : 
                                    app.status === "rejected" ? "bg-red-100 text-red-800" :
                                    app.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                    app.status === "needs_info" ? "bg-orange-100 text-orange-800" :
                                    "bg-blue-100 text-blue-800"
                                  }`}>
                                    {app.status === "approved" ? "Approved" : 
                                     app.status === "rejected" ? "Rejected" :
                                     app.status === "pending" ? "Pending Review" :
                                     app.status === "needs_info" ? "Action Required" :
                                     "In Progress"}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="mt-2 flex justify-between items-center">
                                <div className="text-xs text-neutral-500">
                                  <i className="ri-time-line mr-1"></i> 
                                  Last updated {formatRelativeTime(new Date(app.updatedAt))}
                                </div>
                                
                                {/* Action Indicators */}
                                <div>
                                  {app.status === "approved" && (
                                    <span className="text-xs text-green-600 flex items-center">
                                      <i className="ri-download-2-line mr-1"></i> Certificate available
                                    </span>
                                  )}
                                  {app.status === "needs_info" && (
                                    <span className="text-xs text-orange-600 flex items-center">
                                      <i className="ri-alert-line mr-1"></i> Response needed
                                    </span>
                                  )}
                                  {app.status === "draft" && (
                                    <span className="text-xs text-blue-600 flex items-center">
                                      <i className="ri-edit-line mr-1"></i> Continue editing
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-neutral-500">
                        You don't have any applications yet. 
                        <br />
                        Create your first application to get started with the certification process.
                      </p>
                      <Button
                        onClick={handleCreateApplication}
                        disabled={isCreatingApplication}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        {isCreatingApplication ? (
                          <>
                            <i className="ri-loader-2-line animate-spin mr-2"></i> Creating...
                          </>
                        ) : (
                          <>
                            <i className="ri-add-line mr-2"></i> Create Application
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
              
              {/* Recent Notifications - Only show when needed */}
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
                        <li key={app.id} className="bg-orange-50 bg-opacity-30">
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-orange-800">
                                Additional Information Requested
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                                  Action Required
                                </span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <h4 className="text-sm font-medium">{app.projectName}</h4>
                              {app.feedbackMessage && (
                                <div className="mt-2 p-3 bg-white border border-orange-200 rounded-md">
                                  <p className="text-sm text-neutral-700 whitespace-pre-line">
                                    {app.feedbackMessage}
                                  </p>
                                </div>
                              )}
                              <div className="mt-3">
                                <Link to={`/applications/${app.id}`}>
                                  <Button variant="outline" size="sm" className="bg-white text-orange-700 border-orange-300 hover:bg-orange-50">
                                    <i className="ri-edit-line mr-1"></i> Update Application
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
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
