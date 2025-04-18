import { ReactNode } from "react";
import { Route, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

type RouteParams = { [param: string]: string };
type ComponentProps = { params: RouteParams };

// Simple wrapper component that adds authentication protection to routes
interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<ComponentProps>;
  adminOnly?: boolean;
}

export function ProtectedRoute({ path, component: Component, adminOnly = false }: ProtectedRouteProps) {
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
interface AdminRouteProps {
  path: string;
  component: React.ComponentType<ComponentProps>;
}

export function AdminRoute({ path, component }: AdminRouteProps) {
  return <ProtectedRoute path={path} component={component} adminOnly={true} />;
}