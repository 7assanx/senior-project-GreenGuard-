import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || ''
});

/**
 * Analyzes a document using OpenAI
 */
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

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw new Error("Failed to analyze document: " + (error as Error).message);
  }
}

/**
 * Gets simulated document content for testing purposes
 */
export function getSimulatedDocumentContent(documentName: string): string {
  switch(documentName) {
    case "Energy Efficiency Report":
      return `
        Energy Efficiency Report for Project XYZ
        
        Baseline Energy Consumption:
        The building's baseline energy consumption has been calculated at 150 kWh/m²/year based on similar buildings in the region.
        
        Passive Design Strategies:
        1. Building orientation optimized to minimize solar heat gain
        2. High-performance glazing with low SHGC values on east and west facades
        3. External shading devices on south-facing windows
        4. Improved insulation in walls (U-value: 0.25 W/m²K) and roof (U-value: 0.20 W/m²K)
        
        Active Systems:
        The building will use Variable Refrigerant Flow (VRF) systems for cooling with zonal control.
        
        Renewable Energy:
        A 50kW solar PV system will be installed on the roof, covering approximately 15% of the building's energy needs.
      `;
    
    case "Water Management Plan":
      return `
        Water Management Plan for Project XYZ
        
        Water Conservation Strategies:
        1. Low-flow fixtures in all bathrooms and kitchens
        2. Water-efficient landscaping using native, drought-resistant plants
        3. Smart irrigation system with soil moisture sensors
        
        Rainwater Harvesting:
        A 20,000-liter underground storage tank will collect rainwater from the roof area of 1,500 m².
        
        Greywater Recycling:
        Greywater from showers and bathroom sinks will be collected and treated for toilet flushing and irrigation.
        
        Water Monitoring:
        Water meters will be installed at key points in the building to monitor consumption.
      `;
    
    case "Architectural Floor Plans":
      return `
        Architectural Floor Plans for Project XYZ
        
        The building consists of 12 floors with a total gross floor area of 15,000 m².
        
        Ground Floor:
        - Main lobby (150 m²)
        - Retail spaces (600 m²)
        - Service areas (250 m²)
        
        Typical Floor (Floors 1-10):
        - Office spaces (1,200 m² per floor)
        - Common areas and circulation (150 m² per floor)
        
        Roof Level:
        - Technical rooms (300 m²)
        - Green roof and solar panel area (700 m²)
      `;
    
    default:
      return `${documentName} content for Estidama Pearl Rating System certification.`;
  }
}