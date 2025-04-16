import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import PortalSelection from "@/components/PortalSelection";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import logoImage from "../assets/logo.png";

export default function Home() {
  const [showPortalSelect, setShowPortalSelect] = useState(false);
  const [_, navigate] = useLocation();

  return (
    <MainLayout>
      {/* Hero section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <div className="pt-10 sm:pt-16 lg:pt-8 xl:pt-16">
              <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
                <div className="text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start mb-6">
                    <img src={logoImage} alt="Green Guard Logo" className="h-24 w-auto" />
                  </div>
                  <h1 className="text-4xl font-extrabold text-neutral-900 sm:text-5xl md:text-6xl">
                    <span className="block">Smart AI-Powered</span>
                    <span className="block text-primary">Certification Platform</span>
                  </h1>
                  <p className="mt-3 text-base text-neutral-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Streamline the Estidama Pearl Rating certification process with our intelligent
                    platform. Upload documents, get AI feedback, and receive your certification
                    faster than ever.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex flex-wrap sm:justify-center lg:justify-start gap-3">
                    <div className="rounded-md shadow">
                      <Button
                        onClick={() => navigate("/login")}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10"
                      >
                        <i className="ri-user-line mr-2"></i> User Login
                      </Button>
                    </div>
                    <div className="rounded-md shadow mt-3 sm:mt-0">
                      <Button
                        onClick={() => navigate("/admin/login")}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 md:py-4 md:text-lg md:px-10"
                      >
                        <i className="ri-admin-line mr-2"></i> Admin Login
                      </Button>
                    </div>
                    <div className="mt-3 sm:mt-0">
                      <Button
                        variant="outline"
                        onClick={() => navigate("/about")}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-neutral-50 hover:bg-neutral-100 md:py-4 md:text-lg md:px-10"
                      >
                        Learn more
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            alt="Sustainable green building with solar panels"
          />
        </div>
      </div>

      {/* Features section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Benefits
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              Why Choose Green Guard?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-neutral-500 lg:mx-auto">
              Our platform makes the certification process faster, more accurate, and stress-free.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <i className="ri-ai-generate text-xl"></i>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-neutral-900">
                    AI-Powered Feedback
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-neutral-500">
                  Get instant AI analysis of your submitted documents with actionable
                  recommendations for improvement.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <i className="ri-time-line text-xl"></i>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-neutral-900">
                    Time-Saving
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-neutral-500">
                  Reduce certification time by up to 50% with our streamlined process and automated
                  feedback.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <i className="ri-building-line text-xl"></i>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-neutral-900">
                    Expert Connections
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-neutral-500">
                  Access our network of approved firms and consultants who can help with your
                  certification needs.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <i className="ri-file-list-3-line text-xl"></i>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-neutral-900">
                    Simplified Process
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-neutral-500">
                  Clear step-by-step guidance through the entire certification process with progress
                  tracking.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Portal selection modal */}
      <PortalSelection isOpen={showPortalSelect} onClose={() => setShowPortalSelect(false)} />
    </MainLayout>
  );
}
