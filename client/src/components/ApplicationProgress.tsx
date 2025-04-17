import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, calculateProgress } from "@/lib/utils";
import { Application } from "@/lib/types";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type ApplicationProgressProps = {
  application: Application;
};

export default function ApplicationProgress({ application }: ApplicationProgressProps) {
  // Track current application state locally for faster UI updates
  const [currentApplication, setCurrentApplication] = useState<Application>(application);
  
  // Fetch real-time updates to application
  const { data: updatedApplication } = useQuery<Application>({
    queryKey: [`/api/applications/${application.id}`],
    refetchInterval: 3000, // Refresh every 3 seconds
  });
  
  // Update local state when query data changes
  useEffect(() => {
    if (updatedApplication) {
      setCurrentApplication(updatedApplication);
    }
  }, [updatedApplication]);
  
  const progress = currentApplication.progress || calculateProgress(currentApplication.currentStep, currentApplication.status);
  
  // Use the application status to determine which steps are complete
  const currentStepMap = {
    "requirements": 0,
    "upload": 1,
    "feedback": 2,
    "submitted": 3
  };
  
  const statusMap = {
    "draft": "upload",
    "pending": "submitted",
    "in_progress": "submitted",
    "approved": "submitted",
    "rejected": "submitted"
  };
  
  // Get the current step index based on application status and currentStep
  const currentStepIndex = currentApplication.status !== "draft" 
    ? 3  // If not draft, we've completed all steps
    : currentStepMap[currentApplication.currentStep] || 0;
  
  const steps = [
    { 
      id: "requirements", 
      label: "Document Requirements", 
      description: "Review all required documents",
      icon: "ri-file-list-3-line",
      completedIcon: "ri-check-line",
      isCompleted: currentStepIndex > 0 || currentApplication.progress >= 25,
      isActive: currentApplication.currentStep === "requirements"
    },
    { 
      id: "upload", 
      label: "Upload Documents", 
      description: "Upload the required files",
      icon: "ri-file-upload-line",
      completedIcon: "ri-check-line",
      isCompleted: currentStepIndex > 1 || currentApplication.progress >= 50,
      isActive: currentApplication.currentStep === "upload"
    },
    { 
      id: "feedback", 
      label: "AI Feedback", 
      description: "Get AI analysis of your documents",
      icon: "ri-robot-line",
      completedIcon: "ri-check-line",
      isCompleted: currentStepIndex > 2 || currentApplication.progress >= 75 || currentApplication.status !== "draft",
      isActive: currentApplication.currentStep === "feedback"
    },
    { 
      id: "submitted", 
      label: "Submit Application", 
      description: "Final review and submission",
      icon: "ri-send-plane-line",
      completedIcon: "ri-check-line",
      isCompleted: currentApplication.status !== "draft" || currentApplication.progress >= 100,
      isActive: currentApplication.currentStep === "submitted"
    }
  ];

  return (
    <Card className="bg-white shadow overflow-hidden sm:rounded-md">
      <CardHeader className="px-4 py-5 border-b border-neutral-200 sm:px-6">
        <CardTitle className="text-lg leading-6 font-medium text-neutral-900">
          Active Application
        </CardTitle>
        <p className="mt-1 text-sm text-neutral-500">
          Track your certification process and complete the required steps.
        </p>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="mb-6">
          <h4 className="text-base font-medium text-neutral-900 mb-2">
            {currentApplication.projectType === "PBRS" ? "Pearl Building Rating System (PBRS)" : 
             currentApplication.projectType === "PCRS" ? "Pearl Community Rating System (PCRS)" :
             currentApplication.projectType === "PVRS" ? "Pearl Villa Rating System (PVRS)" :
             currentApplication.projectType === "Public Realm" ? "Public Realm Rating System" : 
             currentApplication.projectType}
          </h4>
          <div className="w-full bg-neutral-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${currentApplication.status === "pending" || currentApplication.status === "in_progress" || currentApplication.status === "approved" ? 100 : progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-sm text-neutral-500">
              {currentApplication.status === "pending" || currentApplication.status === "in_progress" || currentApplication.status === "approved" ? "100" : progress}% Complete
            </span>
            <span className="text-sm text-neutral-500">
              Status: {currentApplication.status === "draft" ? "Document Collection" : 
                      currentApplication.status === "pending" ? "Under Review" :
                      currentApplication.status === "in_progress" ? "Being Processed" :
                      currentApplication.status === "approved" ? "Approved" :
                      currentApplication.status === "rejected" ? "Rejected" :
                      currentApplication.status}
            </span>
          </div>
        </div>

        {/* Application steps */}
        <div className="mt-6">
          <nav aria-label="Progress">
            <ol className="overflow-hidden">
              {steps.map((step, index) => (
                <li 
                  key={step.id} 
                  className={cn(
                    "relative",
                    index < steps.length - 1 ? "pb-8" : ""
                  )}
                >
                  {index < steps.length - 1 && (
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className={cn(
                        "h-full w-0.5",
                        step.isCompleted ? "bg-primary" : "bg-neutral-300"
                      )}></div>
                    </div>
                  )}
                  <div className="relative flex items-start group">
                    <span className="h-9 flex items-center">
                      <span className={cn(
                        "relative z-10 w-8 h-8 flex items-center justify-center rounded-full",
                        step.isCompleted ? "bg-primary" : 
                        step.isActive ? "bg-primary" : 
                        "bg-white border-2 border-neutral-300"
                      )}>
                        <i className={cn(
                          step.icon,
                          step.isCompleted || step.isActive ? "text-white" : "text-neutral-400"
                        )}></i>
                      </span>
                    </span>
                    <span className="ml-4 min-w-0 flex flex-col">
                      <span className={cn(
                        "text-sm font-medium",
                        step.isCompleted || step.isActive ? "text-primary" : "text-neutral-500"
                      )}>
                        {step.label}
                      </span>
                      <span className="text-sm text-neutral-500">
                        {step.description}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        
        {/* Action button */}
        <div className="mt-6">
          <Link href={`/applications/${currentApplication.id}`}>
            <Button variant="default" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Continue Application
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
