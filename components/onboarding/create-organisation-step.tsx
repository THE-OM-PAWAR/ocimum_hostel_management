"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface CreateOrganisationStepProps {
  formData: {
    ownerName: string;
    phoneNumber: string;
    organisationName: string;
  };
  onFormDataChange: (data: {
    ownerName: string;
    phoneNumber: string;
    organisationName: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function CreateOrganisationStep({
  formData,
  onFormDataChange,
  onSubmit,
  onBack,
  isSubmitting,
}: CreateOrganisationStepProps) {
  const handleChange = (field: string, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Create Your Organisation
        </h2>
        <p className="text-muted-foreground">
          Tell us a bit about yourself and your organisation
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="ownerName">Your Name</Label>
          <Input
            id="ownerName"
            value={formData.ownerName}
            onChange={(e) => handleChange("ownerName", e.target.value)}
            placeholder="Enter your full name"
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="Enter your phone number"
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organisationName">Organisation Name</Label>
          <Input
            id="organisationName"
            value={formData.organisationName}
            onChange={(e) => handleChange("organisationName", e.target.value)}
            placeholder="Enter your organisation name"
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
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                Create Organisation
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

