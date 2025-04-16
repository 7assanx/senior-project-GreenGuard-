import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";

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
import AdminReview from "@/pages/AdminReview";
import ContactFirms from "@/pages/ContactFirms";
import Settings from "@/pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/login" component={UserLogin} />
      <Route path="/register" component={UserRegister} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/dashboard" component={UserDashboard} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/applications/:id" component={ApplicationPage} />
      <Route path="/admin/applications/:id" component={AdminReview} />
      <Route path="/contact-firms" component={ContactFirms} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
