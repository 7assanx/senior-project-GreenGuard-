import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import ApplicationCard from "@/components/ApplicationCard";
import { Application } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Extended application with user details
interface ApplicationWithUser extends Application {
  userName: string;
  userEmail: string;
}

export default function AdminApplications() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [_, navigate] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const statusFilter = searchParams.get("status");
  const [activeTab, setActiveTab] = useState(statusFilter || "all");
  
  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    } else if (!isAdmin) {
      navigate("/dashboard");
    }
    
    // Set active tab based on URL search param
    if (statusFilter) {
      setActiveTab(statusFilter);
    }
  }, [isAuthenticated, isAdmin, navigate, statusFilter]);

  // Fetch all applications for admin
  const { data: applications, isLoading, error } = useQuery<ApplicationWithUser[]>({
    queryKey: ["/api/admin/applications"],
    enabled: isAuthenticated && isAdmin,
  });

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect in the useEffect
  }

  // Filter applications by status
  const filteredApplications = applications?.filter(app => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return app.status === "pending";
    if (activeTab === "in_progress") return app.status === "draft" || app.status === "in_progress";
    if (activeTab === "approved") return app.status === "approved";
    if (activeTab === "rejected") return app.status === "rejected";
    return true;
  }) || [];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/applications${value === "all" ? "" : `?status=${value}`}`, { replace: true });
  };

  return (
    <div className="h-screen flex overflow-hidden bg-neutral-100">
      {/* Sidebar */}
      <Sidebar isAdmin={true} activePage="applications" />
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <MobileHeader isAdmin={true} title="Green Guard" activePage="applications" />
        
        {/* Applications content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-neutral-900">All Applications</h1>
              <p className="mt-1 text-sm text-neutral-500">
                Review and manage all certification applications.
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  <Card className="bg-white shadow overflow-hidden sm:rounded-md mt-6">
                    <CardHeader className="px-4 py-5 border-b border-neutral-200 sm:px-6">
                      <CardTitle className="text-lg leading-6 font-medium text-neutral-900">
                        {activeTab === "all" ? "All Applications" :
                         activeTab === "pending" ? "Pending Applications" :
                         activeTab === "in_progress" ? "In Progress Applications" :
                         activeTab === "approved" ? "Approved Applications" :
                         activeTab === "rejected" ? "Rejected Applications" :
                         "Applications"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
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
                      ) : filteredApplications.length > 0 ? (
                        <ul role="list" className="divide-y divide-neutral-200">
                          {filteredApplications.map((application) => (
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
                          <p className="text-sm text-neutral-500">No applications found</p>
                        </div>
                      )}
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