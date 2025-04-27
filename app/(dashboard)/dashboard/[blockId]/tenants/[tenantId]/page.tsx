"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Phone, Mail, MapPin, Calendar, Building2, Upload as UploadIcon, Bed, Users, Key } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tenant {
  _id: string;
  name: string;
  phone: string;
  email: string;
  emergencyContact: string;
  address: string;
  pinCode: string;
  idType: string;
  idNumber: string;
  joinDate: string;
  roomNumber: string;
  roomType: string;
  documents: { type: string; url: string }[];
  paymentHistory: {
    month: string;
    amount: number;
    status: "paid" | "pending" | "overdue";
    paidOn?: string;
  }[];
}

export default function TenantDetailsPage() {
  const params = useParams();
  const { user } = useUser();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchTenantDetails = async () => {
      if (!user?.id || !params.tenantId) return;
      try {
        const response = await fetch(`/api/users/${user.id}/tenants/${params.tenantId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch tenant: ${response.statusText}`);
        }
        const data = await response.json();
        setTenant(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
        setError("Failed to load tenant details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTenantDetails();
  }, [user?.id, params.tenantId]);

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tenantId", params.tenantId as string);

      const response = await fetch(`/api/users/${user?.id}/tenants/${params.tenantId}/documents`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload document");

      const updatedTenant = await response.json();
      setTenant(updatedTenant);
      
      // Show success message
    } catch (error) {
      console.error("Error uploading document:", error);
      // Show error message
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-lg text-destructive">{error || "Tenant not found"}</div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{tenant.name}</h1>
        <Badge variant="outline" className="text-sm">
          Room {tenant.roomNumber}
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="allotted-room">Allotted Room</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-semibold">
                    {tenant.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{tenant.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Joined on {format(new Date(tenant.joinDate), "PPP")}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{tenant.phone}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Emergency Contact</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{tenant.emergencyContact}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{tenant.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{tenant.address}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>ID Type & Number</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{tenant.idType} - {tenant.idNumber}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Room Details</Label>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>Room {tenant.roomNumber} ({tenant.roomType})</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="border-2 border-dashed rounded-lg p-6">
                  <input
                    type="file"
                    id="document-upload"
                    className="hidden"
                    onChange={handleDocumentUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="document-upload"
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <UploadIcon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {uploading ? "Uploading..." : "Click to upload document"}
                    </span>
                  </label>
                </div>

                <div className="grid gap-4">
                  {tenant.documents?.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <UploadIcon className="h-4 w-4" />
                        <span>{doc.type}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allotted-room" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Room Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Key className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Room Details</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Room Number</span>
                          <span className="font-medium">{tenant.roomNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Room Type</span>
                          <span className="font-medium">{tenant.roomType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Floor</span>
                          <span className="font-medium">2nd Floor</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Bed className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Room Amenities</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Air Conditioning", "Attached Bathroom", "Study Table", "Wardrobe"].map((amenity, index) => (
                          <Badge key={index} variant="secondary">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Room Occupancy</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Capacity</span>
                          <span className="font-medium">2 Persons</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Current Occupancy</span>
                          <span className="font-medium">1 Person</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Available Beds</span>
                          <span className="font-medium">1 Bed</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Occupancy Period</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Check-in Date</span>
                          <span className="font-medium">{format(new Date(tenant.joinDate), "PPP")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-medium">6 Months</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button>Add Payment</Button>
                </div>

                <div className="grid gap-4">
                  {tenant.paymentHistory?.map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{payment.month}</div>
                        <div className="text-sm text-muted-foreground">
                          ₹{payment.amount.toLocaleString()}
                        </div>
                        {payment.paidOn && (
                          <div className="text-xs text-muted-foreground">
                            Paid on {format(new Date(payment.paidOn), "PP")}
                          </div>
                        )}
                      </div>
                      <Badge
                        className={cn(
                          payment.status === "paid" && "bg-success/10 text-success",
                          payment.status === "pending" && "bg-warning/10 text-warning",
                          payment.status === "overdue" && "bg-destructive/10 text-destructive"
                        )}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}