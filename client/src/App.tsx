import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute, AdminRoute } from "@/lib/protected-route";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import UserLogin from "@/pages/UserLogin";
import UserRegister from "@/pages/UserRegister";
import AdminLogin from "@/pages/AdminLogin";
import UserDashboard from "@/pages/UserDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import ApplicationPage from "@/pages/ApplicationPage";
import ApplicationsList from "@/pages/ApplicationsList";
import AdminReview from "@/pages/AdminReview";
import AdminApplications from "@/pages/AdminApplications";
import AdminReports from "@/pages/AdminReports";
import ContactFirms from "@/pages/ContactFirms";
import Settings from "@/pages/Settings";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/login" component={UserLogin} />
      <Route path="/register" component={UserRegister} />
      <Route path="/admin/login" component={AdminLogin} />
      
      {/* Protected user routes */}
      <ProtectedRoute path="/dashboard" component={UserDashboard} />
      <ProtectedRoute path="/applications" component={ApplicationsList} />
      <ProtectedRoute path="/applications/:id" component={ApplicationPage} />
      <ProtectedRoute path="/contact-firms" component={ContactFirms} />
      <ProtectedRoute path="/settings" component={Settings} />
      
      {/* Protected admin routes */}
      <AdminRoute path="/admin/dashboard" component={AdminDashboard} />
      <AdminRoute path="/admin/applications" component={AdminApplications} />
      <AdminRoute path="/admin/applications/:id" component={AdminReview} />
      <AdminRoute path="/admin/reports" component={AdminReports} />
      <AdminRoute path="/admin/settings" component={Settings} />
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Wrap the application with necessary providers
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
