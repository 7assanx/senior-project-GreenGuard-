import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import logoImage from "../assets/logo.png";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [location, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <div className="flex items-center cursor-pointer">
                    <img src={logoImage} alt="Green Guard Logo" className="h-8 w-auto mr-2" />
                    <span className="font-bold text-xl text-primary-dark">Green Guard</span>
                  </div>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/">
                  <a className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer",
                    isActive("/")
                      ? "border-primary text-neutral-900"
                      : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                  )}>
                    Home
                  </a>
                </Link>
                <Link href="/about">
                  <a className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer",
                    isActive("/about")
                      ? "border-primary text-neutral-900"
                      : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                  )}>
                    About
                  </a>
                </Link>
                <Link href="/faq">
                  <a className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer",
                    isActive("/faq")
                      ? "border-primary text-neutral-900"
                      : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                  )}>
                    FAQ
                  </a>
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <a className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
                    Dashboard
                  </a>
                </Link>
              ) : (
                <Link href="/login">
                  <a className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
                    Sign In
                  </a>
                </Link>
              )}
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                onClick={() => {
                  const mobileMenu = document.getElementById("mobile-menu");
                  if (mobileMenu) {
                    mobileMenu.classList.toggle("hidden");
                  }
                }}
              >
                <i className="ri-menu-line text-2xl"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div id="mobile-menu" className="sm:hidden hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className={cn(
                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer",
                isActive("/")
                  ? "bg-primary-light bg-opacity-10 border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700"
              )}>
                Home
              </a>
            </Link>
            <Link href="/about">
              <a className={cn(
                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer",
                isActive("/about")
                  ? "bg-primary-light bg-opacity-10 border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700"
              )}>
                About
              </a>
            </Link>
            <Link href="/faq">
              <a className={cn(
                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer",
                isActive("/faq")
                  ? "bg-primary-light bg-opacity-10 border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700"
              )}>
                FAQ
              </a>
            </Link>
            <div className="pt-4 pb-3 border-t border-neutral-200">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <a className="block pl-3 pr-4 py-2 text-base font-medium text-primary hover:bg-neutral-50 cursor-pointer">
                    Dashboard
                  </a>
                </Link>
              ) : (
                <Link href="/login">
                  <a className="block pl-3 pr-4 py-2 text-base font-medium text-primary hover:bg-neutral-50 cursor-pointer">
                    Sign In
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
