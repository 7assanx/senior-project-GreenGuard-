import { AIFeedbackResponse } from './types';

// Mock AI feedback function (in a real app, this would call the OpenAI API)
export async function getAIFeedback(
  applicationId: number,
  documentIds: number[] = []
): Promise<AIFeedbackResponse> {
  // In a real application, this would fetch the documents and send them to the OpenAI API
  // For this demo, we'll return mock feedback
  
  return {
    status: "success",
    feedback: [
      {
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
      },
      {
        documentName: "Water Management Plan",
        strengths: [
          "Comprehensive water conservation strategies",
          "Well-designed rainwater harvesting system"
        ],
        weaknesses: [
          "Greywater recycling system lacks detailed specifications",
          "Water monitoring plan needs more specific metrics"
        ],
        recommendation: "Enhance the greywater recycling system details and add specific water usage monitoring metrics."
      }
    ]
  };
}

// In a real implementation, we'd connect to the OpenAI API as follows:
/*
import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeDocument(document: { name: string, content: string }): Promise<{
  strengths: string[],
  weaknesses: string[],
  recommendation: string
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert on the Estidama Pearl Rating System. Analyze the following document and provide a detailed assessment with strengths, weaknesses, and recommendations for improvement. Respond with JSON in this format: { 'strengths': string[], 'weaknesses': string[], 'recommendation': string }",
        },
        {
          role: "user",
          content: `Document Name: ${document.name}\n\nContent: ${document.content}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error("Failed to analyze document: " + error.message);
  }
}
*/
