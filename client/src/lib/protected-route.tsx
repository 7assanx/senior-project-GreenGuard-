import { ReactNode } from "react";
import { Route, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

// Simple wrapper component that adds authentication protection to routes
export function ProtectedRoute({ path, component: Component, adminOnly = false }) {
  return (
    <Route path={path}>
      {(params) => {
        const { isAuthenticated, isLoading, isAdmin, user } = useAuth();
        const [, navigate] = useLocation();
        
        // Handle loading state
        if (isLoading) {
          return (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          );
        }
        
        // Handle unauthorized state
        if (!isAuthenticated) {
          // Redirect to login
          navigate(adminOnly ? "/admin/login" : "/login");
          return null;
        }
        
        // Handle admin-only routes
        if (adminOnly && !isAdmin) {
          navigate("/dashboard");
          return null;
        }
        
        // Render the component if authenticated
        return <Component params={params} />;
      }}
    </Route>
  );
}

// Convenience wrapper for admin routes
export function AdminRoute({ path, component }) {
  return <ProtectedRoute path={path} component={component} adminOnly={true} />;
}