"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MoreVertical, Edit, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditPaymentDialog } from "./edit-payment-dialog";
import { RemovePaymentDialog } from "./remove-payment-dialog";
import { PaymentDetailsDrawer } from "./payment-details-drawer";
import { useToast } from "@/hooks/use-toast";

interface PaymentActionsProps {
  payment: any;
  onSuccess: () => void;
}

export function PaymentActions({ payment, onSuccess }: PaymentActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const { toast } = useToast();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Payment
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsRemoveDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Cancel Payment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDetailsDrawerOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Payment Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditPaymentDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={onSuccess}
        payment={payment}
      />

      <RemovePaymentDialog
        isOpen={isRemoveDialogOpen}
        onClose={() => setIsRemoveDialogOpen(false)}
        onSuccess={onSuccess}
        payment={payment}
      />

      <PaymentDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        payment={payment}
      />
    </>
  );
}