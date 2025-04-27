"use client";

import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { Plus, Settings, Search, Package2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CreateTenantSheet } from "@/components/create-tenant-sheet";

interface RentPayment {
  month: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      if (!isLoaded || !user || !params.blockId) return;
      try {
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching block details:", error);
        setLoading(false);
      }
    };

    const fetchTenants = async () => {
      if (!isLoaded || !user || !params.blockId) return;
      try {
        const response = await fetch(`/api/users/${user.id}/tenants?blockId=${params.blockId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setTenants(data);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };

    if (params.blockId) {
      fetchBlockDetails();
      fetchTenants();
    }
  }, [params.blockId, user?.id, isLoaded]);

  const handleTenantCreated = () => {
    if (isLoaded && user && params.blockId) {
      fetchTenants();
    }
  };

  const fetchTenants = async () => {
    if (!isLoaded || !user || !params.blockId) return;
    try {
      const response = await fetch(`/api/users/${user.id}/tenants?blockId=${params.blockId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setTenants(data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };

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

  const handleSettingsClick = () => {
    router.push(`/dashboard/${params.blockId}/settings`);
  };

  const handleViewDetails = (tenantId: string) => {
    router.push(`/dashboard/${params.blockId}/tenants/${tenantId}`);
  };

  console.log("tenants", tenants);
  console.log("block", block);
  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="hover:bg-accent"
              onClick={handleSettingsClick}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          <CreateTenantSheet
            blockId={Array.isArray(params.blockId) ? params.blockId[0] : params.blockId}
            onSuccess={handleTenantCreated}
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
              Start by adding your first tenant to manage their details and payments
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredTenants.map((tenant: { _id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; roomNumber: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; roomType: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; paymentStatus: string; }) => (
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
                  <div>
                    <h3 className="font-medium">{tenant.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">Room {tenant.roomNumber}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{tenant.roomType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {getPaymentStatusBadge(tenant.paymentStatus)}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-trigger="rent-history"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Rent History
                        <ChevronDown className="ml-2 h-4 w-4" />
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
                          {[
                            { month: "March 2024", status: "paid", amount: 12000 },
                            { month: "February 2024", status: "paid", amount: 12000 },
                            { month: "January 2024", status: "paid", amount: 12000 },
                          ].map((payment, index) => (
                            <div key={index} className="flex items-center justify-between">
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
    </div>
  );
}