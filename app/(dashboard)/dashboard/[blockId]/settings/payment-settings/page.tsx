"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";

export default function PaymentSettingsPage() {
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    rentGenerationDay: "1",
    rentGenerationEnabled: true,
  });

  useEffect(() => {
    fetchSettings();
  }, [params.blockId]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/blocks/${params.blockId}/payment-settings`);
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      const data = await response.json();
      console.log("Fetched settings:", data);
      setSettings({
        rentGenerationDay: data.rentGenerationDay || "1",
        rentGenerationEnabled: data.rentGenerationEnabled ?? true,
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch payment settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/blocks/${params.blockId}/payment-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const data = await response.json();
      setSettings({
        rentGenerationDay: data.rentGenerationDay,
        rentGenerationEnabled: data.rentGenerationEnabled,
      });

      toast({
        title: "Success",
        description: "Payment settings updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your payment and billing preferences
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Rent Generation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Rent Generation</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automatic generation of next month&apos;s rent
                </p>
              </div>
              <Switch
                checked={settings.rentGenerationEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, rentGenerationEnabled: checked }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Generate Next Month&apos;s Rent Entry On</Label>
              <Select
                value={settings.rentGenerationDay}
                onValueChange={(value) => setSettings(prev => ({ ...prev, rentGenerationDay: value }))}
                disabled={!settings.rentGenerationEnabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select day of month" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(28)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}{i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"} of every month
                    </SelectItem>
                  ))}
                  <SelectItem value="last">Last day of month</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                The system will automatically create next month&apos;s rent entry on this day
              </p>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}