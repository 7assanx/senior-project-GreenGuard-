import { ReactNode } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { jsPDF } from "jspdf";

type DashboardStatProps = {
  title: string;
  value: string | number;
  icon: string;
  linkText?: string;
  linkHref?: string;
  color?: string;
};

export default function DashboardStat({
  title,
  value,
  icon,
  linkText,
  linkHref,
  color = "text-primary",
}: DashboardStatProps) {
  const { toast } = useToast();

  // Function to handle certificate download
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
            {linkHref.includes('/download') ? (
              // Use button for PDF generation
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
  );
}
