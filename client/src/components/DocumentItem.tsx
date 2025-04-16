import { useState } from "react";
import { Document, RequiredDocument } from "@/lib/types";
import { getFileIcon } from "@/components/ui/ui-utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { uploadFile } from "@/lib/utils";

type DocumentItemProps = {
  requiredDocument: RequiredDocument;
  applicationId: number;
  uploadedDocument?: Document;
  onUpload?: (document: Document) => void;
  onDelete?: (documentId: number) => void;
};

export default function DocumentItem({
  requiredDocument,
  applicationId,
  uploadedDocument,
  onUpload,
  onDelete,
}: DocumentItemProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // In a real application, upload the file to a server
      const fileUrl = await uploadFile(file);
      
      const response = await apiRequest("POST", `/api/applications/${applicationId}/documents`, {
        name: requiredDocument.name,
        description: requiredDocument.description,
        fileUrl,
        fileType: file.type,
        status: "pending"
      });
      
      const newDocument = await response.json();
      
      toast({
        title: "Document uploaded",
        description: `${requiredDocument.name} has been uploaded successfully.`,
      });
      
      // Invalidate the documents query to refresh the list
      queryClient.invalidateQueries({ queryKey: [`/api/applications/${applicationId}/documents`] });
      
      if (onUpload) {
        onUpload(newDocument);
      }
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload failed",
        description: error?.message || "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!uploadedDocument) return;
    
    try {
      await apiRequest("DELETE", `/api/documents/${uploadedDocument.id}`, {});
      
      toast({
        title: "Document deleted",
        description: `${requiredDocument.name} has been removed successfully.`,
      });
      
      // Invalidate the documents query to refresh the list
      queryClient.invalidateQueries({ queryKey: [`/api/applications/${applicationId}/documents`] });
      
      if (onDelete) {
        onDelete(uploadedDocument.id);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting your document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isUploaded = !!uploadedDocument;
  
  return (
    <li className="py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={cn(
            "rounded-lg p-2 mr-4 flex items-center justify-center",
            isUploaded ? "bg-green-100" : "bg-neutral-100",
            isUploaded && "relative"
          )}>
            <i className={cn(
              isUploaded ? "text-green-600" : "text-neutral-400",
              uploadedDocument ? getFileIcon(uploadedDocument.fileType) : "ri-file-text-line",
              "text-xl"
            )}></i>
            {isUploaded && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <i className="ri-check-line text-xs"></i>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center">
              <h4 className="text-sm font-medium text-neutral-900">{requiredDocument.name}</h4>
              {isUploaded && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                  Complete
                </span>
              )}
              {requiredDocument.required && !isUploaded && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                  Required
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              {requiredDocument.description}
            </p>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex items-center">
          {isUploaded ? (
            <>
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="sm"
                className="bg-white rounded-md font-medium text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <i className="ri-delete-bin-line mr-1"></i> Remove
              </Button>
            </>
          ) : (
            <label className="cursor-pointer">
              <input
                id={`file-upload-${requiredDocument.name}`}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
              />
              <Button
                variant="outline"
                size="sm"
                disabled={isUploading}
                className="inline-flex items-center px-3 py-1.5 border border-primary text-sm font-medium rounded text-primary bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={() => document.getElementById(`file-upload-${requiredDocument.name}`)?.click()}
              >
                {isUploading ? (
                  <>
                    <i className="ri-loader-2-line animate-spin mr-1"></i> Uploading...
                  </>
                ) : (
                  <>
                    <i className="ri-upload-2-line mr-1"></i> Upload
                  </>
                )}
              </Button>
            </label>
          )}
        </div>
      </div>
    </li>
  );
}
