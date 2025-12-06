"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface UserInformationStepProps {
  formData: {
    name: string;
    phoneNumber: string;
  };
  onFormDataChange: (data: { name: string; phoneNumber: string }) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function UserInformationStep({
  formData,
  onFormDataChange,
  onContinue,
  onBack,
}: UserInformationStepProps) {
  const handleChange = (field: string, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    if (!formData.name.trim()) {
      return;
    }
    if (!formData.phoneNumber.trim()) {
      return;
    }

    onContinue();
  };

  const isFormValid = formData.name.trim() !== "" && formData.phoneNumber.trim() !== "";

  return (
    <motion.div
      key="user-info"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Tell us about yourself
        </h2>
        <p className="text-muted-foreground">
          We need some basic information to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter your full name"
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="Enter your phone number"
            required
            className="h-11"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid}
            className="flex-1"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

