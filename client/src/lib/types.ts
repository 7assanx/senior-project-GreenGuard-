export interface User {
  id: number;
  name: string;
  email: string;
  company?: string;
  role: "user" | "admin";
}

export interface Application {
  id: number;
  userId: number;
  projectName: string;
  projectType: string;
  status: "draft" | "pending" | "in_progress" | "approved" | "rejected" | "needs_info";
  progress: number;
  currentStep: "requirements" | "upload" | "feedback" | "submitted";
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: number;
  applicationId: number;
  name: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  feedback?: DocumentFeedback;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentFeedback {
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

export interface AIFeedbackResponse {
  status: "success" | "error";
  feedback: {
    documentName: string;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
  }[];
}

export interface Certification {
  id: number;
  applicationId: number;
  score: number;
  level: string;
  feedback?: string;
  pdfUrl?: string;
  issuedAt: Date;
}

export interface Firm {
  id: number;
  name: string;
  specialization: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
}

export type ProjectType = "PBRS" | "PCRS" | "PVRS" | "Public Realm";

export interface RequiredDocument {
  name: string;
  description: string;
  required: boolean;
}

export const RequiredDocumentsByType: Record<ProjectType, RequiredDocument[]> = {
  "PBRS": [
    { name: "Energy Efficiency Report", description: "Building energy consumption analysis and efficiency measures", required: true },
    { name: "Water Management Plan", description: "Water conservation strategies and usage reduction plans", required: true },
    { name: "Architectural Floor Plans", description: "Detailed building layouts and spatial arrangements", required: true },
    { name: "Materials Specification", description: "Details of sustainable and locally-sourced building materials", required: true },
    { name: "Indoor Air Quality Assessment", description: "Ventilation strategies and air quality monitoring plans", required: true },
    { name: "Waste Management Plan", description: "Construction and operational waste reduction strategies", required: true },
    { name: "Site Analysis Report", description: "Environmental analysis of the building location", required: true },
    { name: "Landscaping Plan", description: "Sustainable landscaping design and native plant selection", required: true },
    { name: "Transportation Plan", description: "Access to public transport and alternative transportation options", required: false },
    { name: "Lighting Design", description: "Energy-efficient lighting schemes and daylight utilization", required: true },
    { name: "Thermal Comfort Analysis", description: "Indoor thermal comfort strategies and analysis", required: true },
    { name: "Commissioning Plan", description: "Building systems testing and commissioning procedures", required: false }
  ],
  "PCRS": [
    { name: "Master Plan", description: "Overall community layout and zoning plan", required: true },
    { name: "Transportation Network Plan", description: "Road networks, public transport, and pedestrian pathways", required: true },
    { name: "Community Facilities Plan", description: "Schools, healthcare, and community facilities locations", required: true },
    { name: "Natural Systems Assessment", description: "Existing ecological features and conservation strategies", required: true },
    { name: "Water Management Strategy", description: "Community-wide water conservation and management", required: true },
    { name: "Energy Strategy", description: "District energy systems and renewable energy integration", required: true },
    { name: "Waste Management Plan", description: "Community waste collection and recycling systems", required: true },
    { name: "Economic Development Plan", description: "Commercial centers and economic sustainability", required: false },
    { name: "Social Cohesion Strategy", description: "Plans for creating community identity and cultural elements", required: false },
    { name: "Phasing Plan", description: "Development timeline and implementation phases", required: true },
    { name: "Environmental Impact Assessment", description: "Analysis of development impact on surrounding environment", required: true },
    { name: "Infrastructure Systems Plan", description: "Utilities, communications, and infrastructure networks", required: true }
  ],
  "PVRS": [
    { name: "Villa Floor Plans", description: "Detailed layouts of the residential villa", required: true },
    { name: "Energy Efficiency Analysis", description: "Villa energy consumption and conservation measures", required: true },
    { name: "Water Conservation Plan", description: "Water-saving fixtures and irrigation systems", required: true },
    { name: "Materials Specification", description: "Sustainable building materials for the villa", required: true },
    { name: "Thermal Insulation Details", description: "Wall, roof, and window thermal performance specifications", required: true },
    { name: "HVAC System Design", description: "Heating, ventilation, and air conditioning specifications", required: true },
    { name: "Landscape Design", description: "Garden design with drought-resistant native plants", required: true },
    { name: "Indoor Air Quality Plan", description: "Ventilation and air quality management strategies", required: true },
    { name: "Shading Analysis", description: "Window shading and passive cooling features", required: false },
    { name: "Lighting Design", description: "Energy-efficient lighting layout and fixtures", required: true },
    { name: "Solar Energy Integration", description: "Solar panel placement and capacity calculations", required: false },
    { name: "Water Recycling System", description: "Greywater recycling and rainwater harvesting plans", required: false }
  ],
  "Public Realm": [
    { name: "Site Analysis", description: "Existing site conditions and context analysis", required: true },
    { name: "Landscape Master Plan", description: "Overall design of the public space", required: true },
    { name: "Shading Strategy", description: "Natural and artificial shading elements", required: true },
    { name: "Water Feature Design", description: "Water features and conservation measures", required: true },
    { name: "Planting Plan", description: "Native and adaptive vegetation selection", required: true },
    { name: "Hardscape Materials", description: "Sustainable paving and hardscape elements", required: true },
    { name: "Lighting Design", description: "Energy-efficient public space lighting", required: true },
    { name: "Accessibility Plan", description: "Universal design and accessibility features", required: true },
    { name: "Wayfinding Strategy", description: "Signage and orientation elements", required: false },
    { name: "Public Art Integration", description: "Art installations and cultural elements", required: false },
    { name: "Maintenance Plan", description: "Long-term maintenance and management strategy", required: true },
    { name: "Stormwater Management", description: "Rainwater collection and sustainable drainage", required: true }
  ]
};
