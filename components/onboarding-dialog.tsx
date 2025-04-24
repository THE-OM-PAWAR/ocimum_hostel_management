"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/axios/api";

export function OnboardingDialog() {
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    ownerName: "",
    hostelName: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    if (isLoaded && user) {
      setFormData(prev => ({
        ...prev,
        ownerName: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || "",
      }));

      console.log("User data:", user.id);  
      
      // Check if user is onboarded
      const checkOnboarding = async () => {
        try {
          const response = await fetch(`/api/users/${user.id}/onboarding-status`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          console.log("Onboarding status response:", data);
          if (!data.isOnboarded) {
            setOpen(true);
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          setOpen(true); // Show dialog on error as fallback
        }
      };

      checkOnboarding();
    }
  }, [isLoaded, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {

      const response = await fetch(`/api/users/${user?.id}/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify({
          ...formData,
          userId: user?.id,
        }),
      });
      const data = await response.json();
      console.log("Onboarding response:", data);
      toast({
        title: "Success!",
        description: "Your hostel has been set up successfully.",
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to HostelHub!</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hostelName">Hostel Name</Label>
            <Input
              id="hostelName"
              value={formData.hostelName}
              onChange={(e) => setFormData(prev => ({ ...prev, hostelName: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              readOnly
              disabled
              className="bg-muted"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Complete Setup"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}