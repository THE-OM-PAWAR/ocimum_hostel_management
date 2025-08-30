"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Plus, Search, Package2, ChevronDown, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RoomTypeImage {
  url: string;
  title: string;
  isCover: boolean;
}

interface RentPayment {
  year: number;
  _id: string;
  month: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "undefined";
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
}

interface Tenant {
  _id: string;
  name: string;
  phone: string;
  paymentStatus: "paid" | "pending" | "overdue";
  roomNumber: string;
  roomType: string;
  joinDate: string;
  recentPayments: RentPayment[];
  profileImage: string;
  roomTypeDetails?: {
    images: RoomTypeImage[];
  };
  block: {
    _id: string;
    name: string;
  };
  status: string;
}

export default function TenantsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchTenants = async () => {
      if (!isLoaded || !user?.id) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${user.id}/tenants`);
        if (!response.ok) {
          throw new Error("Failed to fetch tenants");
        }
        const data = await response.json();
        
        // Fetch rent payments for each tenant
        const tenantsWithPayments = await Promise.all(
          data.map(async (tenant: Tenant) => {
            try {
              const paymentsResponse = await fetch(`/api/rent-payments?tenantId=${tenant._id}`);
              const payments = await paymentsResponse.json();
              
              // Calculate payment status based on recent payments
              const currentMonth = new Date().toLocaleString('default', { month: 'long' });
              const currentYear = new Date().getFullYear();
              const currentPayment = payments.find((p: RentPayment) => 
                p.month === currentMonth && p.year === currentYear
              );
              
              return {
                ...tenant,
                recentPayments: payments,
                paymentStatus: currentPayment?.status || 'undefined'
              };
            } catch (error) {
              console.error(`Error fetching payments for tenant ${tenant._id}:`, error);
              return {
                ...tenant,
                recentPayments: [],
                paymentStatus: 'undefined'
              };
            }
          })
        );
        
        setTenants(tenantsWithPayments);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [user?.id, isLoaded]);

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
        return (
          <Badge variant="outline" className="bg-muted/10 hover:bg-muted/20 transition-colors">
            Undefined
          </Badge>
        );
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.phone.includes(searchQuery) ||
    tenant.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.block.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (tenantId: string) => {
    const tenant = tenants.find(t => t._id === tenantId);
    if (tenant) {
      router.push(`/dashboard/${tenant.block._id}/tenants/${tenantId}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-6">
          <LoadingSkeleton className="h-10 w-64" />
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <LoadingSkeleton className="h-10 flex-1 max-w-md" />
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">All Tenants</h1>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-1">
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
              Start by adding tenants to your blocks to see them here
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredTenants.map((tenant) => (
              <div 
                key={tenant._id}
                className="p-4 flex items-center justify-between hover:bg-accent/5 transition-colors cursor-pointer"
                onClick={() => tenant._id && handleViewDetails(tenant._id as string)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  const element = e.currentTarget.querySelector('[data-trigger="rent-history"]') as HTMLElement;
                  if (element) {
                    element.click();
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={tenant.profileImage} alt={tenant.name} />
                    <AvatarFallback>{tenant.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{tenant.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">Room {tenant.roomNumber}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{tenant.block.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-trigger="rent-history"
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          isMobile && "px-2",
                          "flex items-center gap-2"
                        )}
                      >
                        {isMobile ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <>
                            Rent History
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      align="end" 
                      className="w-[240px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2">
                        <h4 className="text-sm font-medium mb-2">Last 3 Months</h4>
                        <div className="space-y-2">
                          {tenant.recentPayments?.slice(0, 3).map((payment) => (
                            <div key={payment._id} className="flex items-center justify-between">
                              <div className="text-sm">
                                <div>{payment.month}</div>
                                <div className="text-xs text-muted-foreground">
                                  ₹{payment.amount.toLocaleString()}
                                </div>
                              </div>
                              {getPaymentStatusBadge(payment.status)}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full justify-start"
                            onClick={() => tenant._id && handleViewDetails(tenant._id.toString())}
                          >
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            className="w-full justify-start"
                          >
                            Add Rent Payment
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredTenants.length === 0 && tenants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg">No results found</h3>
          <p className="text-muted-foreground mt-2 text-center max-w-sm">
            Try adjusting your search terms to find what you&apos;re looking for
          </p>
        </motion.div>
      )}
    </div>
  );
}