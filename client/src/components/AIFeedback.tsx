import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIFeedbackResponse } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

type AIFeedbackProps = {
  applicationId: number;
  hasFeedback?: boolean;
};

export default function AIFeedback({ applicationId, hasFeedback = false }: AIFeedbackProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch feedback data if hasFeedback is true
  const { data: feedback } = useQuery<AIFeedbackResponse>({
    queryKey: [`/api/applications/${applicationId}/feedback`],
    enabled: hasFeedback,
  });

  const getFeedback = async () => {
    setIsLoading(true);
    try {
      // Call the server-side endpoint to get AI feedback
      const response = await apiRequest("POST", `/api/applications/${applicationId}/feedback`, {});
      const data = await response.json();
      
      // Invalidate the query to refetch the feedback
      queryClient.invalidateQueries({ queryKey: [`/api/applications/${applicationId}/feedback`] });
      
      toast({
        title: "Feedback generated",
        description: "AI feedback has been generated for your documents.",
      });
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      toast({
        title: "Failed to get feedback",
        description: error instanceof Error ? error.message : "There was an error generating AI feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render feedback for a specific document
  const renderFeedbackItem = (docName: string, strengths: string[], weaknesses: string[], recommendation: string) => (
    <div className="flex items-start">
      <div className="flex-shrink-0 pt-0.5">
        <i className="ri-robot-line text-primary text-2xl"></i>
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-neutral-900">{docName} Feedback:</p>
        <div className="mt-2 text-sm text-neutral-700">
          <ul className="list-disc pl-5 space-y-1">
            {strengths.map((strength, idx) => (
              <li key={`strength-${idx}`} className="text-green-600">{strength}</li>
            ))}
            {weaknesses.map((weakness, idx) => (
              <li key={`weakness-${idx}`} className="text-red-600">{weakness}</li>
            ))}
          </ul>
          <p className="mt-3">Recommendation: {recommendation}</p>
        </div>
      </div>
    </div>
  );

  // Default feedback to show when we have hasFeedback=true but no actual feedback yet
  const defaultFeedback = {
    documentName: "Energy Efficiency Report",
    strengths: [
      "Good coverage of baseline energy consumption data",
      "Excellent passive design strategies for reducing cooling loads"
    ],
    weaknesses: [
      "Missing detailed HVAC system specifications and efficiency ratings",
      "Renewable energy integration section needs expansion"
    ],
    recommendation: "Add the missing HVAC specifications and expand the renewable energy section before final submission."
  };

  // Check if feedback has items
  const hasFeedbackItems = feedback && feedback.feedback && feedback.feedback.length > 0;
  
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
        {(hasFeedbackItems || hasFeedback) ? (
          <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
            {/* Show real feedback if available, or default during loading */}
            {hasFeedbackItems ? (
              <>
                {/* First feedback item */}
                {feedback && feedback.feedback && feedback.feedback[0] && renderFeedbackItem(
                  feedback.feedback[0].documentName,
                  feedback.feedback[0].strengths,
                  feedback.feedback[0].weaknesses,
                  feedback.feedback[0].recommendation
                )}
                
                {/* Show additional feedback items if available */}
                {feedback && feedback.feedback && feedback.feedback.slice(1).map((item, index) => (
                  <div key={index} className="mt-4 pt-4 border-t border-neutral-200">
                    {renderFeedbackItem(
                      item.documentName,
                      item.strengths,
                      item.weaknesses,
                      item.recommendation
                    )}
                  </div>
                ))}
              </>
            ) : (
              // Show default feedback when hasFeedback=true but no actual data yet
              renderFeedbackItem(
                defaultFeedback.documentName,
                defaultFeedback.strengths,
                defaultFeedback.weaknesses,
                defaultFeedback.recommendation
              )
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
                <i className="ri-feedback-line mr-1"></i> {hasFeedbackItems ? "Refresh AI Feedback" : "Get AI Feedback on All Documents"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
