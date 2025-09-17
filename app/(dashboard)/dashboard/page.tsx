"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Plus, Building2, Users, Home, ArrowRight, Bell, Globe, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateBlockDialog } from "@/components/create-block-dialog";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface BlockCardProps {
  index: number;
  name: string;
  description?: string;
  id: string;
}

interface Block {
  _id: string;
  name: string;
  description?: string;
}

function CreateBlockCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-lg border-2 border-dashed border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col items-center justify-center h-[200px] group relative"
      onClick={onClick}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
        <div className="relative h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300">
          <Plus className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>
      <h3 className="font-semibold text-lg text-center group-hover:text-primary transition-colors duration-300">Create New Block</h3>
      <p className="text-sm text-muted-foreground mt-2 text-center max-w-[200px] group-hover:text-primary/80 transition-colors duration-300">
        Add a new block to your hostel
      </p>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}

function BlockCard({ index, name, description, id }: BlockCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 h-[200px] flex flex-col cursor-pointer group relative"
      onClick={() => router.push(`/dashboard/${id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
          <Home className="h-6 w-6 text-primary" />
        </div>
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <h3 className="font-semibold text-lg mt-4 group-hover:text-primary transition-colors duration-300">{name}</h3>
      <div className="flex-1 mt-2">
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click to manage rooms and tenants
          </p>
        )}
      </div>
      <div className="mt-auto pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>View Details</span>
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors duration-300" />
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [hostelName, setHostelName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [pendingUsersCount, setPendingUsersCount] = useState(0);

  const fetchBlocks = async () => {
    try {
      const response = await fetch(`/api/users/${user?.id}/blocks`);
      const data = await response.json();
      setBlocks(data);
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  };

  const fetchPendingUsers = async () => {
    if (!user?.id) return;
    try {
      const hostelResponse = await fetch(`/api/users/${user.id}/hostel-info`);
      const hostelData = await hostelResponse.json();
      
      if (!hostelData.error && hostelData.hostelId) {
        const response = await fetch(`/api/hostels/${hostelData.hostelId}/pending-users`);
        const data = await response.json();
        setPendingUsersCount(data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching pending users:", error);
    }
  };

  useEffect(() => {
    const fetchHostelInfo = async () => {
      try {
        const response = await fetch(`/api/users/${user?.id}/hostel-info`);
        const data = await response.json();
        
        if (data.error) {
          toast({
            title: "Access Denied",
            description: data.error,
            variant: "destructive",
          });
          return;
        }
        
        setHostelName(data.hostelName);
        setUserRole(data.userRole);
        await fetchBlocks();
        await fetchPendingUsers();
      } catch (error) {
        console.error("Error fetching hostel info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchHostelInfo();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <LoadingSkeleton className="h-10 w-64" />
          <LoadingSkeleton className="h-6 w-96 mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <LoadingSkeleton className="h-[200px]" />
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold"
          >
            {hostelName}
          </motion.h1>
          
          {userRole === 'admin' && pendingUsersCount > 0 && (
            <Button
              variant="outline"
              onClick={() => router.push('/settings/users')}
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              <Badge variant="destructive" className="ml-1">
                {pendingUsersCount}
              </Badge>
              Pending Approvals
            </Button>
          )}
        </div>
        
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg"
        >
          Manage your hostel blocks and rooms • Role: {userRole}
        </motion.p>
      </div>

      {/* Setup Prompts for Admin */}
      {userRole === 'admin' && (!hasHostelProfile || !hasBlockProfiles) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Complete Your Setup</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enhance your hostel management by setting up profiles and showcasing your property online.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {!hasHostelProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/settings/hostel-profile')}
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        Setup Hostel Profile
                      </Button>
                    )}
                    {!hasBlockProfiles && blocks.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/settings/block-profiles')}
                        className="flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Setup Block Profiles
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {userRole === 'admin' && (
          <CreateBlockCard onClick={() => setIsCreateDialogOpen(true)} />
        )}
        {blocks.length >= 1 && blocks.map((block, i) => (
          <BlockCard
            key={block._id}
            index={i}
            name={block.name}
            description={block.description}
            id={block._id}
          />
        ))}
      </div>

      {userRole === 'admin' && (
        <CreateBlockDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={fetchBlocks}
          userId={user?.id || ""}
          hostelId={hostelName}
        />
      )}
    </div>
  );
}