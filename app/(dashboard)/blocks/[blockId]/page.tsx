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
    router.push(`/blocks/${params.blockId}/settings`);
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

      <Tabs defaultValue="tenants" className="w-full">
        <TabsList className="w-full sm:w-auto bg-background border">
          <TabsTrigger value="tenants" className="flex-1 sm:flex-none">Tenants</TabsTrigger>
          <TabsTrigger value="rooms" className="flex-1 sm:flex-none">Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="mt-6">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={refreshData}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                {selectedTenants.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={handleDeleteSelected}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedTenants.length === filteredTenants.length && filteredTenants.length > 0}
                        onCheckedChange={handleSelectAllTenants}
                      />
                    </TableHead>
                    <TableHead className="font-semibold">Tenant Name</TableHead>
                    <TableHead className="font-semibold">Contact Number</TableHead>
                    <TableHead className="font-semibold">Payment Status</TableHead>
                    <TableHead className="font-semibold">Room Number</TableHead>
                    <TableHead className="font-semibold">Room Type</TableHead>
                    <TableHead className="font-semibold">Joining Date</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map((tenant) => (
                    <TableRow 
                      key={tenant.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <Checkbox 
                          checked={selectedTenants.includes(tenant.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTenants([...selectedTenants, tenant.id]);
                            } else {
                              setSelectedTenants(selectedTenants.filter(id => id !== tenant.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>{tenant.contactNumber}</TableCell>
                      <TableCell>{getPaymentStatusBadge(tenant.paymentStatus)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-background">
                          {tenant.roomNumber}
                        </Badge>
                      </TableCell>
                      <TableCell>{tenant.roomType}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(tenant.joiningDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="hover:bg-accent h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rooms" className="mt-6">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={refreshData}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                {selectedRooms.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={handleDeleteSelected}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                {selectedRooms.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {selectedRooms.length} selected
                  </span>
                )}
                <Button className="shadow-sm hover:shadow-md transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Room
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedRooms.length === rooms.length && rooms.length > 0}
                        onCheckedChange={handleSelectAllRooms}
                      />
                    </TableHead>
                    <TableHead className="font-semibold">Room Type</TableHead>
                    <TableHead className="font-semibold">Price per Bed</TableHead>
                    <TableHead className="font-semibold">Number of Rooms</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow 
                      key={room.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <Checkbox 
                          checked={selectedRooms.includes(room.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRooms([...selectedRooms, room.id]);
                            } else {
                              setSelectedRooms(selectedRooms.filter(id => id !== room.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{room.type}</TableCell>
                      <TableCell>₹{room.pricePerBed.toLocaleString()}</TableCell>
                      <TableCell>{room.numberOfRooms}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="hover:bg-accent h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CreateTenantDialog
        isOpen={isCreateTenantOpen}
        onClose={() => setIsCreateTenantOpen(false)}
        onSuccess={handleTenantCreated}
        blockId={Array.isArray(params.blockId) ? params.blockId[0] : params.blockId}
      />
    </div>
  );
}