"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface PaymentDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  payment: any;
}

export function PaymentDetailsDrawer({
  isOpen,
  onClose,
  payment,
}: PaymentDetailsDrawerProps) {
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`/api/rent-payments/${payment._id}/details`);
        if (!response.ok) throw new Error("Failed to fetch payment details");
        const data = await response.json();
        setPaymentDetails(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load payment details",
          variant: "destructive",
        });
      }
    };

    if (isOpen && payment._id) {
      fetchDetails();
    }
  }, [isOpen, payment._id, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success/10 text-success">Paid</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-warning/10 text-warning">Pending</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Undefined</Badge>;
    }
  };

  if (!paymentDetails) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Payment Details</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
          <div className="space-y-6 mt-6">
            {/* Basic Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold">₹{paymentDetails.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(paymentDetails.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Month</p>
                  <p>{paymentDetails.month} {paymentDetails.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Type</p>
                  <p className="capitalize">{paymentDetails.type}</p>
                </div>
                {paymentDetails.label && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Label</p>
                    <p>{paymentDetails.label}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Room Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Room Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Room Number</p>
                  <p>{paymentDetails.roomNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Room Type</p>
                  <p>{paymentDetails.roomType}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p>{format(new Date(paymentDetails.dueDate), "PPP")}</p>
                </div>
                {paymentDetails.paidDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Paid Date</p>
                    <p>{format(new Date(paymentDetails.paidDate), "PPP")}</p>
                  </div>
                )}
                {paymentDetails.paymentMethod && (
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="capitalize">{paymentDetails.paymentMethod.replace('_', ' ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Change History */}
            {paymentDetails.changeLog && paymentDetails.changeLog.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Change History</h3>
                  <div className="space-y-4">
                    {paymentDetails.changeLog.map((log: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant={log.type === 'edit' ? 'outline' : 'destructive'}>
                            {log.type === 'edit' ? 'Edited' : 'Cancelled'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(log.date), "PPP")}
                          </span>
                        </div>
                        
                        {log.changes && (
                          <div className="space-y-2 pt-2">
                            {log.changes.amount && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Amount:</span>
                                <span className="line-through text-muted-foreground">
                                  ₹{log.changes.amount.from.toLocaleString()}
                                </span>
                                <span>→</span>
                                <span className="font-medium">
                                  ₹{log.changes.amount.to.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {log.changes.status && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Status:</span>
                                <span>{getStatusBadge(log.changes.status.from)}</span>
                                <span>→</span>
                                <span>{getStatusBadge(log.changes.status.to)}</span>
                              </div>
                            )}
                            {log.changes.paymentMethod && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Payment Method:</span>
                                <span className="capitalize">
                                  {log.changes.paymentMethod.from || 'None'}
                                </span>
                                <span>→</span>
                                <span className="capitalize font-medium">
                                  {log.changes.paymentMethod.to}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="pt-2 text-sm">
                          <span className="text-muted-foreground">Reason: </span>
                          <span>{log.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}