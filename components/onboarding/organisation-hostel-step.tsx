"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

interface OrganisationHostelStepProps {
  formData: {
    organisationName: string;
    hostelName: string;
    description: string;
    useSameName: boolean;
  };
  userEmail: string;
  userPhoneNumber: string;
  onFormDataChange: (data: {
    organisationName: string;
    hostelName: string;
    description: string;
    useSameName: boolean;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function OrganisationHostelStep({
  formData,
  userEmail,
  userPhoneNumber,
  onFormDataChange,
  onSubmit,
  onBack,
  isSubmitting,
}: OrganisationHostelStepProps) {
  const handleChange = (field: string, value: string | boolean) => {
    const newData = {
      ...formData,
      [field]: value,
    };

    // If useSameName is checked, set hostelName to organisationName
    if (field === "useSameName" && value === true) {
      newData.hostelName = formData.organisationName;
    }

    // If useSameName is checked and organisationName changes, update hostelName
    if (field === "organisationName" && formData.useSameName) {
      newData.hostelName = value as string;
    }

    onFormDataChange(newData);
  };

  const handleCheckboxChange = (checked: boolean) => {
    handleChange("useSameName", checked);
    if (checked) {
      handleChange("hostelName", formData.organisationName);
    }
  };

  return (
    <motion.div
      key="org-hostel"
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
          Set up your organisation and first hostel
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="organisationName">
            Organisation Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="organisationName"
            value={formData.organisationName}
            onChange={(e) => handleChange("organisationName", e.target.value)}
            placeholder="Enter your organisation name"
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2 hidden">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={userEmail}
            disabled
            className="h-11 bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            This is your registered email address
          </p>
        </div>

        <div className="space-y-2 hidden">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={userPhoneNumber}
            disabled
            className="h-11 bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            This is your registered phone number
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="useSameName"
            checked={!!formData.useSameName}
            onClick={() =>
              handleChange("useSameName", !formData.useSameName)
            }
          />
          <Label
            htmlFor="useSameName"
            className="text-sm font-normal cursor-pointer"
            onClick={() =>
              handleChange("useSameName", !formData.useSameName)
            }
          >
            Hostel name is same as organisation name
          </Label>
        </div>

        {!formData.useSameName && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Label htmlFor="hostelName">
              Hostel Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hostelName"
              value={formData.hostelName}
              onChange={(e) => handleChange("hostelName", e.target.value)}
              placeholder="Enter your hostel name"
              required={!formData.useSameName}
              className="h-11"
            />
          </motion.div>
        )}

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Tell us about your hostel..."
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            This description will be used for your hostel profile
          </p>
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
            disabled={isSubmitting || !formData.organisationName.trim()}
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

