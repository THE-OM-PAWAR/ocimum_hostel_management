"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, RefreshCw, Filter, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CreateTenantDialog } from "@/components/create-tenant-dialog";

interface Tenant {
  id: string;
  name: string;
  contactNumber: string;
  paymentStatus: "paid" | "pending" | "overdue";
  roomNumber: string;
  roomType: string;
  joiningDate: string;
}

interface Room {
  id: string;
  type: string;
  pricePerBed: number;
  numberOfRooms: number;
}

interface Block {
  _id: string;
  name: string;
  description?: string;
}

export default function BlockDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoaded } = useUser();
  const [block, setBlock] = useState<Block | null>(null);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [roomTypeFilter, setRoomTypeFilter] = useState<string | null>(null);
  const [isCreateTenantOpen, setIsCreateTenantOpen] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: "1",
      name: "John Doe",
      contactNumber: "+91 9876543210",
      paymentStatus: "paid",
      roomNumber: "101",
      roomType: "Single",
      joiningDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      contactNumber: "+91 9876543211",
      paymentStatus: "pending",
      roomNumber: "102",
      roomType: "Double",
      joiningDate: "2024-02-01",
    },
    {
      id: "3",
      name: "Mike Johnson",
      contactNumber: "+91 9876543212",
      paymentStatus: "overdue",
      roomNumber: "103",
      roomType: "Single",
      joiningDate: "2024-03-01",
    },
  ]);

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      type: "Single",
      pricePerBed: 5000,
      numberOfRooms: 10,
    },
    {
      id: "2",
      type: "Double",
      pricePerBed: 4000,
      numberOfRooms: 15,
    },
    {
      id: "3",
      type: "Triple",
      pricePerBed: 3500,
      numberOfRooms: 8,
    },
  ]);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      if (!isLoaded || !user || !params.blockId) return;
      try {
        if (!user) {
          console.error("User is not available.");
          return;
        }
        const response = await fetch(`/api/users/${user.id}/block/${params.blockId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setBlock(data);
      } catch (error) {
        console.error("Error fetching block details:", error);
      }
    };

    if (params.blockId) {
      fetchBlockDetails();
    }
  }, [params.blockId, user?.id, isLoaded]);

  const handleTenantCreated = () => {
    // Refresh the tenants list
    // This is where you would fetch the updated list from the API
    console.log("Tenant created successfully");
  };

  const filteredTenants = tenants.filter(tenant => {
    if (statusFilter && tenant.paymentStatus !== statusFilter) return false;
    if (roomTypeFilter && tenant.roomType !== roomTypeFilter) return false;
    return true;
  });

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-success/10 text-success hover:bg-success/20 transition-colors">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning hover:bg-warning/20 transition-colors">
            Pending
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="destructive" className="bg-destructive/10 hover:bg-destructive/20 transition-colors">
            Overdue
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleSelectAllTenants = (checked: boolean) => {
    if (checked) {
      setSelectedTenants(filteredTenants.map(tenant => tenant.id));
    } else {
      setSelectedTenants([]);
    }
  };

  const handleSelectAllRooms = (checked: boolean) => {
    if (checked) {
      setSelectedRooms(rooms.map(room => room.id));
    } else {
      setSelectedRooms([]);
    }
  };

  const refreshData = () => {
    // Implement refresh logic here
    console.log("Refreshing data...");
  };

  const handleDeleteSelected = () => {
    // Implement delete logic here
    console.log("Deleting selected items...");
  };

  const handleSettingsClick = () => {
    router.push(`/dashboard/${params.blockId}/settings`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">{block?.name || "Loading..."}</h1>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search tenants..." 
                className="pl-9 bg-background"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className={cn(
                    "relative",
                    (statusFilter || roomTypeFilter) && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  <Filter className="h-4 w-4" />
                  {(statusFilter || roomTypeFilter) && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Payment Status</h4>
                    <div className="space-y-1">
                      {['All', 'Paid', 'Pending', 'Overdue'].map((status) => (
                        <button
                          key={status}
                          className={cn(
                            "w-full text-left px-2 py-1 text-sm rounded-md hover:bg-accent",
                            statusFilter === status.toLowerCase() && "bg-primary/10 text-primary"
                          )}
                          onClick={() => setStatusFilter(status === 'All' ? null : status.toLowerCase())}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Room Type</h4>
                    <div className="space-y-1">
                      {['All', 'Single', 'Double', 'Triple'].map((type) => (
                        <button
                          key={type}
                          className={cn(
                            "w-full text-left px-2 py-1 text-sm rounded-md hover:bg-accent",
                            roomTypeFilter === type.toLowerCase() && "bg-primary/10 text-primary"
                          )}
                          onClick={() => setRoomTypeFilter(type === 'All' ? null : type.toLowerCase())}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button 
              variant="outline" 
              size="icon"
              className="hover:bg-accent"
              onClick={handleSettingsClick}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            {selectedTenants.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedTenants.length} selected
              </span>
            )}
            <Button 
              className="shadow-sm hover:shadow transition-all"
              onClick={() => setIsCreateTenantOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Tenant
            </Button>
          </div>
        </div>
      </div>



      <CreateTenantDialog
        isOpen={isCreateTenantOpen}
        onClose={() => setIsCreateTenantOpen(false)}
        onSuccess={handleTenantCreated}
        blockId={Array.isArray(params.blockId) ? params.blockId[0] : params.blockId}
      />
    </div>
  );
}