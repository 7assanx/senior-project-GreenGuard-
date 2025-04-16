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
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
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
            "rounded-lg p-2 mr-4",
            isUploaded ? "bg-primary-light bg-opacity-20" : "bg-neutral-100"
          )}>
            <i className={cn(
              isUploaded ? "text-primary" : "text-neutral-400",
              uploadedDocument ? getFileIcon(uploadedDocument.fileType) : "ri-file-text-line",
              "text-xl"
            )}></i>
          </div>
          <div>
            <h4 className="text-sm font-medium text-neutral-900">{requiredDocument.name}</h4>
            <p className="text-sm text-neutral-500 mt-1">
              {requiredDocument.description}
            </p>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex items-center">
          {isUploaded ? (
            <>
              <span className="mr-2 flex items-center text-sm text-green-500 font-medium">
                <i className="ri-check-line mr-1"></i> Uploaded
              </span>
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="sm"
                className="bg-white rounded-md font-medium text-primary hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <i className="ri-delete-bin-line"></i>
              </Button>
            </>
          ) : (
            <label>
              <input
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
                onClick={() => {}}
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
