import { Application } from "@/lib/types";
import { formatRelativeTime, getProjectTypeLabel, getProjectTypeIcon } from "@/lib/utils";

interface ApplicationListItemProps {
  app: Application;
  isDownloading: boolean;
  downloadingAppId: number | null;
  downloadCertificate: (id: number) => void;
}

export default function ApplicationListItem({ 
  app, 
  isDownloading, 
  downloadingAppId, 
  downloadCertificate 
}: ApplicationListItemProps) {
  return (
    <div className="px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <i className={`${getProjectTypeIcon(app.projectType)} text-xl text-neutral-500 mr-3`}></i>
          <div>
            <p className="text-sm font-medium text-primary">
              {app.projectName}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {getProjectTypeLabel(app.projectType)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          {/* Status Badge */}
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            app.status === "approved" ? "bg-green-100 text-green-800" : 
            app.status === "rejected" ? "bg-red-100 text-red-800" :
            app.status === "pending" ? "bg-yellow-100 text-yellow-800" :
            app.status === "needs_info" ? "bg-orange-100 text-orange-800" :
            "bg-blue-100 text-blue-800"
          }`}>
            {app.status === "approved" ? "Approved" : 
              app.status === "rejected" ? "Rejected" :
              app.status === "pending" ? "Under Review" :
              app.status === "needs_info" ? "Action Required" :
              "In Progress"}
          </span>
        </div>
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-neutral-500">
          <i className="ri-time-line mr-1"></i> 
          Last updated {formatRelativeTime(new Date(app.updatedAt))}
        </div>
        
        {/* Action Indicators */}
        <div>
          {app.status === "approved" && (
            <button 
              onClick={(e) => {
                e.preventDefault(); // Prevent link navigation
                e.stopPropagation(); // Prevent parent click
                downloadCertificate(app.id);
              }}
              disabled={isDownloading && downloadingAppId === app.id}
              className="text-xs text-green-600 flex items-center hover:text-green-800 hover:underline disabled:opacity-50 disabled:hover:text-green-600 disabled:hover:no-underline"
            >
              {isDownloading && downloadingAppId === app.id ? (
                <>
                  <i className="ri-loader-2-line animate-spin mr-1"></i> Generating...
                </>
              ) : (
                <>
                  <i className="ri-download-2-line mr-1"></i> Download Certificate
                </>
              )}
            </button>
          )}
          {app.status === "needs_info" && (
            <span className="text-xs text-orange-600 flex items-center">
              <i className="ri-alert-line mr-1"></i> Response needed
            </span>
          )}
          {app.status === "draft" && (
            <span className="text-xs text-blue-600 flex items-center">
              <i className="ri-edit-line mr-1"></i>
            </span>
          )}
          {(app.status === "pending" || app.status === "in_progress") && (
            <span className="text-xs text-yellow-600 flex items-center">
              <i className="ri-eye-line mr-1"></i> View only
            </span>
          )}
        </div>
      </div>
    </div>
  );
}