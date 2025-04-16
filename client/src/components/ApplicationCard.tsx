import { useState } from "react";
import { Application } from "@/lib/types";
import { formatDate, getStatusBadgeColor, getProjectTypeIcon } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type ApplicationCardProps = {
  application: Application;
  userName?: string;
  userEmail?: string;
  isAdmin?: boolean;
};

export default function ApplicationCard({
  application,
  userName,
  userEmail,
  isAdmin = false
}: ApplicationCardProps) {
  const { bg, text } = getStatusBadgeColor(application.status);
  const icon = getProjectTypeIcon(application.projectType);
  const href = isAdmin 
    ? `/admin/applications/${application.id}`
    : `/applications/${application.id}`;
  
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Function to handle application approval
  const handleApprove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowApproveDialog(true);
  };
  
  // Function to handle application rejection
  const handleReject = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowRejectDialog(true);
  };
  
  // Submit approval
  const submitApproval = async () => {
    setIsProcessing(true);
    try {
      await apiRequest("POST", `/api/admin/applications/${application.id}/certify`, {
        score: 3, // Default score
        level: "3 Pearl",
        feedback: feedback || "Your application has been approved. Congratulations!",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      
      toast({
        title: "Application approved",
        description: "The application has been certified successfully!",
      });
      
      setShowApproveDialog(false);
      setFeedback("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not approve application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Submit rejection
  const submitRejection = async () => {
    setIsProcessing(true);
    try {
      await apiRequest("POST", `/api/admin/applications/${application.id}/reject`, {
        feedback: feedback || "Your application has been rejected. Please review the requirements and resubmit.",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      
      toast({
        title: "Application rejected",
        description: "The application has been rejected successfully.",
      });
      
      setShowRejectDialog(false);
      setFeedback("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not reject application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <li>
      <div className="block hover:bg-neutral-50 relative">
        <div className="cursor-pointer" onClick={() => navigate(href)}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-primary truncate">
                  {application.projectName}
                </p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className={cn("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", bg, text)}>
                    {application.status === "draft" ? "In Progress" :
                     application.status === "pending" ? "Pending Review" :
                     application.status === "in_progress" ? "Being Processed" :
                     application.status === "approved" ? "Approved" :
                     application.status === "rejected" ? "Rejected" :
                     application.status}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-neutral-500">
                    <i className={`${icon} flex-shrink-0 mr-1.5 text-neutral-400`}></i>
                    {application.projectType} Certification
                  </p>
                  {isAdmin && userName && (
                    <p className="mt-2 flex items-center text-sm text-neutral-500 sm:mt-0 sm:ml-6">
                      <i className="ri-user-line flex-shrink-0 mr-1.5 text-neutral-400"></i>
                      {userName}
                    </p>
                  )}
                </div>
                <div className="mt-2 flex items-center text-sm text-neutral-500 sm:mt-0">
                  <i className="ri-calendar-line flex-shrink-0 mr-1.5 text-neutral-400"></i>
                  <p>
                    Submitted on <time dateTime={application.createdAt.toString()}>{formatDate(application.createdAt)}</time>
                  </p>
                </div>
              </div>
            </div>
        </div>
        
        {/* Admin Action Buttons (for all applications) */}
        {isAdmin && (
          <div className="px-4 py-3 sm:px-6 border-t border-neutral-200 bg-neutral-50 flex justify-end space-x-3">
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary hover:bg-primary-50"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/admin/review/${application.id}`);
              }}
            >
              <i className="ri-search-line mr-1"></i> Review
            </Button>
            
            {application.status === "pending" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={handleReject}
                >
                  <i className="ri-close-circle-line mr-1"></i> Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleApprove}
                >
                  <i className="ri-check-line mr-1"></i> Approve
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>
              Enter feedback and confirm certification approval. This will issue a 3 Pearl certification.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter feedback for the applicant (optional)"
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={submitApproval}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isProcessing ? (
                <>
                  <i className="ri-loader-2-line animate-spin mr-1"></i> Processing...
                </>
              ) : (
                <>Approve & Certify</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide feedback on why this application is being rejected.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter rejection reason for the applicant"
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={submitRejection}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isProcessing ? (
                <>
                  <i className="ri-loader-2-line animate-spin mr-1"></i> Processing...
                </>
              ) : (
                <>Reject Application</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
}
