import { Application } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicationProgress from "./ApplicationProgress";
import { useState, useEffect } from "react";

interface ProgressSectionProps {
  applications: Application[];
}

export default function ProgressSection({ applications }: ProgressSectionProps) {
  // Find the most relevant application to display
  const [activeApplication, setActiveApplication] = useState<Application | null>(null);

  useEffect(() => {
    if (applications && applications.length > 0) {
      // First priority: Find any application requiring attention
      const needsInfoApp = applications.find(app => app.status === "needs_info");
      if (needsInfoApp) {
        setActiveApplication(needsInfoApp);
        return;
      }

      // Second priority: Find active draft applications
      const draftApp = applications.find(app => app.status === "draft");
      if (draftApp) {
        setActiveApplication(draftApp);
        return;
      }

      // Third priority: Find pending applications
      const pendingApp = applications.find(app => app.status === "pending" || app.status === "in_progress");
      if (pendingApp) {
        setActiveApplication(pendingApp);
        return;
      }

      // Fallback: Get the most recently updated application
      const sortedApps = [...applications].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setActiveApplication(sortedApps[0]);
    }
  }, [applications]);

  if (!activeApplication) {
    return null;
  }

  return <ApplicationProgress application={activeApplication} />;
}