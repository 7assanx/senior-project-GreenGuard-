import { Firm } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type FirmCardProps = {
  firm: Firm;
};

export default function FirmCard({ firm }: FirmCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-neutral-900">{firm.name}</CardTitle>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light bg-opacity-10 text-primary-dark">
          {firm.specialization}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-neutral-700 mb-4">{firm.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <i className="ri-mail-line text-neutral-500 mr-2"></i>
            <a 
              href={`mailto:${firm.contactEmail}`} 
              className="text-primary hover:text-primary-dark"
            >
              {firm.contactEmail}
            </a>
          </div>
          {firm.contactPhone && (
            <div className="flex items-center">
              <i className="ri-phone-line text-neutral-500 mr-2"></i>
              <a 
                href={`tel:${firm.contactPhone}`} 
                className="text-neutral-700"
              >
                {firm.contactPhone}
              </a>
            </div>
          )}
          {firm.website && (
            <div className="flex items-center">
              <i className="ri-global-line text-neutral-500 mr-2"></i>
              <a 
                href={firm.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:text-primary-dark"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => window.location.href = `mailto:${firm.contactEmail}`}
          >
            <i className="ri-mail-send-line mr-1"></i> Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
