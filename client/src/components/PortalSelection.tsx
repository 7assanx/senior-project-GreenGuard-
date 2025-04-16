import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type PortalSelectionProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PortalSelection({ isOpen, onClose }: PortalSelectionProps) {
  const [_, navigate] = useLocation();

  const handleUserPortal = () => {
    navigate("/login");
    onClose();
  };

  const handleAdminPortal = () => {
    navigate("/admin/login");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-neutral-900">
            Choose Your Portal
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            onClick={handleUserPortal}
            className="w-full bg-white shadow-md hover:shadow-lg rounded-lg p-6 text-center border border-neutral-200 hover:border-primary transition duration-150 cursor-pointer"
          >
            <i className="ri-user-line text-primary text-4xl mb-3"></i>
            <h4 className="text-lg font-medium text-neutral-900">User Portal</h4>
            <p className="text-sm text-neutral-500 mt-2">
              Apply for certification and manage your applications
            </p>
          </div>

          <div
            onClick={handleAdminPortal}
            className="w-full bg-white shadow-md hover:shadow-lg rounded-lg p-6 text-center border border-neutral-200 hover:border-primary transition duration-150 cursor-pointer"
          >
            <i className="ri-admin-line text-primary text-4xl mb-3"></i>
            <h4 className="text-lg font-medium text-neutral-900">Admin Portal</h4>
            <p className="text-sm text-neutral-500 mt-2">
              Review applications and manage certifications
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="mt-3 inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
