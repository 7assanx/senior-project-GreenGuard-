import { Application } from "@/lib/types";
import { formatDate, getStatusBadgeColor, getProjectTypeIcon } from "@/lib/utils";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type ApplicationCardProps = {
  application: Application;
  userName?: string;
  userEmail?: string;
  isAdmin?: boolean;
};

export default function ApplicationCard({
  application,
  userName,
  userEmail,
  isAdmin = false
}: ApplicationCardProps) {
  const { bg, text } = getStatusBadgeColor(application.status);
  const icon = getProjectTypeIcon(application.projectType);
  const href = isAdmin 
    ? `/admin/applications/${application.id}`
    : `/applications/${application.id}`;

  return (
    <li>
      <Link href={href}>
        <a className="block hover:bg-neutral-50">
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-primary truncate">
                {application.projectName}
              </p>
              <div className="ml-2 flex-shrink-0 flex">
                <p className={cn("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", bg, text)}>
                  {application.status === "draft" ? "In Progress" :
                   application.status === "pending" ? "Pending Review" :
                   application.status === "in_progress" ? "Being Processed" :
                   application.status === "approved" ? "Approved" :
                   application.status === "rejected" ? "Rejected" :
                   application.status}
                </p>
              </div>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-neutral-500">
                  <i className={`${icon} flex-shrink-0 mr-1.5 text-neutral-400`}></i>
                  {application.projectType} Certification
                </p>
                {isAdmin && userName && (
                  <p className="mt-2 flex items-center text-sm text-neutral-500 sm:mt-0 sm:ml-6">
                    <i className="ri-user-line flex-shrink-0 mr-1.5 text-neutral-400"></i>
                    {userName}
                  </p>
                )}
              </div>
              <div className="mt-2 flex items-center text-sm text-neutral-500 sm:mt-0">
                <i className="ri-calendar-line flex-shrink-0 mr-1.5 text-neutral-400"></i>
                <p>
                  Submitted on <time dateTime={application.createdAt.toString()}>{formatDate(application.createdAt)}</time>
                </p>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </li>
  );
}
