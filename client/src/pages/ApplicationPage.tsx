import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import DocumentItem from "@/components/DocumentItem";
import { Application, Document, RequiredDocumentsByType, ProjectType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { calculateProgress, getProjectTypeLabel } from "@/lib/utils";
import { jsPDF } from "jspdf";

export default function ApplicationPage() {
  const { user, isAuthenticated } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const applicationId = parseInt(params.id);
  
  // Function to generate and download a certificate as PDF
  const downloadCertificate = async () => {
    if (!application) return;
    
    setIsDownloading(true);
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add green header
      doc.setFillColor(16, 185, 129); // #10b981 - primary green color
      doc.rect(0, 0, 210, 40, 'F');
      
      // Add logo/title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('Green Guard', 105, 20, { align: 'center' });
      doc.setFontSize(16);
      doc.text('Pearl Rating System Certificate', 105, 30, { align: 'center' });
      
      // Add certificate content
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      
      // Project details
      doc.setFont('helvetica', 'bold');
      doc.text('Certificate of Achievement', 105, 60, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('This is to certify that the project:', 105, 70, { align: 'center' });
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(application.projectName, 105, 80, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`has been evaluated under the ${getProjectTypeLabel(application.projectType)}`, 105, 90, { align: 'center' });
      doc.text('and has achieved:', 105, 100, { align: 'center' });
      
      // Rating
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129); // Green color
      doc.text('4 Pearl Rating', 105, 120, { align: 'center' });
      
      // Date and signature
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 105, 140, { align: 'center' });
      doc.text('Certificate ID: ' + applicationId + '-' + Math.floor(Math.random() * 10000), 105, 150, { align: 'center' });
      
      // Signature placeholder
      doc.setFont('helvetica', 'italic');
      doc.text('Digitally Signed', 105, 170, { align: 'center' });
      doc.line(75, 175, 135, 175); // Signature line
      
      doc.setFont('helvetica', 'normal');
      doc.text('Green Guard Certification Authority', 105, 185, { align: 'center' });
      
      // Green footer
      doc.setFillColor(240, 253, 244); // Light green
      doc.rect(0, 250, 210, 50, 'F');
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(8);
      doc.text('This certificate was issued by Green Guard, the official certification body for the Pearl Rating System.', 105, 260, { align: 'center' });
      doc.text('Verify this certificate at www.greenguard.com/verify', 105, 265, { align: 'center' });
      
      // Save the PDF
      doc.save(`${application.projectName.replace(/\s+/g, '_')}_Certificate.pdf`);
      
      toast({
        title: "Certificate Downloaded",
        description: "Your certificate has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch application details
  const { data: application, isLoading: isLoadingApplication, error: applicationError } = useQuery<Application>({
    queryKey: [`/api/applications/${applicationId}`],
    enabled: isAuthenticated && !isNaN(applicationId),
  });

  // Fetch documents for the application
  const { data: documents, isLoading: isLoadingDocuments, error: documentsError } = useQuery<Document[]>({
    queryKey: [`/api/applications/${applicationId}/documents`],
    enabled: isAuthenticated && !isNaN(applicationId),
  });

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", `/api/applications/${applicationId}/submit`, {});
      
      toast({
        title: "Application submitted",
        description: "Your application has been submitted for review successfully!",
      });
      
      // Invalidate the application query to refresh the status
      queryClient.invalidateQueries({ queryKey: [`/api/applications/${applicationId}`] });
      
      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not submit application. Please ensure all required documents are uploaded.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || isNaN(applicationId)) {
    return null; // Will redirect in the useEffect
  }

  const isLoading = isLoadingApplication || isLoadingDocuments;
  const hasError = applicationError || documentsError;

  // Get required documents for the application type
  const projectType = application?.projectType as ProjectType;
  const requiredDocuments = projectType ? RequiredDocumentsByType[projectType] : [];
  
  // Check if each required document has been uploaded
  const uploadedDocumentNames = documents?.map(doc => doc.name) || [];
  const documentsUploaded = documents?.length || 0;
  const totalRequiredDocuments = requiredDocuments.length;
  
  // Calculate progress using our enhanced function that considers documents and application status
  const progress = calculateProgress(
    application?.currentStep || "requirements",
    application?.status,
    documentsUploaded,
    totalRequiredDocuments
  );
  
  // Update the application with the calculated progress (if needed)
  useEffect(() => {
    // Only update if the application exists, is in draft status, and the progress differs
    if (application && application.status === "draft" && application.progress !== progress) {
      // Update progress on the server
      try {
        apiRequest("PATCH", `/api/applications/${applicationId}`, { progress });
      } catch (error) {
        console.error("Failed to update progress:", error);
      }
    }
  }, [application, progress, applicationId]);
  
  // Determine if all required documents are uploaded to enable submission
  const requiredDocsUploaded = requiredDocuments
    .filter(doc => doc.required)
    .every(doc => uploadedDocumentNames.includes(doc.name));
  
  const canSubmit = requiredDocsUploaded && application?.status === "draft";
  const hasFeedback = application?.currentStep === "feedback";

  return (
    <div className="h-screen flex overflow-hidden bg-neutral-100">
      {/* Sidebar */}
      <Sidebar activePage="applications" />
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <MobileHeader title="Green Guard" activePage="applications" />
        
        {/* Application content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-neutral-900">
                  {isLoading ? "Loading..." : application?.projectName || "Application"}
                </h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  application?.status === "approved" ? "bg-green-100 text-green-800" :
                  application?.status === "rejected" ? "bg-red-100 text-red-800" :
                  application?.status === "needs_info" ? "bg-orange-100 text-orange-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {isLoading ? "Loading..." : application?.status === "draft" ? "In Progress" :
                   application?.status === "pending" ? "Pending Review" :
                   application?.status === "in_progress" ? "Being Processed" :
                   application?.status === "approved" ? "Approved" :
                   application?.status === "rejected" ? "Rejected" :
                   application?.status === "needs_info" ? "Action Required" :
                   application?.status}
                </span>
              </div>
              
              {/* Notification banner for applications needing more information */}
              {application?.status === "needs_info" && (
                <div className="mt-4 bg-orange-50 border-l-4 border-orange-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className="ri-information-line text-orange-400 text-xl"></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-orange-800">Additional Information Requested</h3>
                      <div className="mt-2 text-sm text-orange-700">
                        <p>
                          The certification team needs additional information for your application:
                        </p>
                        {application.feedbackMessage ? (
                          <div className="mt-2 p-3 bg-orange-100 rounded-md">
                            <p className="text-sm text-orange-900 whitespace-pre-line">
                              {application.feedbackMessage}
                            </p>
                          </div>
                        ) : (
                          <p>
                            Please review the requirements below and update your application documents.
                          </p>
                        )}
                      </div>
                      <div className="mt-4">
                        <div className="-mx-2 -my-1.5 flex">
                          <Button 
                            variant="outline"
                            onClick={async () => {
                              try {
                                // Update the application status back to draft so user can edit it
                                await apiRequest("PATCH", `/api/applications/${applicationId}`, { 
                                  status: "draft" 
                                });
                                
                                toast({
                                  title: "Application status updated",
                                  description: "You can now update your documents.",
                                });
                                
                                // Refresh the application data
                                queryClient.invalidateQueries({ queryKey: [`/api/applications/${applicationId}`] });
                              } catch (error) {
                                toast({
                                  title: "Error",
                                  description: "Failed to update application status.",
                                  variant: "destructive",
                                });
                              }
                            }}
                            className="bg-orange-50 text-orange-800 border-orange-300 hover:bg-orange-100"
                          >
                            <i className="ri-edit-line mr-1"></i> Update Documents
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                {/* Document upload section */}
                <div className="mt-6">
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 border-b border-neutral-200 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-neutral-900">
                        Required Documents
                      </h3>
                      <p className="mt-1 text-sm text-neutral-500">
                        Upload all required documents for your {application?.projectType} certification.
                      </p>
                    </div>
                    
                    <div className="px-4 py-5 sm:p-6">
                      {/* Document List */}
                      <ul className="divide-y divide-neutral-200">
                        {requiredDocuments.map((requiredDoc) => {
                          const uploadedDoc = documents?.find(doc => doc.name === requiredDoc.name);
                          return (
                            <DocumentItem
                              key={requiredDoc.name}
                              requiredDocument={requiredDoc}
                              applicationId={applicationId}
                              uploadedDocument={uploadedDoc}
                              // Pass a read-only mode flag if application is no longer editable
                              readOnly={application?.status !== "draft" && application?.status !== "needs_info"}
                            />
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="inline-flex items-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <i className="ri-arrow-left-line mr-1"></i> Back to Dashboard
                  </Button>
                  
                  {/* Only show action buttons if application is editable (draft status) */}
                  {application?.status === "draft" ? (
                    <div className="space-x-3">
                      <Button
                        variant="outline"
                        className="mr-3 inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-primary bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Save Progress
                      </Button>
                      <Button
                        onClick={handleSubmitApplication}
                        disabled={!canSubmit || isSubmitting}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${canSubmit ? 'bg-primary hover:bg-primary-dark' : 'bg-neutral-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                      >
                        {isSubmitting ? (
                          <>
                            <i className="ri-loader-2-line animate-spin mr-1"></i> Submitting...
                          </>
                        ) : (
                          <>
                            <i className="ri-send-plane-line mr-1"></i> Submit Application
                          </>
                        )}
                      </Button>
                    </div>
                  ) : application?.status === "approved" ? (
                    <Button
                      onClick={downloadCertificate}
                      disabled={isDownloading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      {isDownloading ? (
                        <>
                          <i className="ri-loader-2-line animate-spin mr-1"></i> Generating...
                        </>
                      ) : (
                        <>
                          <i className="ri-download-2-line mr-1"></i> Download Certificate
                        </>
                      )}
                    </Button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
