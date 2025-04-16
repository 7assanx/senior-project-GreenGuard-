import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { Application, Document, User, ProjectType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { formatDate, getProjectTypeLabel } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const certificationSchema = z.object({
  score: z.coerce.number().min(0).max(5),
  level: z.string().min(1, { message: "Certification level is required" }),
  feedback: z.string().min(10, { message: "Feedback must be at least 10 characters" }),
  generateCertificate: z.boolean(),
});

type CertificationFormValues = z.infer<typeof certificationSchema>;

// Extended application with user details for admin view
interface ApplicationWithUser extends Application {
  userName?: string;
  userEmail?: string;
}

export default function AdminReview() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const applicationId = parseInt(params.id);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    } else if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch application details
  const { data: application, isLoading: isLoadingApplication, error: applicationError } = useQuery<ApplicationWithUser>({
    queryKey: [`/api/applications/${applicationId}`],
    enabled: isAuthenticated && isAdmin && !isNaN(applicationId),
  });

  // Fetch documents for the application
  const { data: documents, isLoading: isLoadingDocuments, error: documentsError } = useQuery<Document[]>({
    queryKey: [`/api/applications/${applicationId}/documents`],
    enabled: isAuthenticated && isAdmin && !isNaN(applicationId),
  });

  // Fetch applicant user details
  const { data: applicant, isLoading: isLoadingApplicant } = useQuery<User>({
    queryKey: [`/api/users/${application?.userId}`],
    enabled: isAuthenticated && isAdmin && !!application?.userId,
  });

  const form = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      score: 2.7,
      level: "2 Pearl",
      feedback: "Congratulations on achieving 2 Pearl certification! Your energy efficiency measures and architectural plans meet the requirements. To improve your rating in the future, please provide more detailed specifications for your greywater recycling system in the water management plan.",
      generateCertificate: true,
    },
  });

  async function onSubmit(values: CertificationFormValues) {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", `/api/admin/applications/${applicationId}/certify`, {
        score: values.score,
        level: values.level,
        feedback: values.feedback,
        pdfUrl: values.generateCertificate ? `/certificates/application-${applicationId}.pdf` : undefined,
      });
      
      toast({
        title: "Certification approved",
        description: "The application has been certified successfully!",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/applications/${applicationId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      
      // Navigate back to admin dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Certification error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not certify application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleRequestMoreInfo = async () => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", `/api/admin/applications/${applicationId}/request-info`, {
        feedback: "Please provide additional information for your application.",
      });
      
      toast({
        title: "Request sent",
        description: "The request for more information has been sent to the applicant.",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/applications/${applicationId}`] });
      
      // Navigate back to admin dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not send request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !isAdmin || isNaN(applicationId)) {
    return null; // Will redirect in the useEffect
  }

  const isLoading = isLoadingApplication || isLoadingDocuments || isLoadingApplicant;
  const hasError = applicationError || documentsError;

  // Determine document scores from form (would normally come from saved state)
  const documentScores = [
    { name: "Energy Efficiency Report", score: 3 },
    { name: "Water Management Plan", score: 2 },
    { name: "Architectural Floor Plans", score: 3 },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-neutral-100">
      {/* Sidebar */}
      <Sidebar isAdmin={true} activePage="applications" />
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <MobileHeader isAdmin={true} title="Green Guard" activePage="applications" />
        
        {/* Review content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-neutral-900">Application Review</h1>
                  <p className="mt-1 text-sm text-neutral-500">
                    {isLoading ? "Loading..." : `${application?.projectName || "Unknown"} (${getProjectTypeLabel(application?.projectType || "Unknown")})`}
                  </p>
                </div>
                <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  {isLoading ? "Loading..." : application?.status === "draft" ? "In Progress" :
                   application?.status === "pending" ? "Pending Review" :
                   application?.status === "in_progress" ? "Being Processed" :
                   application?.status === "approved" ? "Approved" :
                   application?.status === "rejected" ? "Rejected" :
                   application?.status}
                </span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              </div>
            ) : hasError ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
                <div className="text-center py-8">
                  <p className="text-red-500">Error loading application. Please try again.</p>
                  <Button onClick={() => window.location.reload()} className="mt-4">
                    Retry
                  </Button>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Applicant Information */}
                <div className="mt-6">
                  <Card className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <CardTitle className="px-4 py-5 sm:px-6 text-lg leading-6 font-medium text-neutral-900">
                      Applicant Information
                    </CardTitle>
                    <div className="border-t border-neutral-200">
                      <dl>
                        <div className="bg-neutral-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-neutral-500">
                            Applicant name
                          </dt>
                          <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                            {application?.userName || "Unknown"}
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-neutral-500">
                            Company
                          </dt>
                          <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                            {applicant?.company || "Not specified"}
                          </dd>
                        </div>
                        <div className="bg-neutral-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-neutral-500">
                            Email address
                          </dt>
                          <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                            {application?.userEmail || applicant?.email || "Unknown"}
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-neutral-500">
                            Project type
                          </dt>
                          <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                            {getProjectTypeLabel(application?.projectType || "Unknown")}
                          </dd>
                        </div>
                        <div className="bg-neutral-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-neutral-500">
                            Submission date
                          </dt>
                          <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
                            {application ? formatDate(application.createdAt) : "Unknown"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </Card>
                </div>
                
                {/* Document Review */}
                <div className="mt-8">
                  <Card className="bg-white shadow overflow-hidden sm:rounded-md">
                    <CardHeader className="px-4 py-5 border-b border-neutral-200 sm:px-6">
                      <CardTitle className="text-lg leading-6 font-medium text-neutral-900">
                        Document Review
                      </CardTitle>
                      <p className="mt-1 text-sm text-neutral-500">
                        Review submitted documents and compare against certification requirements.
                      </p>
                    </CardHeader>
                    
                    <CardContent className="px-4 py-5 sm:p-6">
                      <div className="space-y-6">
                        {documents && documents.length > 0 ? (
                          documents.map((document, index) => {
                            const docScore = documentScores.find(ds => ds.name === document.name)?.score || 0;
                            
                            return (
                              <div key={document.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between bg-neutral-50 px-4 py-3 border-b border-neutral-200">
                                  <h4 className="text-sm font-medium text-neutral-900">{document.name}</h4>
                                  <div className="flex items-center">
                                    <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark text-sm font-medium">View Document</a>
                                  </div>
                                </div>
                                <div className="p-4">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-sm font-medium text-neutral-900">Assessment</h5>
                                    <div className="flex items-center">
                                      <span className="mr-2 text-sm text-neutral-500">Score:</span>
                                      <Select defaultValue={docScore.toString()}>
                                        <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="Select score" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="0">0 - Missing Key Elements</SelectItem>
                                          <SelectItem value="1">1 - Needs Major Revision</SelectItem>
                                          <SelectItem value="2">2 - Needs Minor Revision</SelectItem>
                                          <SelectItem value="3">3 - Meets Requirements</SelectItem>
                                          <SelectItem value="4">4 - Exceeds Requirements</SelectItem>
                                          <SelectItem value="5">5 - Exceptional Quality</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor={`${document.name}-notes`} className="block text-sm font-medium text-neutral-700">Review Notes</Label>
                                    <div className="mt-1">
                                      <Textarea 
                                        id={`${document.name}-notes`}
                                        rows={3}
                                        defaultValue={document.name === "Energy Efficiency Report" ? 
                                          "The energy efficiency report provides comprehensive analysis of building consumption patterns and efficiency measures. HVAC specifications meet requirements. Renewable energy integration is well-documented. Overall meets Pearl requirements with some innovative approaches." :
                                          document.name === "Water Management Plan" ?
                                          "Water conservation strategies are well-considered, but greywater recycling system specifications need more detail. Monitoring plan is sufficient. Overall good, but needs minor revisions to fully meet requirements." :
                                          document.name === "Architectural Floor Plans" ?
                                          "Floor plans are complete and correctly formatted. Spatial arrangements align with sustainable design principles. Natural lighting and ventilation pathways are well-integrated. Meets all Pearl requirements." :
                                          ""}
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-neutral-300 rounded-md"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-sm text-neutral-500">No documents have been uploaded for this application.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Certification Decision */}
                <div className="mt-8">
                  <Card className="bg-white shadow overflow-hidden sm:rounded-md">
                    <CardHeader className="px-4 py-5 border-b border-neutral-200 sm:px-6">
                      <CardTitle className="text-lg leading-6 font-medium text-neutral-900">
                        Certification Decision
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="px-4 py-5 sm:p-6">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="score"
                            render={({ field }) => (
                              <FormItem className="mb-6">
                                <FormLabel className="block text-sm font-medium text-neutral-700">Overall Score</FormLabel>
                                <div className="mt-1 flex items-center">
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      step="0.1"
                                      min="0"
                                      max="5"
                                      {...field} 
                                      className="shadow-sm focus:ring-primary focus:border-primary block w-32 sm:text-sm border-neutral-300 rounded-md"
                                    />
                                  </FormControl>
                                  <span className="ml-2 text-sm text-neutral-500">out of 5</span>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                              <FormItem className="mb-6">
                                <FormLabel className="block text-sm font-medium text-neutral-700">Certification Level</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                      <SelectValue placeholder="Select level..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Not Certified">Not Certified</SelectItem>
                                      <SelectItem value="1 Pearl">1 Pearl</SelectItem>
                                      <SelectItem value="2 Pearl">2 Pearl</SelectItem>
                                      <SelectItem value="3 Pearl">3 Pearl</SelectItem>
                                      <SelectItem value="4 Pearl">4 Pearl</SelectItem>
                                      <SelectItem value="5 Pearl">5 Pearl</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="feedback"
                            render={({ field }) => (
                              <FormItem className="mb-6">
                                <FormLabel className="block text-sm font-medium text-neutral-700">Feedback to Applicant</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    rows={4} 
                                    {...field} 
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-neutral-300 rounded-md"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="generateCertificate"
                            render={({ field }) => (
                              <FormItem className="mb-6">
                                <div className="relative flex items-start">
                                  <FormControl>
                                    <div className="flex items-center h-5">
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        id="generate-certificate"
                                      />
                                    </div>
                                  </FormControl>
                                  <div className="ml-3 text-sm">
                                    <label htmlFor="generate-certificate" className="font-medium text-neutral-700">Generate Certificate PDF</label>
                                    <p className="text-neutral-500">A PDF certificate will be automatically generated and sent to the applicant.</p>
                                  </div>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end space-x-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleRequestMoreInfo}
                              disabled={isSubmitting}
                              className="inline-flex items-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              Request More Information
                            </Button>
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              {isSubmitting ? (
                                <>
                                  <i className="ri-loader-2-line animate-spin mr-1"></i> Processing...
                                </>
                              ) : "Approve Certification"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Action buttons */}
                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/admin/dashboard")}
                    className="inline-flex items-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <i className="ri-arrow-left-line mr-1"></i> Back to Dashboard
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-primary bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Save Draft
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
