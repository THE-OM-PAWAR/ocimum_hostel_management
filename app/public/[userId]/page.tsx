"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Package2, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

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
  roomNumber: string;
  roomType: string;
  joinDate: string;
  recentPayments: RentPayment[];
}

export default function PublicTenantSearchPage({ params }: { params: { userId: string } }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.length !== 10) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/public/tenants/search?userId=${params.userId}&phone=${searchQuery}`);
      const data = await response.json();
      setTenants(data);
      setSearched(true);
    } catch (error) {
      console.error("Error searching tenants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.length === 10) {
      handleSearch();
    } else {
      setTenants([]);
      setSearched(false);
    }
  }, [searchQuery]);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Tenant Search</h1>
            <p className="text-muted-foreground mt-2">
              Search for tenant information using their mobile number
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Enter 10-digit mobile number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="pl-9 bg-background"
                type="tel"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin text-lg">Loading...</div>
            </div>
          ) : searched && tenants.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Package2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg">No tenants found</h3>
              <p className="text-muted-foreground mt-2 text-center max-w-sm">
                No tenant was found with the provided mobile number
              </p>
            </motion.div>
          ) : tenants.length > 0 ? (
            <div className="space-y-6">
              {tenants.map((tenant) => (
                <motion.div
                  key={tenant._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Tenant Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6">
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

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Phone Number</p>
                            <p>{tenant.phone}</p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Room Details</p>
                            <p>Room {tenant.roomNumber} ({tenant.roomType})</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium">Recent Payments</h4>
                          <div className="space-y-4">
                            {tenant.recentPayments?.slice(0, 3).map((payment) => (
                              <div
                                key={payment._id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                              >
                                <div>
                                  <div className="font-medium">{payment.month} {payment.year}</div>
                                  <div className="text-sm text-muted-foreground">
                                    ₹{payment.amount.toLocaleString()}
                                  </div>
                                  {payment.paidDate && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Paid on {format(new Date(payment.paidDate), "PP")}
                                    </div>
                                  )}
                                </div>
                                {getPaymentStatusBadge(payment.status)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}