"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence } from "framer-motion";
import { WelcomeStep } from "@/components/onboarding/welcome-step";
import { UserInformationStep } from "@/components/onboarding/user-information-step";
import { OrganisationHostelStep } from "@/components/onboarding/organisation-hostel-step";
import { ProgressIndicator } from "@/components/onboarding/progress-indicator";
import { LoadingScreen } from "@/components/onboarding/loading-screen";
import { useOnboardingPersistence } from "@/components/onboarding/use-onboarding-persistence";

const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const { state, updateState, clearState, isLoaded: isPersistenceLoaded } = useOnboardingPersistence(user?.id);

  // Check if user is already onboarded
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isLoaded || !user) return;

      try {
        const response = await fetch(`/api/users/${user.id}/onboarding-status`);
        const data = await response.json();

        if (data.isOnboarded) {
          clearState(); // Clear persisted state if already onboarded
          router.push("/dashboard");
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsChecking(false);
      }
    };

    checkOnboarding();
  }, [isLoaded, user, router, clearState]);

  const handleContinue = () => {
    updateState({ step: state.step + 1 });
  };

  const handleBack = () => {
    if (state.step > 1) {
      updateState({ step: state.step - 1 });
    }
  };

  const handleUserInfoChange = (data: { name: string; phoneNumber: string }) => {
    updateState({
      userInfo: data,
    });
  };

  const handleOrganisationHostelChange = (data: {
    organisationName: string;
    hostelName: string;
    description: string;
    useSameName: boolean;
  }) => {
    updateState({
      organisationHostel: data,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/onboard/create-organisation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerName: state.userInfo.name,
          phoneNumber: state.userInfo.phoneNumber,
          organisationName: state.organisationHostel.organisationName,
          hostelName: state.organisationHostel.useSameName
            ? state.organisationHostel.organisationName
            : state.organisationHostel.hostelName,
          description: state.organisationHostel.description,
          userId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create organisation");
      }

      toast({
        title: "Success!",
        description: `Organisation "${state.organisationHostel.organisationName}" and hostel created successfully! Continuing onboarding...`,
      });

      // Clear persisted state after successful submission
      clearState();

      // IMPORTANT: Don't redirect to dashboard yet - isOnboarded is still false
      // There are 2-3 more onboarding forms remaining
      // TODO: Navigate to next onboarding step (step 4) when more steps are added
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to create organisation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking || !isPersistenceLoaded) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {state.step === 1 && <WelcomeStep onContinue={handleContinue} />}
          {state.step === 2 && (
            <UserInformationStep
              formData={state.userInfo}
              onFormDataChange={handleUserInfoChange}
              onContinue={handleContinue}
              onBack={handleBack}
            />
          )}
          {state.step === 3 && (
            <OrganisationHostelStep
              formData={state.organisationHostel}
              userEmail={user?.primaryEmailAddress?.emailAddress || ""}
              userPhoneNumber={state.userInfo.phoneNumber}
              onFormDataChange={handleOrganisationHostelChange}
              onSubmit={handleSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>

        <ProgressIndicator currentStep={state.step} totalSteps={TOTAL_STEPS} />
      </div>
    </div>
  );
}
