import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Application } from "@/lib/types";
import { Link } from "wouter";
import { calculateProgress } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ApplicationProgressProps = {
  application: Application;
};

export default function ApplicationProgress({ application }: ApplicationProgressProps) {
  const progress = application.progress || calculateProgress(application.currentStep);
  
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
  const currentStepIndex = application.status !== "draft" 
    ? 3  // If not draft, we've completed all steps
    : currentStepMap[application.currentStep] || 0;
  
  const steps = [
    { 
      id: "requirements", 
      label: "Document Requirements", 
      description: "Review all required documents",
      icon: "ri-check-line",
      isCompleted: currentStepIndex > 0 || application.progress >= 25,
      isActive: application.currentStep === "requirements"
    },
    { 
      id: "upload", 
      label: "Upload Documents", 
      description: "Upload the required files",
      icon: "ri-file-upload-line",
      isCompleted: currentStepIndex > 1 || application.progress >= 50,
      isActive: application.currentStep === "upload"
    },
    { 
      id: "feedback", 
      label: "AI Feedback", 
      description: "Get AI analysis of your documents",
      icon: "ri-robot-line",
      isCompleted: currentStepIndex > 2 || application.progress >= 75 || application.status !== "draft",
      isActive: application.currentStep === "feedback"
    },
    { 
      id: "submitted", 
      label: "Submit Application", 
      description: "Final review and submission",
      icon: "ri-send-plane-line",
      isCompleted: application.status !== "draft" || application.progress >= 100,
      isActive: application.currentStep === "submitted"
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
            {application.projectType === "PBRS" ? "Pearl Building Rating System (PBRS)" : 
             application.projectType === "PCRS" ? "Pearl Community Rating System (PCRS)" :
             application.projectType === "PVRS" ? "Pearl Villa Rating System (PVRS)" :
             application.projectType === "Public Realm" ? "Public Realm Rating System" : 
             application.projectType}
          </h4>
          <div className="w-full bg-neutral-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-sm text-neutral-500">{progress}% Complete</span>
            <span className="text-sm text-neutral-500">
              Status: {application.status === "draft" ? "Document Collection" : 
                      application.status === "pending" ? "Under Review" :
                      application.status === "in_progress" ? "Being Processed" :
                      application.status === "approved" ? "Approved" :
                      application.status === "rejected" ? "Rejected" :
                      application.status}
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
          <Link href={`/applications/${application.id}`}>
            <Button variant="default" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Continue Application
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
