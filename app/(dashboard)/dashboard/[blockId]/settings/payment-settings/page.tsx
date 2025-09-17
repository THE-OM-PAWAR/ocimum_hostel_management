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
import { Calendar, Clock, Users, AlertCircle, Info } from "lucide-react";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface PaymentSettings {
  rentGenerationDay: string;
  rentGenerationEnabled: boolean;
  paymentGenerationType: 'global' | 'join_date_based';
  paymentVisibilityDays: number;
}

export default function PaymentSettingsPage() {
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<PaymentSettings>({
    rentGenerationDay: "1",
    rentGenerationEnabled: true,
    paymentGenerationType: 'join_date_based',
    paymentVisibilityDays: 2,
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
      
      setSettings({
        rentGenerationDay: data.rentGenerationDay || "1",
        rentGenerationEnabled: data.rentGenerationEnabled ?? true,
        paymentGenerationType: data.paymentGenerationType || 'join_date_based',
        paymentVisibilityDays: data.paymentVisibilityDays || 2,
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
      setSettings(prev => ({
        ...prev,
        ...data,
      }));

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
      <div className="space-y-6">
        <div>
          <LoadingSkeleton className="h-10 w-64" />
          <LoadingSkeleton className="h-6 w-96 mt-2" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <LoadingSkeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <LoadingSkeleton className="h-20" />
                <LoadingSkeleton className="h-32" />
                <LoadingSkeleton className="h-10 w-24 ml-auto" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
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
            {/* Enable/Disable Rent Generation */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Rent Generation</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automatic generation of monthly rent entries
                </p>
              </div>
              <Switch
                checked={settings.rentGenerationEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, rentGenerationEnabled: checked }))
                }
              />
            </div>

            {settings.rentGenerationEnabled && (
              <>
                <Separator />
                
                {/* Payment Generation Type */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Payment Generation Method</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose how rent due dates are calculated for your tenants
                    </p>
                  </div>
                  
                  <RadioGroup
                    value={settings.paymentGenerationType}
                    onValueChange={(value: 'global' | 'join_date_based') => 
                      setSettings(prev => ({ ...prev, paymentGenerationType: value }))
                    }
                    className="space-y-4"
                  >
                    {/* Join Date Based Option */}
                    <div className="flex items-start space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="join_date_based" id="join_date_based" className="mt-1" />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="join_date_based" className="font-medium cursor-pointer">
                          Individual Due Dates (Recommended)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Each tenant's rent is due on the same day they joined. For example, if someone joins on the 15th, 
                          their rent will always be due on the 15th of every month.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>Personalized for each tenant</span>
                        </div>
                      </div>
                    </div>

                    {/* Global Due Date Option */}
                    <div className="flex items-start space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="global" id="global" className="mt-1" />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="global" className="font-medium cursor-pointer">
                          Fixed Due Date for All
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          All tenants have the same monthly due date regardless of when they joined. 
                          Easier to manage but less flexible.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Same date for everyone</span>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Global Due Date Setting (only shown when global is selected) */}
                {settings.paymentGenerationType === 'global' && (
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <Label>Monthly Due Date</Label>
                    <Select
                      value={settings.rentGenerationDay}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, rentGenerationDay: value }))}
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
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      All tenants will have rent due on this day every month
                    </p>
                  </div>
                )}

                <Separator />

                {/* Payment Visibility Settings */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Payment Visibility</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure when payments become visible to tenants before the due date
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Show Payments</Label>
                    <Select
                      value={settings.paymentVisibilityDays.toString()}
                      onValueChange={(value) => 
                        setSettings(prev => ({ ...prev, paymentVisibilityDays: parseInt(value) }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select visibility period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day before due date</SelectItem>
                        <SelectItem value="2">2 days before due date</SelectItem>
                        <SelectItem value="3">3 days before due date</SelectItem>
                        <SelectItem value="5">5 days before due date</SelectItem>
                        <SelectItem value="7">1 week before due date</SelectItem>
                        <SelectItem value="14">2 weeks before due date</SelectItem>
                        <SelectItem value="30">Always visible</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Payments will become visible to tenants this many days before the due date
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Information Alerts */}
                <div className="space-y-4">
                  {settings.paymentGenerationType === 'join_date_based' ? (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Individual Due Dates:</strong> Each tenant's rent will be due on the same day of the month they joined. 
                        This provides a personalized payment schedule but may result in payments spread throughout the month.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Fixed Due Date:</strong> All tenants will have rent due on the {settings.rentGenerationDay}
                        {settings.rentGenerationDay === "1" ? "st" : 
                         settings.rentGenerationDay === "2" ? "nd" : 
                         settings.rentGenerationDay === "3" ? "rd" : "th"} of every month. 
                        This makes payment collection more predictable but less flexible for tenants.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Payments will become visible {settings.paymentVisibilityDays} day{settings.paymentVisibilityDays !== 1 ? 's' : ''} before the due date, 
                      giving tenants adequate time to prepare for payment.
                    </AlertDescription>
                  </Alert>
                </div>
              </>
            )}

            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preview Section */}
      {settings.rentGenerationEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-medium">Current Settings</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Generation Method:</span>
                        <span className="font-medium">
                          {settings.paymentGenerationType === 'join_date_based' 
                            ? 'Individual Due Dates' 
                            : 'Fixed Due Date'
                          }
                        </span>
                      </div>
                      {settings.paymentGenerationType === 'global' && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Due Date:</span>
                          <span className="font-medium">
                            {settings.rentGenerationDay}
                            {settings.rentGenerationDay === "1" ? "st" : 
                             settings.rentGenerationDay === "2" ? "nd" : 
                             settings.rentGenerationDay === "3" ? "rd" : "th"} of every month
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Visibility:</span>
                        <span className="font-medium">
                          {settings.paymentVisibilityDays} day{settings.paymentVisibilityDays !== 1 ? 's' : ''} before due
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">Example Scenarios</h3>
                    <div className="space-y-2 text-sm">
                      {settings.paymentGenerationType === 'join_date_based' ? (
                        <>
                          <div className="p-2 bg-muted/50 rounded">
                            <div className="font-medium">Tenant A (Joined 5th)</div>
                            <div className="text-muted-foreground">Due: 5th of every month</div>
                          </div>
                          <div className="p-2 bg-muted/50 rounded">
                            <div className="font-medium">Tenant B (Joined 20th)</div>
                            <div className="text-muted-foreground">Due: 20th of every month</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-2 bg-muted/50 rounded">
                            <div className="font-medium">All Tenants</div>
                            <div className="text-muted-foreground">
                              Due: {settings.rentGenerationDay}
                              {settings.rentGenerationDay === "1" ? "st" : 
                               settings.rentGenerationDay === "2" ? "nd" : 
                               settings.rentGenerationDay === "3" ? "rd" : "th"} of every month
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}