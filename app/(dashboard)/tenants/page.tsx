"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Plus, Search, Package2, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface Tenant {
  _id: string;
  name: string;
  phone: string;
  roomNumber: string;
  roomType: string;
  block: {
    _id: string;
    name: string;
  };
  status: string;
  joinDate: string;
}

export default function TenantsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTenants = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/users/${user.id}/tenants`);
        if (!response.ok) {
          throw new Error("Failed to fetch tenants");
        }
        const data = await response.json();
        setTenants(data);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTenants();
    }
  }, [user?.id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success">Active</Badge>;
      case "left":
        return <Badge variant="secondary">Left</Badge>;
      case "blacklisted":
        return <Badge variant="destructive">Blacklisted</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return null;
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.phone.includes(searchQuery) ||
    tenant.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (blockId: string, tenantId: string) => {
    router.push(`/dashboard/${blockId}/tenants/${tenantId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tenants</h1>
        <p className="text-muted-foreground mt-2">
          Manage all your tenants across different blocks
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tenants..." 
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        {tenants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Package2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-lg">No tenants yet</h3>
            <p className="text-muted-foreground mt-2 text-center max-w-sm">
              Start by adding tenants to your blocks
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredTenants.map((tenant) => (
              <motion.div 
                key={tenant._id}
                className="p-4 flex items-center justify-between hover:bg-accent/5 transition-colors cursor-pointer"
                onClick={() => tenant._id && handleViewDetails(tenant.block._id, tenant._id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-medium">{tenant.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">Room {tenant.roomNumber}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{tenant.roomType}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{tenant.block.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {getStatusBadge(tenant.status)}
                  <div className="text-sm text-muted-foreground">
                    Joined {format(new Date(tenant.joinDate), "PP")}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(tenant.block._id, tenant._id);
                      }}>
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}