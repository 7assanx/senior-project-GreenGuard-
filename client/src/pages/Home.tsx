import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import PortalSelection from "@/components/PortalSelection";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
                  <h1 className="text-4xl font-extrabold text-neutral-900 sm:text-5xl md:text-6xl">
                    <span className="block">Smart AI-Powered</span>
                    <span className="block text-primary">Building Certification Platform</span>
                  </h1>
                  <p className="mt-3 text-base text-neutral-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Streamline the Estidama Pearl Rating certification process with our intelligent
                    platform. Upload documents, get AI feedback, and receive your certification
                    faster than ever.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex flex-wrap sm:justify-center lg:justify-start gap-3">
                    <div className="rounded-md shadow">
                      <Button
                        onClick={() => setShowPortalSelect(true)}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10"
                      >
                        <i className="ri-award-line mr-2"></i> Get Your Certification Now
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

      {/* Project Types */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Certification Types
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              Estidama Pearl Rating System
            </p>
            <p className="mt-4 max-w-2xl text-xl text-neutral-500 lg:mx-auto">
              Green Guard supports all Estidama Pearl Rating System certification categories.
            </p>
          </div>

          <Tabs defaultValue="buildings" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="buildings">Buildings</TabsTrigger>
              <TabsTrigger value="communities">Communities</TabsTrigger>
              <TabsTrigger value="villas">Villas</TabsTrigger>
              <TabsTrigger value="public">Public Realm</TabsTrigger>
            </TabsList>
            
            <TabsContent value="buildings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Pearl Building Rating System</span>
                    <Badge variant="outline" className="bg-green-50">PBRS</Badge>
                  </CardTitle>
                  <CardDescription>
                    A framework for sustainable design, construction and operation of buildings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>The Pearl Building Rating System (PBRS) addresses the sustainability of a building's design and construction.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center p-4 bg-green-50 rounded-md">
                      <i className="ri-water-flash-line text-primary text-2xl"></i>
                      <p className="mt-2 text-sm">Water Efficiency</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-md">
                      <i className="ri-sun-line text-primary text-2xl"></i>
                      <p className="mt-2 text-sm">Energy Efficiency</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-md">
                      <i className="ri-recycle-line text-primary text-2xl"></i>
                      <p className="mt-2 text-sm">Materials Selection</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-md">
                      <i className="ri-home-line text-primary text-2xl"></i>
                      <p className="mt-2 text-sm">Indoor Quality</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="communities" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Pearl Community Rating System</span>
                    <Badge variant="outline" className="bg-green-50">PCRS</Badge>
                  </CardTitle>
                  <CardDescription>
                    Framework for sustainable design and planning of communities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>The Pearl Community Rating System (PCRS) promotes the development of sustainable communities. It addresses planning considerations at a larger scale than individual buildings.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="villas" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Pearl Villa Rating System</span>
                    <Badge variant="outline" className="bg-green-50">PVRS</Badge>
                  </CardTitle>
                  <CardDescription>
                    Framework for sustainable design of residential villas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>The Pearl Villa Rating System (PVRS) is designed specifically for residential villas, addressing specific sustainability considerations for residential living spaces.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="public" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Public Realm Rating System</span>
                    <Badge variant="outline" className="bg-green-50">PRRS</Badge>
                  </CardTitle>
                  <CardDescription>
                    Framework for sustainable design of public spaces
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>The Public Realm Rating System addresses sustainability in public spaces, parks, and other community facilities.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Features section */}
      <div className="py-12 bg-green-50">
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
              <div className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
                  recommendations for improvement. Our platform learns from successful certifications to provide better guidance.
                </dd>
              </div>

              <div className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
                  feedback. Our platform identifies issues early, eliminating costly revisions.
                </dd>
              </div>

              <div className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
                  certification needs. Our platform makes it easy to find qualified experts.
                </dd>
              </div>

              <div className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
                  tracking. We've distilled complex requirements into manageable tasks.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-green-100">Join Green Guard today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button 
                onClick={() => setShowPortalSelect(true)}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-green-50 md:py-4 md:text-lg md:px-10"
              >
                <i className="ri-award-line mr-2"></i> Get Your Certification Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Portal selection modal */}
      <PortalSelection isOpen={showPortalSelect} onClose={() => setShowPortalSelect(false)} />
    </MainLayout>
  );
}
