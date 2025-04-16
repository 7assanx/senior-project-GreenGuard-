import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistance } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMMM d, yyyy");
}

export function formatRelativeTime(date: Date | string): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
}

export function getStatusBadgeColor(status: string): {
  bg: string;
  text: string;
} {
  switch (status?.toLowerCase()) {
    case "approved":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "rejected":
      return { bg: "bg-red-100", text: "text-red-800" };
    case "pending":
      return { bg: "bg-yellow-100", text: "text-yellow-800" };
    case "in_progress":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    case "draft":
      return { bg: "bg-neutral-100", text: "text-neutral-800" };
    default:
      return { bg: "bg-neutral-100", text: "text-neutral-800" };
  }
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

export function getProjectTypeLabel(type: string): string {
  switch (type) {
    case "PBRS":
      return "Pearl Building Rating System";
    case "PCRS":
      return "Pearl Community Rating System";
    case "PVRS":
      return "Pearl Villa Rating System";
    case "Public Realm":
      return "Public Realm Rating System";
    default:
      return type;
  }
}

export function getProjectTypeIcon(type: string): string {
  switch (type) {
    case "PBRS":
      return "ri-building-line";
    case "PCRS":
      return "ri-community-line";
    case "PVRS":
      return "ri-home-4-line";
    case "Public Realm":
      return "ri-landscape-line";
    default:
      return "ri-file-list-3-line";
  }
}

export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function calculateProgress(currentStep: string): number {
  switch (currentStep) {
    case "requirements":
      return 10;
    case "upload":
      return 40;
    case "feedback":
      return 70;
    case "submitted":
      return 100;
    default:
      return 0;
  }
}

export function getPearlRatingLabel(rating: number): string {
  if (rating <= 0) return "Not Certified";
  if (rating <= 1) return "1 Pearl";
  if (rating <= 2) return "2 Pearl";
  if (rating <= 3) return "3 Pearl";
  if (rating <= 4) return "4 Pearl";
  return "5 Pearl";
}

// File upload handler using base64 encoding
export async function uploadFile(file: File): Promise<string> {
  // Check if it's an image that can be compressed
  if (file.type.startsWith('image/') && file.type !== 'image/gif') {
    return compressAndEncodeImage(file);
  }
  
  // For non-image files or gif files, use standard base64 encoding
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        // This creates a data URL (base64 encoded) for the file
        const base64String = reader.result as string;
        
        // In a real production app, you would upload to a storage service 
        // For this demo, we'll use the base64 string directly as the URL
        resolve(base64String);
      } catch (error: any) {
        reject(new Error("Failed to process file: " + (error?.message || "Unknown error")));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    
    // Read the file as a data URL (base64)
    reader.readAsDataURL(file);
  });
}

// Helper function to compress and encode images
function compressAndEncodeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        
        // Set maximum dimensions (adjust as needed)
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        // Set canvas dimensions and draw resized image
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to data URL with compression (quality 0.7)
        const dataUrl = canvas.toDataURL(file.type, 0.7);
        resolve(dataUrl);
      };
      
      img.onerror = () => {
        reject(new Error("Failed to load image for compression"));
      };
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file for compression"));
    };
  });
}
