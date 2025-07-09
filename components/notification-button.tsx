"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Bell, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface PendingUser {
  userId: {
    _id: string;
    email: string;
    userId: string;
    ownerName: string;
    phoneNumber: string;
  };
  joinedAt: string;
}

export function NotificationButton() {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [hostelId, setHostelId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchPendingUsers();
  }, [user?.id]);

  const fetchPendingUsers = async () => {
    if (!user?.id) return;
    
    try {
      // First get user's hostel info and role
      const hostelResponse = await fetch(`/api/users/${user.id}/hostel-info`);
      const hostelData = await hostelResponse.json();
      
      if (hostelData.error || hostelData.userRole !== 'admin') {
        return; // Only admins see notifications
      }
      
      setUserRole(hostelData.userRole);
      setHostelId(hostelData.hostelId);
      
      // Then fetch pending users
      const response = await fetch(`/api/hostels/${hostelData.hostelId}/pending-users`);
      const data = await response.json();
      setPendingUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    }
  };

  const updateUser = async (userId: string, updates: any) => {
    if (!hostelId) return;
    
    try {
      const response = await fetch(`/api/hostels/${hostelId}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      toast({
        title: "Success",
        description: `User ${updates.status === 'approved' ? 'approved' : 'rejected'} successfully`,
      });

      fetchPendingUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  // Only show for admins with pending users
  if (userRole !== 'admin' || pendingUsers.length === 0) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {pendingUsers.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {pendingUsers.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Pending Approvals</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                router.push('/settings/users');
                setIsOpen(false);
              }}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {pendingUsers.map((user) => (
              <div key={user.userId._id} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {user.userId.ownerName || user.userId.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.userId.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => updateUser(user.userId.userId, { status: 'approved', role: 'tenant' })}
                  >
                    <UserCheck className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => updateUser(user.userId.userId, { status: 'rejected' })}
                  >
                    <UserX className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}