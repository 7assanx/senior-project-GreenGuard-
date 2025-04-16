import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import FirmCard from "@/components/FirmCard";
import { Firm } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ContactFirms() {
  const { isAuthenticated } = useAuth();
  const [_, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | undefined>(undefined);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch approved firms
  const { data: firms, isLoading, error } = useQuery<Firm[]>({
    queryKey: ["/api/firms"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  // Filter firms based on search query and selected specialization
  const filteredFirms = firms?.filter(firm => {
    const matchesSearch = searchQuery.trim() === "" || 
      firm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (firm.description && firm.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpecialization = !selectedSpecialization || 
      firm.specialization === selectedSpecialization;
    
    return matchesSearch && matchesSpecialization;
  });

  // Get unique specializations for filter
  const specializations = Array.from(new Set(firms?.map(firm => firm.specialization) || []));

  return (
    <div className="h-screen flex overflow-hidden bg-neutral-100">
      {/* Sidebar */}
      <Sidebar activePage="contact-firms" />
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <MobileHeader title="Green Guard" activePage="contact-firms" />
        
        {/* Firms content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-neutral-900">Contact Approved Firms</h1>
              <p className="mt-1 text-neutral-500">
                Connect with certified experts who can help with your Estidama certification.
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              {/* Search and filter */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="col-span-2">
                    <Label htmlFor="firm-search" className="block text-sm font-medium text-neutral-700 mb-1">
                      Search Firms
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="ri-search-line text-neutral-400"></i>
                      </div>
                      <Input
                        id="firm-search"
                        type="text"
                        placeholder="Search by name or description"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-neutral-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="specialization-filter" className="block text-sm font-medium text-neutral-700 mb-1">
                      Filter by Specialization
                    </Label>
                    <Select
                      value={selectedSpecialization}
                      onValueChange={(value) => setSelectedSpecialization(value || undefined)}
                    >
                      <SelectTrigger id="specialization-filter" className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-neutral-300 rounded-md">
                        <SelectValue placeholder="All specializations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All specializations</SelectItem>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Firms list */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">Error loading firms. Please try again.</p>
                  <Button onClick={() => window.location.reload()} className="mt-4">
                    Retry
                  </Button>
                </div>
              ) : filteredFirms && filteredFirms.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredFirms.map((firm) => (
                    <FirmCard key={firm.id} firm={firm} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                  <i className="ri-information-line text-primary text-4xl mb-4"></i>
                  <h3 className="text-lg font-medium text-neutral-900">No firms found</h3>
                  <p className="mt-2 text-neutral-500">
                    {searchQuery || selectedSpecialization ? 
                      "Try adjusting your search or filter criteria." :
                      "There are no approved firms available at the moment."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
