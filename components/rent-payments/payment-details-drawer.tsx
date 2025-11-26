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
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface PaymentDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  payment: any;
}

interface OrganisationData {
  organisationName: string;
  ownerName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
  email: string;
  gstin?: string;
  pan?: string;
}

export function PaymentDetailsDrawer({
  isOpen,
  onClose,
  payment,
}: PaymentDetailsDrawerProps) {
  const { user } = useUser();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [organisationData, setOrganisationData] = useState<OrganisationData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch payment details
        const paymentResponse = await fetch(`/api/rent-payments/${payment._id}/details`);
        if (!paymentResponse.ok) throw new Error("Failed to fetch payment details");
        const paymentData = await paymentResponse.json();
        setPaymentDetails(paymentData);

        // Fetch organisation data
        if (user?.id) {
          const organisationResponse = await fetch(`/api/owners/${user.id}`);
          if (!organisationResponse.ok) throw new Error("Failed to fetch organisation data");
          const organisationData = await organisationResponse.json();
          setOrganisationData(organisationData);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      }
    };

    if (isOpen && payment._id) {
      fetchData();
    }
  }, [isOpen, payment._id, toast, user?.id]);

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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            :root {
              --primary: hsl(157, 61%, 66%);
              --primary-foreground: hsl(157, 25%, 16%);
              --muted: hsl(157, 10%, 96.1%);
              --muted-foreground: hsl(157, 5%, 45.1%);
            }
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              color: #000;
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #000;
            }
            .organisation-name {
              font-size: 28px;
              font-weight: bold;
              color: #000;
              margin-bottom: 8px;
            }
            .receipt-title {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #000;
            }
            .owner-info {
              font-size: 14px;
              color: #666;
              margin-top: 8px;
            }
            .section {
              margin-bottom: 30px;
              background: #f8f8f8;
              padding: 20px;
              border-radius: 8px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #000;
              border-bottom: 1px solid #ddd;
              padding-bottom: 8px;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .label {
              color: #666;
              font-size: 14px;
              margin-bottom: 4px;
            }
            .value {
              font-weight: 500;
              font-size: 16px;
              color: #000;
            }
            .amount {
              font-size: 24px;
              font-weight: bold;
              color: #000;
            }
            .status {
              display: inline-hostel;
              padding: 4px 12px;
              border-radius: 4px;
              font-size: 14px;
              font-weight: 500;
              background: var(--primary);
              color: #000;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            .contact-info {
              margin-top: 20px;
              font-size: 14px;
              color: #666;
            }
            .address-hostel {
              margin-top: 10px;
              line-height: 1.5;
            }
            @media print {
              body {
                padding: 20px;
              }
              .section {
                break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="organisation-name">${organisationData?.organisationName || 'Organisation Management System'}</div>
            <div class="receipt-title">Payment Receipt</div>
            <div class="owner-info">
              ${organisationData?.ownerName ? `Owner: ${organisationData.ownerName}` : ''}
            </div>
            <div class="address-hostel">
              ${organisationData?.address ? `${organisationData.address},` : ''}
              ${organisationData?.city ? `${organisationData.city},` : ''}
              ${organisationData?.state ? `${organisationData.state} -` : ''}
              ${organisationData?.pincode ? `${organisationData.pincode}` : ''}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Payment Information</div>
            <div class="grid">
              <div>
                <div class="label">Amount</div>
                <div class="amount">₹${paymentDetails.amount.toLocaleString()}</div>
              </div>
              <div>
                <div class="label">Status</div>
                <div class="status">${paymentDetails.status.toUpperCase()}</div>
              </div>
              <div>
                <div class="label">Month</div>
                <div class="value">${paymentDetails.month} ${paymentDetails.year}</div>
              </div>
              <div>
                <div class="label">Payment Type</div>
                <div class="value">${paymentDetails.type}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Room Details</div>
            <div class="grid">
              <div>
                <div class="label">Room Number</div>
                <div class="value">${paymentDetails.roomNumber}</div>
              </div>
              <div>
                <div class="label">Room Type</div>
                <div class="value">${paymentDetails.roomType}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Payment Schedule</div>
            <div class="grid">
              <div>
                <div class="label">Due Date</div>
                <div class="value">${format(new Date(paymentDetails.dueDate), "PPP")}</div>
              </div>
              ${paymentDetails.paidDate ? `
                <div>
                  <div class="label">Paid Date</div>
                  <div class="value">${format(new Date(paymentDetails.paidDate), "PPP")}</div>
                </div>
              ` : ''}
              ${paymentDetails.paymentMethod ? `
                <div>
                  <div class="label">Payment Method</div>
                  <div class="value">${paymentDetails.paymentMethod.replace('_', ' ')}</div>
                </div>
              ` : ''}
            </div>
          </div>

          <div class="contact-info">
            <div>Phone: ${organisationData?.phoneNumber || 'Not provided'}</div>
            <div>Email: ${organisationData?.email || 'Not provided'}</div>
          </div>

          <div class="footer">
            <div>Generated on ${format(new Date(), "PPP")}</div>
            <div>This is a computer-generated receipt and does not require a signature.</div>
            ${organisationData?.gstin ? `<div>GSTIN: ${organisationData.gstin}</div>` : ''}
            ${organisationData?.pan ? `<div>PAN: ${organisationData.pan}</div>` : ''}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  if (!paymentDetails) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Payment Details</SheetTitle>
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
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