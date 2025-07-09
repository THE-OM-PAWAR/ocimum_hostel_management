"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, MapPin, Building2, Sun, Moon, Laptop } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Owner {
  _id: string;
  userId: string;
  ownerName: string;
  hostelName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
  pan?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnerData = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`/api/owners/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch owner data');
        }
        const data = await response.json();
        setOwner(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching owner data:', error);
        setError('Failed to load owner data');
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, [user?.id]);

  console.log(owner);

  const handleLogout = () => {
    signOut(() => {
      router.push(`/`);
      console.log("User logged out");
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <LoadingSkeleton className="h-10 w-64" />
          <LoadingSkeleton className="h-6 w-96 mt-2" />
        </div>
        <div className="bg-card p-6 rounded-lg border shadow-sm space-y-4">
          <LoadingSkeleton className="h-8 w-48" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i ) => (
              <LoadingSkeleton key={i} className="h-20" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="text-destructive">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-muted-foreground">{owner?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-muted-foreground">{owner?.ownerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <p className="text-muted-foreground">{owner?.phoneNumber || 'Not provided'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Address</label>
                <p className="text-muted-foreground">{owner?.address || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">City</label>
                <p className="text-muted-foreground">{owner?.city || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">State</label>
                <p className="text-muted-foreground">{owner?.state || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Business Information</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">GSTIN</label>
                <p className="text-muted-foreground">{owner?.gstin || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">PAN</label>
                <p className="text-muted-foreground">{owner?.pan || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <Select
              value={theme}
              onValueChange={(value) => setTheme(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4" />
                    <span>System</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Logout</h3>
              <p className="text-sm text-muted-foreground">Sign out of your account</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}