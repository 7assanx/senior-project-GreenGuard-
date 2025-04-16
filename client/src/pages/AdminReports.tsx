import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { Application } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Extended application with user details
interface ApplicationWithUser extends Application {
  userName: string;
  userEmail: string;
}

export default function AdminReports() {
  const { isAuthenticated, isAdmin } = useAuth();
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

  // Calculate statistics
  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(a => a.status === "pending").length || 0;
  const approvedApplications = applications?.filter(a => a.status === "approved").length || 0;
  const rejectedApplications = applications?.filter(a => a.status === "rejected").length || 0;
  
  // Calculate approval rate
  const approvalRate = totalApplications > 0 
    ? Math.round((approvedApplications / totalApplications) * 100) 
    : 0;
  
  // Calculate certifications by type
  const pbrsCount = applications?.filter(a => a.projectType === "PBRS").length || 0;
  const pcrsCount = applications?.filter(a => a.projectType === "PCRS").length || 0;
  const pvrsCount = applications?.filter(a => a.projectType === "PVRS").length || 0;
  const publicRealmCount = applications?.filter(a => a.projectType === "Public Realm").length || 0;

  return (
    <div className="h-screen flex overflow-hidden bg-neutral-100">
      {/* Sidebar */}
      <Sidebar isAdmin={true} activePage="reports" />
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <MobileHeader isAdmin={true} title="Green Guard" activePage="reports" />
        
        {/* Reports content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-neutral-900">Certification Reports</h1>
              <p className="mt-1 text-sm text-neutral-500">
                View statistics and reports on certification activities.
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="project-types">Project Types</TabsTrigger>
                  <TabsTrigger value="certification-levels">Certification Levels</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary">
                  <div className="grid grid-cols-1 gap-5 mt-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">Total Applications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{totalApplications}</div>
                        <p className="text-xs text-neutral-500 mt-1">All time</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">Pending Review</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{pendingApplications}</div>
                        <p className="text-xs text-neutral-500 mt-1">Awaiting certification</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">Approval Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{approvalRate}%</div>
                        <div className="w-full bg-neutral-200 rounded-full h-2.5 mt-2">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${approvalRate}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="mt-5">
                    <CardHeader>
                      <CardTitle>Certification Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Approved Applications</p>
                            <p className="text-sm text-neutral-500">Successful certifications</p>
                          </div>
                          <div className="font-bold text-green-600">{approvedApplications}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Rejected Applications</p>
                            <p className="text-sm text-neutral-500">Failed to meet requirements</p>
                          </div>
                          <div className="font-bold text-red-600">{rejectedApplications}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Pending Applications</p>
                            <p className="text-sm text-neutral-500">Currently under review</p>
                          </div>
                          <div className="font-bold text-blue-600">{pendingApplications}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="project-types">
                  <Card className="mt-5">
                    <CardHeader>
                      <CardTitle>Applications by Project Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Pearl Building Rating System (PBRS)</p>
                            <p className="text-sm text-neutral-500">New buildings and major renovations</p>
                          </div>
                          <div className="font-bold">{pbrsCount}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Pearl Community Rating System (PCRS)</p>
                            <p className="text-sm text-neutral-500">Sustainable community developments</p>
                          </div>
                          <div className="font-bold">{pcrsCount}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Pearl Villa Rating System (PVRS)</p>
                            <p className="text-sm text-neutral-500">Residential villas</p>
                          </div>
                          <div className="font-bold">{pvrsCount}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Public Realm</p>
                            <p className="text-sm text-neutral-500">Public spaces and infrastructure</p>
                          </div>
                          <div className="font-bold">{publicRealmCount}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="certification-levels">
                  <Card className="mt-5">
                    <CardHeader>
                      <CardTitle>Certification Levels Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-10">
                        <p className="text-neutral-500">Pearl Rating level distribution will be shown here.</p>
                        <p className="text-neutral-500 mt-2">This feature is coming soon.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}