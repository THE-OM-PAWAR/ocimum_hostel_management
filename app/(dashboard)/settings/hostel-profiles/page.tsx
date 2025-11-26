"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Building2, Settings, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Hostel {
  _id: string;
  name: string;
  description?: string;
}

export default function HostelProfilesPage() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHostels();
  }, [user?.id]);

  const fetchHostels = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/users/${user.id}/hostels`);
      if (!response.ok) {
        throw new Error("Failed to fetch hostels");
      }
      const data = await response.json();
      setHostels(data);
    } catch (error) {
      console.error("Error fetching hostels:", error);
      toast({
        title: "Error",
        description: "Failed to fetch hostels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHostelProfileClick = (hostelId: string) => {
    router.push(`/settings/hostel-profiles/${hostelId}`);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <LoadingSkeleton className="h-10 w-64" />
          <LoadingSkeleton className="h-6 w-96 mt-2" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Hostel Profiles</h1>
        <p className="text-muted-foreground mt-2">
          Manage detailed information and settings for each of your hostels
        </p>
      </div>

      {hostels.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg">No hostels found</h3>
          <p className="text-muted-foreground mt-2 text-center max-w-sm">
            Create your first hostel from the dashboard to start managing hostel profiles
          </p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="mt-6"
          >
            Go to Dashboard
          </Button>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hostels.map((hostel, index) => (
            <motion.div
              key={hostel._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card 
                className="cursor-pointer hover:shadow-md transition-all duration-300 h-full"
                onClick={() => handleHostelProfileClick(hostel._id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
                      {hostel.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {hostel.description || "Manage hostel profile and settings"}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Settings className="h-4 w-4" />
                      <span>Configure Profile</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}