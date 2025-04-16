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
import logoImage from "../assets/logo.png";

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

  const handleUserRegister = () => {
    navigate("/register");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logoImage} alt="Green Guard Logo" className="h-16 w-auto" />
          </div>
          <DialogTitle className="text-2xl font-semibold text-neutral-900">
            Welcome to Green Guard
          </DialogTitle>
          <DialogDescription className="text-neutral-600 mt-2">
            Select your portal to proceed with the certification process
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div
            onClick={handleUserPortal}
            className="group w-full bg-white shadow-md hover:shadow-lg rounded-lg p-6 text-center border-2 border-neutral-200 hover:border-primary transition duration-150 cursor-pointer relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <i className="ri-user-line text-primary text-3xl"></i>
              </div>
            </div>
            <h4 className="text-xl font-medium text-neutral-900">User Login</h4>
            <p className="text-sm text-neutral-500 mt-2">
              Login to manage your existing certification applications
            </p>
            <Button variant="ghost" className="mt-4 text-primary w-full">Login as User</Button>
          </div>

          <div
            onClick={handleAdminPortal}
            className="group w-full bg-white shadow-md hover:shadow-lg rounded-lg p-6 text-center border-2 border-neutral-200 hover:border-primary transition duration-150 cursor-pointer relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <i className="ri-admin-line text-primary text-3xl"></i>
              </div>
            </div>
            <h4 className="text-xl font-medium text-neutral-900">Admin Login</h4>
            <p className="text-sm text-neutral-500 mt-2">
              Login to review applications and manage certifications
            </p>
            <Button variant="ghost" className="mt-4 text-primary w-full">Login as Admin</Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600">Don't have an account?</p>
          <Button 
            variant="link" 
            className="text-primary font-medium"
            onClick={handleUserRegister}
          >
            Create a new account
          </Button>
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
