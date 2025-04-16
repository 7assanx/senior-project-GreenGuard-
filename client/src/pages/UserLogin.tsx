import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import logoImage from "../assets/logo.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function UserLogin() {
  const { login } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  
  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", values.username);
      await login(values.username, values.password);
      console.log("Login successful");
      // Successful login will redirect in the AuthContext
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  async function onForgotPasswordSubmit(values: ForgotPasswordFormValues) {
    setIsResettingPassword(true);
    try {
      // Simulate API call to request password reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Password reset email sent",
        description: `If an account with the email ${values.email} exists, you will receive password reset instructions.`,
      });
      
      // Close the dialog after successful submission
      setShowForgotPasswordDialog(false);
      forgotPasswordForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 relative">
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          className="flex items-center text-primary hover:bg-green-50" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </div>
      <Card className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center">
              <img src={logoImage} alt="Green Guard Logo" className="h-14 w-auto" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-neutral-900">User Login</h2>
          <p className="mt-2 text-sm text-neutral-500">Login to manage your certification applications</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Username" 
                      {...field} 
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      {...field} 
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                        id="rememberMe"
                      />
                    </FormControl>
                    <label
                      htmlFor="rememberMe"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </FormItem>
                )}
              />

              <div className="text-sm">
                <button 
                  type="button"
                  onClick={() => setShowForgotPasswordDialog(true)}
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isLoading ? (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <i className="ri-loader-2-line animate-spin h-5 w-5 text-white"></i>
                  </span>
                  Signing in...
                </>
              ) : "Sign in"}
            </Button>
            
            <div className="text-center text-sm">
              <p>Don't have an account? <span 
                onClick={() => navigate("/register")}
                className="font-medium text-primary hover:text-primary-dark cursor-pointer">
                Create one
              </span></p>
            </div>
          </form>
        </Form>
      </Card>
      
      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPasswordDialog} onOpenChange={setShowForgotPasswordDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you instructions to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your.email@example.com" 
                        {...field} 
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForgotPasswordDialog(false)}
                  className="mt-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isResettingPassword}
                  className="mt-2"
                >
                  {isResettingPassword ? (
                    <>
                      <i className="ri-loader-2-line animate-spin mr-2"></i> Sending...
                    </>
                  ) : "Send Reset Instructions"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
