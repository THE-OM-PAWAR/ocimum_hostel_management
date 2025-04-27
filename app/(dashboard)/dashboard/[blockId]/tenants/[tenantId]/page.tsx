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
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Upload as UploadIcon,
  Bed,
  Users,
  Key,
  MoreVertical,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddRentPaymentDialog } from "@/components/rent-payments/add-rent-payment-dialog";
import { AddAdditionalPaymentDialog } from "@/components/rent-payments/add-additional-payment-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaymentActions } from "@/components/rent-payments/payment-actions";

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
  block: string;
}

interface RentPayment {
  _id: string;
  amount: number;
  month: string;
  year: number;
  status: "paid" | "pending" | "overdue" | "undefined";
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  type: "monthly" | "additional";
  label?: string;
  roomType?: string;
  roomNumber?: string;
}

export default function TenantDetailsPage() {
  const params = useParams();
  const { user } = useUser();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [rentPayments, setRentPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddAdditionalPaymentOpen, setIsAddAdditionalPaymentOpen] =
    useState(false);

  useEffect(() => {
    const fetchTenantDetails = async () => {
      if (!user?.id || !params.tenantId) return;
      try {
        const response = await fetch(
          `/api/users/${user.id}/tenants/${params.tenantId}`
        );
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

    const fetchRentPayments = async () => {
      if (!params.tenantId) return;
      try {
        const response = await fetch(
          `/api/rent-payments?tenantId=${params.tenantId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch rent payments");
        }
        const data = await response.json();
        setRentPayments(data);
      } catch (error) {
        console.error("Error fetching rent payments:", error);
      }
    };

    fetchTenantDetails();
    fetchRentPayments();
  }, [user?.id, params.tenantId]);

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tenantId", params.tenantId as string);

      const response = await fetch(
        `/api/users/${user?.id}/tenants/${params.tenantId}/documents`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload document");

      const updatedTenant = await response.json();
      setTenant(updatedTenant);
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setUploading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!params.tenantId) return;
    try {
      const response = await fetch(
        `/api/rent-payments?tenantId=${params.tenantId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch rent payments");
      }
      const data = await response.json();
      setRentPayments(data);
    } catch (error) {
      console.error("Error fetching rent payments:", error);
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-success/20 text-success hover:bg-success/20 transition-colors">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
          >
            Pending
          </Badge>
        );
      case "overdue":
        return (
          <Badge
            variant="destructive"
            className="bg-destructive/10 hover:bg-destructive/20 transition-colors"
          >
            Overdue
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="destructive"
            className="bg-destructive hover:bg-destructive/80 transition-colors"
          >
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-muted/10 hover:bg-muted/20 transition-colors"
          >
            Undefined
          </Badge>
        );
    }
  };

  console.log("Tenant Details:", rentPayments);
  const RentPaymentCard = ({ payment }: { payment: RentPayment }) => (
    <div className="relative flex items-start gap-4 pb-8">
      <div className="flex-1">
        <div className="bg-card border-2 rounded-lg p-6 hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-lg">
                  {payment.type === "monthly" ? "Monthly Rent" : payment.label}
                </h4>
                {getPaymentStatusBadge(payment.status)}
              </div>

              <div className="text-sm text-muted-foreground">
                {payment.month} {payment.year}
              </div>

              <div className="mt-4 text-2xl font-bold">
                ₹{payment.amount.toLocaleString()}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Room Type:</span>
                  <div className="font-medium">{payment.roomType}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Room Number:</span>
                  <div className="font-medium">{payment.roomNumber}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Due Date:</span>
                  <div className="font-medium">
                    {format(new Date(payment.dueDate), "PPP")}
                  </div>
                </div>
                {payment.paidDate && (
                  <div>
                    <span className="text-muted-foreground">Paid Date:</span>
                    <div className="font-medium">
                      {format(new Date(payment.paidDate), "PPP")}
                    </div>
                  </div>
                )}
              </div>

              {payment.paymentMethod && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Paid via
                  </span>
                  <Badge variant="secondary">{payment.paymentMethod}</Badge>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              
              <PaymentActions
                payment={payment}
                onSuccess={handlePaymentSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
        <div className="text-lg text-destructive">
          {error || "Tenant not found"}
        </div>
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
                    {tenant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
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
                    <span>
                      {tenant.idType} - {tenant.idNumber}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Room Details</Label>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Room {tenant.roomNumber} ({tenant.roomType})
                    </span>
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
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
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
                          <span className="text-muted-foreground">
                            Room Number
                          </span>
                          <span className="font-medium">
                            {tenant.roomNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Room Type
                          </span>
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
                        {[
                          "Air Conditioning",
                          "Attached Bathroom",
                          "Study Table",
                          "Wardrobe",
                        ].map((amenity, index) => (
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
                          <span className="text-muted-foreground">
                            Total Capacity
                          </span>
                          <span className="font-medium">2 Persons</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Current Occupancy
                          </span>
                          <span className="font-medium">1 Person</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Available Beds
                          </span>
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
                          <span className="text-muted-foreground">
                            Check-in Date
                          </span>
                          <span className="font-medium">
                            {format(new Date(tenant.joinDate), "PPP")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Duration
                          </span>
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

        <TabsContent value="payments" className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Payment History</h2>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddPaymentOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Monthly Payment
              </Button>
              <Button
                onClick={() => setIsAddAdditionalPaymentOpen(true)}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Additional Payment
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Total Paid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹24,000</div>
                <p className="text-xs text-muted-foreground">Last 3 months</p>
                <div className="mt-4 h-[60px]">
                  <div className="flex items-end justify-between h-full gap-2">
                    {[65, 85, 95].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary/20 rounded-sm"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Paid</span>
                    <Badge className="bg-success/10 text-success">6</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending</span>
                    <Badge
                      variant="secondary"
                      className="bg-warning/10 text-warning"
                    >
                      2
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overdue</span>
                    <Badge variant="destructive">1</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Next Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹12,000</div>
                <p className="text-xs text-muted-foreground">
                  Due on {format(new Date(), "PPP")}
                </p>
                <Button className="w-full mt-4" size="sm">
                  Pay Now
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-1">
            {rentPayments.map((payment) => (
              <RentPaymentCard key={payment._id} payment={payment} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AddRentPaymentDialog
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        tenantId={tenant._id}
        blockId={tenant.block}
        roomNumber={tenant.roomNumber}
        roomType={tenant.roomType}
      />

      <AddAdditionalPaymentDialog
        isOpen={isAddAdditionalPaymentOpen}
        onClose={() => setIsAddAdditionalPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        tenantId={tenant._id}
        blockId={tenant.block}
        roomNumber={tenant.roomNumber}
        roomType={tenant.roomType}
      />
    </div>
  );
}
