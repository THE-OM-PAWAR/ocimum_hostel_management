"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Construction,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddRentPaymentDialog } from "@/components/rent-payments/add-rent-payment-dialog";
import { AddAdditionalPaymentDialog } from "@/components/rent-payments/add-additional-payment-dialog";
import { PaymentActions } from "@/components/rent-payments/payment-actions";
import { ChangeStatusDialog } from "@/components/tenants/change-status-dialog";
import { EditTenantDetails } from "@/components/tenants/edit-tenant-details";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useAppDispatch } from "@/store/hooks";
import { openDrawer } from "@/store/slices/drawerSlice";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

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
  status: string;
}

export default function TenantDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [rentPayments, setRentPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddAdditionalPaymentOpen, setIsAddAdditionalPaymentOpen] = useState(false);
  const [isChangeStatusDialogOpen, setIsChangeStatusDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [roomTypes, setRoomTypes] = useState([]);

  const calculatePaymentStats = () => {
    if (!rentPayments?.length) return {
      totalPaid: 0,
      paymentDue: 0,
      paidCount: 0,
      pendingCount: 0,
      overdueCount: 0
    };

    return rentPayments.reduce((acc, payment) => {
      // Calculate total paid
      if (payment.status === 'paid') {
        acc.totalPaid += payment.amount;
        acc.paidCount += 1;
      }

      // Calculate payment due (pending + overdue)
      if (payment.status === 'pending' || payment.status === 'overdue') {
        acc.paymentDue += payment.amount;
      }

      // Count payment statuses
      if (payment.status === 'pending') acc.pendingCount += 1;
      if (payment.status === 'overdue') acc.overdueCount += 1;

      return acc;
    }, {
      totalPaid: 0,
      paymentDue: 0,
      paidCount: 0,
      pendingCount: 0,
      overdueCount: 0
    });
  };

  // Calculate payment statistics
  const paymentStats = calculatePaymentStats();

  const fetchTenantDetails = useCallback(async () => {
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
    }
  }, [user?.id, params.tenantId]);

  const fetchRentPayments = useCallback(async () => {
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
  }, [params.tenantId]);

  const fetchRoomTypes = useCallback(async () => {
    if (!params.blockId) return;
    try {
      const response = await fetch(`/api/blocks/${params.blockId}/room-types`);
      if (!response.ok) {
        throw new Error("Failed to fetch room types");
      }
      const data = await response.json();
      setRoomTypes(data);
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
  }, [params.blockId]);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTenantDetails(),
        fetchRentPayments(),
        fetchRoomTypes()
      ]);
      setLoading(false);
    };

    if (user?.id && params.tenantId) {
      initializeData();
    }
  }, [user?.id, params.tenantId, fetchTenantDetails, fetchRentPayments, fetchRoomTypes]);

  const handlePaymentSuccess = async () => {
    await fetchRentPayments();
  };

  const handleStatusChange = async () => {
    await fetchTenantDetails();
  };

  const handleTenantUpdate = async () => {
    await fetchTenantDetails();
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
          <Badge variant="secondary" className="bg-warning/10 text-warning hover:bg-warning/20 transition-colors">
            Pending
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="destructive" className="bg-destructive/60 hover:bg-destructive/20 transition-colors">
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-muted/10 hover:bg-muted/20 transition-colors">
            Undefined
          </Badge>
        );
    }
  };

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

  const RentPaymentCard = ({ payment }: { payment: RentPayment }) => (
    <div className="relative flex items-start gap-2 pb-4">
      <div className="flex-1">
        <div className="bg-card border-2 rounded-lg p-4 sm:p-6 hover:shadow-md transition-all">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              {/* Header Section */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-medium text-base">
                    {payment.type === 'monthly' ? "Monthly Rent" : payment.label}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {getPaymentStatusBadge(payment.status)}
                    {payment.paymentMethod && (
                      <Badge variant="secondary" className="text-xs">
                        {payment.paymentMethod}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="sm:hidden">
                  <PaymentActions
                    payment={payment}
                    onSuccess={handlePaymentSuccess}
                    disabled={tenant?.status !== 'active'}
                  />
                </div>
              </div>

              {/* Amount and Month */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                <div className="text-2xl font-bold">
                  ₹{payment.amount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {payment.month} {payment.year}
                </div>
              </div>

              {/* Details Section */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{payment.roomType}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <span>Room {payment.roomNumber}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Due {format(new Date(payment.dueDate), "MMM d, yyyy")}</span>
                </div>
                {payment.paidDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Paid {format(new Date(payment.paidDate), "MMM d, yyyy")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Section - Desktop */}
            <div className="hidden sm:flex items-center justify-end sm:justify-start gap-4">
              <PaymentActions
                payment={payment}
                onSuccess={handlePaymentSuccess}
                disabled={tenant?.status !== 'active'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleOpenDrawer = () => {
    dispatch(openDrawer({
      page: 'tenants-details',
      content: {
        type: 'action',
        title: tenant?.name || 'Tenant Actions',
        description: `Room ${tenant?.roomNumber} - ${tenant?.roomType}`,
        actions: [
          {
            label: 'Change Status',
            icon: 'UserCog',
            onClick: () => setIsChangeStatusDialogOpen(true),
            description: 'Update tenant status',
            disabled: !isActive
          },
          {
            label: 'Add Monthly Payment',
            icon: 'CreditCard',
            onClick: () => setIsAddPaymentOpen(true),
            description: 'Record monthly rent payment',
            disabled: !isActive
          },
          {
            label: 'Add Additional Payment',
            icon: 'PlusCircle',
            onClick: () => setIsAddAdditionalPaymentOpen(true),
            description: 'Record additional payment',
            disabled: !isActive
          },
          {
            label: 'View Documents',
            icon: 'FileText',
            onClick: () => router.push(`/tenants/${params.tenantId}/documents`),
            description: 'Access tenant documents'
          },
          {
            label: 'Edit Details',
            icon: 'Edit',
            onClick: () => setIsEditMode(true),
            description: 'Update tenant information'
          },
          {
            label: 'Payment History',
            icon: 'History',
            onClick: () => setActiveTab('payments'),
            description: 'View payment records'
          }
        ],
        data: {
          tenant,
          paymentStats,
          isActive
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-10 w-64" />
          <LoadingSkeleton className="h-10 w-32" />
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <LoadingSkeleton key={i} className="h-20" />
                    ))}
                  </div>
                  <LoadingSkeleton className="h-32" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

  const isActive = tenant.status === 'active';

  return (
    <div className="space-y-6">
      {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold">{tenant.name}</h1>
            {getStatusBadge(tenant.status)}
          </div>

        </div>
      </div> */}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="profile" className="flex-1 sm:flex-none">Profile</TabsTrigger>
          <TabsTrigger value="documents" className="flex-1 sm:flex-none">Documents</TabsTrigger>
          <TabsTrigger value="payments" className="flex-1 sm:flex-none">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <EditTenantDetails
                tenant={tenant}
                roomTypes={roomTypes}
                onSuccess={handleTenantUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Construction className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">Coming Soon!</h3>
                <p className="text-muted-foreground max-w-sm">
                  Document management features are currently under development. Stay tuned for updates!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl mb-2 mt-4 font-bold">Payment History</h2>

            {/* Desktop view */}
            <div className="hidden sm:flex gap-2">
              <Button
                onClick={() => setIsAddPaymentOpen(true)}
                disabled={!isActive}
                className="w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Monthly Payment
              </Button>
              <Button
                onClick={() => setIsAddAdditionalPaymentOpen(true)}
                variant="outline"
                disabled={!isActive}
                className="w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Additional Payment
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsChangeStatusDialogOpen(true)}
              >
                <UserCog className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile view */}
            <div className="sm:hidden flex items-center justify-between gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => setIsChangeStatusDialogOpen(true)}
              >
                <UserCog className="h-4 w-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-100" align="end">
                  <div className="flex flex-col">
                    <button
                      onClick={() => setIsAddPaymentOpen(true)}
                      disabled={!isActive}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-sm text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Monthly Payment
                    </button>
                    <div className="h-px w-full bg-border" />
                    <button
                      onClick={() => setIsAddAdditionalPaymentOpen(true)}
                      disabled={!isActive}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-sm text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Additional Payment
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Total Paid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{paymentStats.totalPaid.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Last 3 months</p>
                <div className="mt-4 h-[60px]">
                  <div className="flex items-end justify-between h-full gap-2">
                    {rentPayments.slice(0, 3).map((payment, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 rounded-sm",
                          payment.status === 'paid' ? 'bg-success/20' : 'bg-primary/20'
                        )}
                        style={{ height: `${(payment.amount / Math.max(...rentPayments.slice(0, 3).map(p => p.amount))) * 100}%` }}
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
                    <Badge className="bg-success/10 text-success">{paymentStats.paidCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending</span>
                    <Badge
                      variant="secondary"
                      className="bg-warning/10 text-warning"
                    >
                      {paymentStats.pendingCount}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overdue</span>
                    <Badge variant="destructive">{paymentStats.overdueCount}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Payment Due
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{paymentStats.paymentDue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Total pending and overdue payments
                </p>
                <Button
                  className="w-full mt-4"
                  size="sm"
                  disabled={!isActive || paymentStats.paymentDue === 0}
                >
                  Pay Now
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
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

      {tenant && (
        <ChangeStatusDialog
          isOpen={isChangeStatusDialogOpen}
          onClose={() => setIsChangeStatusDialogOpen(false)}
          onSuccess={handleStatusChange}
          tenantId={tenant._id}
          currentStatus={tenant.status}
        />
      )}
    </div>
  );
}