"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "onboarding_state";

export interface OnboardingState {
  step: number;
  userInfo: {
    name: string;
    phoneNumber: string;
  };
  organisationHostel: {
    organisationName: string;
    hostelName: string;
    description: string;
    useSameName: boolean;
  };
}

const defaultState: OnboardingState = {
  step: 1,
  userInfo: {
    name: "",
    phoneNumber: "",
  },
  organisationHostel: {
    organisationName: "",
    hostelName: "",
    description: "",
    useSameName: true,
  },
};

export function useOnboardingPersistence(userId?: string) {
  const storageKey = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
  const [state, setState] = useState<OnboardingState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
      }
    } catch (error) {
      console.error("Error loading onboarding state:", error);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Save state to localStorage whenever it changes
  const updateState = (newState: Partial<OnboardingState>) => {
    setState((prev) => {
      const updated = { ...prev, ...newState };
      
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch (error) {
          console.error("Error saving onboarding state:", error);
        }
      }
      
      return updated;
    });
  };

  const clearState = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error("Error clearing onboarding state:", error);
      }
    }
    setState(defaultState);
  };

  return {
    state,
    updateState,
    clearState,
    isLoaded,
  };
}

