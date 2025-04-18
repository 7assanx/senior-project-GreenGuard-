import React, { ReactNode, useEffect } from "react";
import { Route, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

// Simple wrapper component that adds authentication protection to routes
interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
  adminOnly?: boolean;
}

export function ProtectedRoute({ path, component: Component, adminOnly = false }: ProtectedRouteProps) {
  return (
    <Route path={path}>
      {(params) => {
        const { isAuthenticated, isLoading, isAdmin, user } = useAuth();
        const [, navigate] = useLocation();
        
        // Use useEffect for redirection to prevent state updates during render
        // Use setTimeout with 0ms delay to push the navigation to the next event loop cycle
        // Handle unauthorized state
        useEffect(() => {
          if (!isLoading) {
            if (!isAuthenticated) {
              // Redirect to login after render
              setTimeout(() => navigate(adminOnly ? "/admin/login" : "/login"), 0);
            } else if (adminOnly && !isAdmin) {
              // Redirect admin-only routes if user is not admin
              setTimeout(() => navigate("/dashboard"), 0);
            }
          }
        }, [isAuthenticated, isAdmin, isLoading, adminOnly, navigate]);
        
        // Handle loading state
        if (isLoading) {
          return (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          );
        }
        
        // Return null for unauthorized routes - redirection will happen in useEffect
        if (!isAuthenticated || (adminOnly && !isAdmin)) {
          return null;
        }
        
        // Render the component if authenticated (pass any params from wouter)
        return <Component {...params} />;
      }}
    </Route>
  );
}

// Convenience wrapper for admin routes
interface AdminRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export function AdminRoute({ path, component }: AdminRouteProps) {
  return <ProtectedRoute path={path} component={component} adminOnly={true} />;
}