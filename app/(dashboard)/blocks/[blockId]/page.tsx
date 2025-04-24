"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
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

export default function BlockDetailsPage() {
  const params = useParams();
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
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
      setSelectedTenants(tenants.map(tenant => tenant.id));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Block Details</h1>
        <div className="flex gap-3">
          <Button className="shadow-sm hover:shadow-md transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Create Tenant
          </Button>
          <Button className="shadow-sm hover:shadow-md transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Create Room
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tenants" className="w-full">
        <TabsList className="w-full sm:w-auto border bg-card shadow-sm">
          <TabsTrigger value="tenants" className="flex-1 sm:flex-none">Tenants</TabsTrigger>
          <TabsTrigger value="rooms" className="flex-1 sm:flex-none">Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="mt-6">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <Button variant="ghost" size="icon" onClick={refreshData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <div className="text-sm text-muted-foreground">
                {selectedTenants.length} selected
              </div>
              
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedTenants.length === tenants.length}
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
                  {tenants.map((tenant) => (
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
              <Button variant="ghost" size="icon" onClick={refreshData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <div className="text-sm text-muted-foreground">
                {selectedRooms.length} selected
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedRooms.length === rooms.length}
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
    </div>
  );
}