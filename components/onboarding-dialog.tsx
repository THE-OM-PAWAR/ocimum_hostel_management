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

  const [createOrganisationData, setCreateOrganisationData] = useState({
    ownerName: "",
    phoneNumber: "",
    organisationName: "",
    hostelName: "",
  });

  const [joinOrganisationData, setJoinOrganisationData] = useState({
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

  const handleCreateOrganisation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/onboard/create-organisation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...createOrganisationData,
          userId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create organisation');
      }
      
      toast({
        title: "Success!",
        description: `Organisation "${createOrganisationData.organisationName}" created successfully!`,
      });

      setOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create organisation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinOrganisation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/onboard/join-organisation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...joinOrganisationData,
          userId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to join organisation');
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
        description: error.message || "Failed to join organisation. Please try again.",
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
          <DialogTitle>Welcome to Getstay!</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Create Organisation
            </TabsTrigger>
            <TabsTrigger value="join" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Join Organisation
            </TabsTrigger>
          </TabsList>
           */}
          <TabsContent value="create" className="space-y-4 mt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Create Your Organisation</h3>
              <p className="text-sm text-muted-foreground">
                Set up a new organisation and become the admin
              </p>
            </div>
            
            <form onSubmit={handleCreateOrganisation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  value={createOrganisationData.ownerName}
                  onChange={(e) => setCreateOrganisationData(prev => ({ ...prev, ownerName: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={createOrganisationData.phoneNumber}
                  onChange={(e) => setCreateOrganisationData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organisationName">Organisation Name</Label>
                <Input
                  id="organisationName"
                  value={createOrganisationData.organisationName}
                  onChange={(e) => setCreateOrganisationData(prev => ({ ...prev, organisationName: e.target.value }))}
                  placeholder="Enter your organisation name"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Organisation"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="join" className="space-y-4 mt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Join Existing Organisation</h3>
              <p className="text-sm text-muted-foreground">
                Enter your details and the join code provided by your organisation admin
              </p>
            </div>
            
            <form onSubmit={handleJoinOrganisation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="joinOwnerName">Owner Name</Label>
                <Input
                  id="joinOwnerName"
                  value={joinOrganisationData.ownerName}
                  onChange={(e) => setJoinOrganisationData(prev => ({ ...prev, ownerName: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinPhoneNumber">Phone Number</Label>
                <Input
                  id="joinPhoneNumber"
                  value={joinOrganisationData.phoneNumber}
                  onChange={(e) => setJoinOrganisationData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinCode">Join Code</Label>
                <Input
                  id="joinCode"
                  value={joinOrganisationData.joinCode}
                  onChange={(e) => setJoinOrganisationData(prev => ({ ...prev, joinCode: e.target.value.toUpperCase() }))}
                  placeholder="Enter 6-character join code"
                  maxLength={6}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Joining..." : "Join Organisation"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}