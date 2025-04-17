import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { jsPDF } from "jspdf";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Application } from "@/lib/types";

type DashboardStatProps = {
  title: string;
  value: string | number;
  icon: string;
  linkText?: string;
  linkHref?: string;
  color?: string;
  approvedApplications?: Application[];
};

export default function DashboardStat({
  title,
  value,
  icon,
  linkText,
  linkHref,
  color = "text-primary",
  approvedApplications = []
}: DashboardStatProps) {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);

  // Function to handle certificate download by application ID
  const handleCertificateDownloadById = async (applicationId: number, projectName: string) => {
    try {
      // Create a URL for the certificate
      const downloadUrl = `/api/applications/${applicationId}/certification/download`;
      
      // Try to get certificate data from API
      try {
        const response = await apiRequest("GET", downloadUrl);
        const data = await response.json();
        
        if (data.certificationData) {
          // Use the existing method to generate PDF with server data
          generateCertificatePDF(data.certificationData, data.fileName);
          setShowCertificateDialog(false);
          return;
        }
      } catch (error) {
        console.log("No server certificate data, using local generation");
      }
      
      // Fallback to generating a certificate locally
      const certData = {
        projectName: projectName,
        userName: "Project Owner",
        certLevel: "4 Pearl Rating",
        projectType: "Building Project",
        score: 40,
        issueDate: new Date().toLocaleDateString()
      };
      
      generateCertificatePDF(certData, `certificate-${applicationId}.pdf`);
      setShowCertificateDialog(false);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast({
        title: "Error",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle dialog opening
  const handleLinkClick = (e: React.MouseEvent) => {
    if (title === "Approved" && approvedApplications.length > 0) {
      e.preventDefault();
      setShowCertificateDialog(true);
    }
  };
  
  // Function to handle certificate download by URL
  const handleCertificateDownload = async (downloadUrl: string) => {
    try {
      // Extract application id from URL
      const appId = downloadUrl.split('/').filter(part => part.length > 0)[2];
      
      if (!appId) {
        throw new Error("Invalid certification URL");
      }
      
      const response = await apiRequest("GET", downloadUrl);
      const data = await response.json();
      
      if (!data.certificationData) {
        throw new Error("Certificate data not found");
      }
      
      // Create PDF document
      generateCertificatePDF(data.certificationData, data.fileName);
      
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast({
        title: "Error",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Function to generate and download the PDF
  const generateCertificatePDF = (certData: any, fileName: string) => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add logo/header
      doc.setFontSize(22);
      doc.setTextColor(34, 139, 34); // Green color
      doc.text("Green Guard", 105, 20, { align: "center" });
      doc.text("Estidama Pearl Rating Certification", 105, 30, { align: "center" });
      
      // Add decorative element
      doc.setDrawColor(34, 139, 34);
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      // Add certificate content
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("This certifies that", 105, 50, { align: "center" });
      
      // Project name and user
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(certData.projectName, 105, 60, { align: "center" });
      doc.setFontSize(14);
      doc.text(`by ${certData.userName}`, 105, 70, { align: "center" });
      
      // Certification details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.text("has been awarded", 105, 85, { align: "center" });
      
      // Certification level
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(34, 139, 34);
      doc.text(certData.certLevel, 105, 95, { align: "center" });
      
      // Additional details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Project Type: ${certData.projectType}`, 105, 110, { align: "center" });
      doc.text(`Certification Score: ${certData.score/10}/5.0`, 105, 120, { align: "center" });
      doc.text(`Date of Issue: ${certData.issueDate}`, 105, 130, { align: "center" });
      
      // Certificate ID and signature area
      doc.setFontSize(10);
      doc.text(`Certificate ID: ESTIDAMA-${Date.now().toString().substring(0, 10)}`, 20, 180);
      
      // Signature line
      doc.line(105, 160, 180, 160);
      doc.setFontSize(12);
      doc.text("Authorized Signature", 142, 170, { align: "center" });
      
      // Download the PDF
      doc.save(fileName);
      
      toast({
        title: "Success",
        description: "Certificate downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate certificate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className={`${icon} ${color} text-3xl`}></i>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-neutral-500 truncate">
                  {title}
                </dt>
                <dd>
                  <div className="text-lg font-medium text-neutral-900">{value}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        {linkText && linkHref && (
          <div className="bg-neutral-50 px-5 py-3">
            <div className="text-sm">
              {title === "Approved" && approvedApplications.length > 0 ? (
                // Show dialog for selecting approved application
                <button
                  onClick={handleLinkClick}
                  className="font-medium text-primary hover:text-primary-dark cursor-pointer bg-transparent border-none p-0"
                >
                  {linkText}
                </button>
              ) : linkHref.includes('/download') ? (
                // Legacy button for PDF generation
                <button
                  onClick={() => handleCertificateDownload(linkHref)}
                  className="font-medium text-primary hover:text-primary-dark cursor-pointer bg-transparent border-none p-0"
                >
                  {linkText}
                </button>
              ) : (
                // Use Link component for navigation within the app
                <Link
                  href={linkHref}
                  className="font-medium text-primary hover:text-primary-dark cursor-pointer"
                >
                  {linkText}
                </Link>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Certificate Selection Dialog */}
      <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download Certificate</DialogTitle>
            <DialogDescription>
              Select an approved application to download its certificate
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-3">
            {approvedApplications.length > 0 ? (
              approvedApplications.map((app) => (
                <div key={app.id} className="p-3 border rounded-md hover:bg-neutral-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{app.projectName}</h4>
                      <p className="text-sm text-neutral-500">{app.projectType}</p>
                    </div>
                    <Button 
                      onClick={() => handleCertificateDownloadById(app.id, app.projectName)}
                      size="sm"
                    >
                      <i className="ri-download-line mr-1"></i> Download
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-center text-neutral-500">
                No approved applications found
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
