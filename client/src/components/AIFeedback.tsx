import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIFeedbackResponse } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getAIFeedback } from "@/lib/openai";

type AIFeedbackProps = {
  applicationId: number;
  hasFeedback?: boolean;
};

export default function AIFeedback({ applicationId, hasFeedback = false }: AIFeedbackProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedbackResponse | null>(null);
  const { toast } = useToast();

  const getFeedback = async () => {
    setIsLoading(true);
    try {
      // Call the server-side endpoint to get AI feedback
      const response = await apiRequest("POST", `/api/applications/${applicationId}/feedback`, {});
      const data = await response.json();
      
      // In a real application, this would come from the server
      // For this demo, we'll use our mock implementation
      const aiFeedback = await getAIFeedback(applicationId);
      
      setFeedback(aiFeedback);
      
      toast({
        title: "Feedback generated",
        description: "AI feedback has been generated for your documents.",
      });
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      toast({
        title: "Failed to get feedback",
        description: "There was an error generating AI feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white shadow overflow-hidden sm:rounded-md">
      <CardHeader className="px-4 py-5 border-b border-neutral-200 sm:px-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg leading-6 font-medium text-neutral-900">
            AI Document Feedback
          </CardTitle>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-light bg-opacity-10 text-primary-dark">
            <i className="ri-robot-line mr-1"></i> AI Powered
          </span>
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          Get instant feedback on your documents before submitting your application.
        </p>
      </CardHeader>
      
      <CardContent className="px-4 py-5 sm:p-6">
        {feedback || hasFeedback ? (
          <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <i className="ri-robot-line text-primary text-2xl"></i>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-neutral-900">Energy Efficiency Report Feedback:</p>
                <div className="mt-2 text-sm text-neutral-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li className="text-green-600">Good coverage of baseline energy consumption data.</li>
                    <li className="text-green-600">Excellent passive design strategies for reducing cooling loads.</li>
                    <li className="text-red-600">Missing detailed HVAC system specifications and efficiency ratings.</li>
                    <li className="text-red-600">Renewable energy integration section needs expansion.</li>
                  </ul>
                  <p className="mt-3">Recommendation: Add the missing HVAC specifications and expand the renewable energy section before final submission.</p>
                </div>
              </div>
            </div>
            
            {feedback?.feedback.length > 1 && (
              <div className="flex items-start mt-4 pt-4 border-t border-neutral-200">
                <div className="flex-shrink-0 pt-0.5">
                  <i className="ri-robot-line text-primary text-2xl"></i>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-neutral-900">Water Management Plan Feedback:</p>
                  <div className="mt-2 text-sm text-neutral-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li className="text-green-600">Comprehensive water conservation strategies.</li>
                      <li className="text-green-600">Well-designed rainwater harvesting system.</li>
                      <li className="text-red-600">Greywater recycling system lacks detailed specifications.</li>
                      <li className="text-red-600">Water monitoring plan needs more specific metrics.</li>
                    </ul>
                    <p className="mt-3">Recommendation: Enhance the greywater recycling system details and add specific water usage monitoring metrics.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <i className="ri-robot-line text-primary text-4xl mb-3"></i>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Get AI Analysis on Your Documents</h3>
            <p className="mb-4 text-neutral-500">Our AI will analyze your uploaded documents and provide suggestions to improve them before final submission.</p>
          </div>
        )}
        
        <div className="mt-4">
          <Button
            onClick={getFeedback}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isLoading ? (
              <>
                <i className="ri-loader-2-line animate-spin mr-1"></i> Generating feedback...
              </>
            ) : (
              <>
                <i className="ri-feedback-line mr-1"></i> {feedback ? "Refresh AI Feedback" : "Get AI Feedback on All Documents"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
