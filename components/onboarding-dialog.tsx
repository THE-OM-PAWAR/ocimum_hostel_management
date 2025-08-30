"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users } from "lucide-react";

export function OnboardingDialog() {
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("create");

  const [createHostelData, setCreateHostelData] = useState({
    ownerName: "",
    phoneNumber: "",
    hostelName: "",
  });

  const [joinHostelData, setJoinHostelData] = useState({
    ownerName: "",
    phoneNumber: "",
    joinCode: "",
  });

  useEffect(() => {
    if (isLoaded && user) {
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

  const handleCreateHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/onboard/create-hostel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...createHostelData,
          userId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create hostel');
      }
      
      toast({
        title: "Success!",
        description: `Hostel "${createHostelData.hostelName}" created successfully!`,
      });

      setOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create hostel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/onboard/join-hostel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...joinHostelData,
          userId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to join hostel');
      }
      
      toast({
        title: "Success!",
        description: "Join request sent! Please wait for admin approval.",
      });

      setOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join hostel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Welcome to OCIMUM!</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Create Hostel
            </TabsTrigger>
            <TabsTrigger value="join" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Join Hostel
            </TabsTrigger>
          </TabsList>
           */}
          <TabsContent value="create" className="space-y-4 mt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Create Your Hostel</h3>
              <p className="text-sm text-muted-foreground">
                Set up a new hostel and become the admin
              </p>
            </div>
            
            <form onSubmit={handleCreateHostel} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  value={createHostelData.ownerName}
                  onChange={(e) => setCreateHostelData(prev => ({ ...prev, ownerName: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={createHostelData.phoneNumber}
                  onChange={(e) => setCreateHostelData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hostelName">Hostel Name</Label>
                <Input
                  id="hostelName"
                  value={createHostelData.hostelName}
                  onChange={(e) => setCreateHostelData(prev => ({ ...prev, hostelName: e.target.value }))}
                  placeholder="Enter your hostel name"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Hostel"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="join" className="space-y-4 mt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Join Existing Hostel</h3>
              <p className="text-sm text-muted-foreground">
                Enter your details and the join code provided by your hostel admin
              </p>
            </div>
            
            <form onSubmit={handleJoinHostel} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="joinOwnerName">Owner Name</Label>
                <Input
                  id="joinOwnerName"
                  value={joinHostelData.ownerName}
                  onChange={(e) => setJoinHostelData(prev => ({ ...prev, ownerName: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinPhoneNumber">Phone Number</Label>
                <Input
                  id="joinPhoneNumber"
                  value={joinHostelData.phoneNumber}
                  onChange={(e) => setJoinHostelData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinCode">Join Code</Label>
                <Input
                  id="joinCode"
                  value={joinHostelData.joinCode}
                  onChange={(e) => setJoinHostelData(prev => ({ ...prev, joinCode: e.target.value.toUpperCase() }))}
                  placeholder="Enter 6-character join code"
                  maxLength={6}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Joining..." : "Join Hostel"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}