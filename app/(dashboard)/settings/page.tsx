"use client";

import { useUser } from "@clerk/nextjs";

export default function SettingsPage() {
  const { user } = useUser();

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
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-muted-foreground">{user?.emailAddresses[0].emailAddress}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-muted-foreground">{user?.fullName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}