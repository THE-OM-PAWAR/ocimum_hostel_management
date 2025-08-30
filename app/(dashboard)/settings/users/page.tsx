"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Settings, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Checkbox } from "@/components/ui/checkbox";

interface HostelUser {
  id: string;
  userId: {
    _id: string;
    email: string;
    userId: string;
    ownerName: string;
    phoneNumber: string;
    role: string;
    assignedBlocks: Array<{ _id: string; name: string }>;
  };
  role: string;
  status: string;
  joinedAt: string;
}

interface Block {
  _id: string;
  name: string;
}

export default function UsersManagementPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [users, setUsers] = useState<HostelUser[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [hostelInfo, setHostelInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchHostelInfo();
    fetchBlocks();
  }, [user?.id]);

  const fetchHostelInfo = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/users/${user.id}/hostel-info`);
      const data = await response.json();
      setHostelInfo(data);
    } catch (error) {
      console.error("Error fetching hostel info:", error);
    }
  };

  const fetchBlocks = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/users/${user.id}/blocks`);
      const data = await response.json();
      setBlocks(data);
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  };

  const fetchUsers = async () => {
    if (!user?.id) return;
    try {
      // First get user's hostel info
      const hostelResponse = await fetch(`/api/users/${user.id}/hostel-info`);
      const hostelData = await hostelResponse.json();
      
      if (hostelData.error) {
        throw new Error(hostelData.error);
      }

      // Then fetch users for that hostel
      const response = await fetch(`/api/hostels/${hostelData.hostelId}/users`);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: any) => {
    if (!hostelInfo?.hostelId) return;
    
    try {
      const response = await fetch(`/api/hostels/${hostelInfo.hostelId}/users/${userId}`, {
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
        description: "User updated successfully",
      });

      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const copyJoinCode = async () => {
    if (!hostelInfo?.joinCode) return;
    
    try {
      await navigator.clipboard.writeText(hostelInfo.joinCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Join code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy join code",
        variant: "destructive",
      });
    }
  };

  const handleBlockAssignment = (userId: string, blockId: string, isChecked: boolean) => {
    const user = users.find(u => u.userId.userId === userId);
    if (!user) return;

    const currentBlocks = user.userId.assignedBlocks?.map(b => b._id) || [];
    let updatedBlocks;

    if (isChecked) {
      updatedBlocks = [...currentBlocks, blockId];
    } else {
      updatedBlocks = currentBlocks.filter(id => id !== blockId);
    }

    updateUser(userId, { assignedBlocks: updatedBlocks });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success/10 text-success">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-warning/10 text-warning">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="default">Admin</Badge>;
      case "manager":
        return <Badge variant="secondary">Manager</Badge>;
      case "warden":
        return <Badge variant="outline">Warden</Badge>;
      case "tenant":
        return <Badge variant="outline">Tenant</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <LoadingSkeleton className="h-10 w-64" />
          <LoadingSkeleton className="h-6 w-96 mt-2" />
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const pendingUsers = users.filter(u => u.status === 'pending');
  const approvedUsers = users.filter(u => u.status === 'approved');

  console.log(users);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage users and their permissions in your hostel
        </p>
      </div>

      {/* Join Code Card */}
      {hostelInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Hostel Join Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  Share this code with users to let them join your hostel
                </p>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-3 py-2 rounded-md text-lg font-mono">
                    {hostelInfo.joinCode}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyJoinCode}
                    className="flex items-center gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Approvals */}
      {pendingUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Pending Approvals ({pendingUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <motion.div
                  key={user.userId._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{user.userId.ownerName}</h3>
                    <p className="text-sm text-muted-foreground">{user.userId.email}</p>
                    <p className="text-sm text-muted-foreground">{user.userId.phoneNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      Requested to join on {new Date(user.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateUser(user.userId.userId, { status: 'approved', role: 'tenant' })}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateUser(user.userId.userId, { status: 'rejected' })}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            All Users ({approvedUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {approvedUsers.map((user) => (
              <motion.div
                key={user.userId._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{user.userId.ownerName}</h3>
                      {getStatusBadge(user.status)}
                      {getRoleBadge(user.role)}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.userId.email}</p>
                    <p className="text-sm text-muted-foreground">{user.userId.phoneNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined on {new Date(user.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {user.userId.userId !== user?.id && (
                    <div className="flex items-center gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Role</label>
                        <Select
                          value={user.role}
                          onValueChange={(role) => updateUser(user.userId.userId, { role })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tenant">Tenant</SelectItem>
                            <SelectItem value="warden">Warden</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Block Assignment */}
                {user.role !== 'admin' && user.role !== 'tenant' && blocks.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-medium">Assigned Blocks</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {blocks.map((block) => {
                        const isAssigned = user.userId.assignedBlocks?.some(b => b._id === block._id) || false;
                        return (
                          <div key={block._id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${user.userId._id}-${block._id}`}
                              checked={isAssigned}
                              onCheckedChange={(checked) => 
                                handleBlockAssignment(user.userId.userId, block._id, checked as boolean)
                              }
                            />
                            <label
                              htmlFor={`${user.userId._id}-${block._id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {block.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}