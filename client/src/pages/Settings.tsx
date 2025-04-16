import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  company: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
  confirmPassword: z.string().min(1, { message: "Confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Settings() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      company: user?.company || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
        company: user.company || "",
      });
    }
  }, [user, profileForm]);

  async function onProfileSubmit(values: ProfileFormValues) {
    setIsUpdatingProfile(true);
    try {
      await apiRequest("PATCH", "/api/me", values);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully!",
      });
      
      // Invalidate the user query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  async function onPasswordSubmit(values: PasswordFormValues) {
    setIsUpdatingPassword(true);
    try {
      await apiRequest("PATCH", "/api/me/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully!",
      });
      
      // Reset the password form
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update password. Please check your current password and try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="h-screen flex overflow-hidden bg-neutral-100">
      {/* Sidebar */}
      <Sidebar isAdmin={isAdmin} activePage="settings" />
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <MobileHeader isAdmin={isAdmin} title="Green Guard" activePage="settings" />
        
        {/* Settings content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-neutral-900">Account Settings</h1>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="mt-6 space-y-8 max-w-3xl">
                {/* Profile Settings */}
                <Card className="bg-white shadow sm:rounded-lg">
                  <CardHeader className="border-b border-neutral-200">
                    <CardTitle className="text-lg leading-6 font-medium text-neutral-900">
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Form {...profileForm}>
                      <form id="profile-form" onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-neutral-700">Name</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="mt-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-neutral-300 rounded-md"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-neutral-700">Email</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="email" 
                                  className="mt-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-neutral-300 rounded-md"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-neutral-700">Company (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="mt-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-neutral-300 rounded-md"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="bg-neutral-50 px-6 py-3 flex justify-end">
                    <Button
                      type="submit"
                      form="profile-form"
                      disabled={isUpdatingProfile}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {isUpdatingProfile ? (
                        <>
                          <i className="ri-loader-2-line animate-spin mr-1"></i> Saving...
                        </>
                      ) : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Password Settings */}
                <Card className="bg-white shadow sm:rounded-lg">
                  <CardHeader className="border-b border-neutral-200">
                    <CardTitle className="text-lg leading-6 font-medium text-neutral-900">
                      Update Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Form {...passwordForm}>
                      <form id="password-form" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-neutral-700">Current Password</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="password" 
                                  className="mt-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-neutral-300 rounded-md"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-neutral-700">New Password</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="password" 
                                  className="mt-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-neutral-300 rounded-md"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-neutral-700">Confirm New Password</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="password" 
                                  className="mt-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-neutral-300 rounded-md"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="bg-neutral-50 px-6 py-3 flex justify-end">
                    <Button
                      type="submit"
                      form="password-form"
                      disabled={isUpdatingPassword}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <i className="ri-loader-2-line animate-spin mr-1"></i> Updating...
                        </>
                      ) : "Update Password"}
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Account Danger Zone */}
                <Card className="bg-white shadow sm:rounded-lg border border-red-200">
                  <CardHeader className="border-b border-red-200 bg-red-50">
                    <CardTitle className="text-lg leading-6 font-medium text-red-800">
                      Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-sm text-neutral-700">
                      <p>Permanently delete your account and all associated data.</p>
                      <p className="mt-2 font-medium text-red-600">
                        This action cannot be undone. All your applications and certifications will be permanently deleted.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-neutral-50 px-6 py-3 flex justify-end">
                    <Button
                      variant="destructive"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete Account
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
