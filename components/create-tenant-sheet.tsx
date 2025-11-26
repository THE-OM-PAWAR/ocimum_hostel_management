"use client";

import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

interface CreateTenantSheetProps {
  hostelId: string;
  onSuccess: () => void;
  isMobile?: boolean;
}

export function CreateTenantSheet({ hostelId, onSuccess, isMobile }: CreateTenantSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isRoomTypeOpen, setIsRoomTypeOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const roomTypeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    emergencyContact: "",
    idType: "",
    idNumber: "",
    joinDate: new Date(),
    roomNumber: "",
    roomType: "",
    address: "",
    pinCode: "",
    paymentStatus: "pending" as const,
  });

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await fetch(`/api/hostels/${hostelId}/room-types`);
        if (response.ok) {
          const data = await response.json();
          setRoomTypes(data);
        }
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    };

    if (isOpen) {
      fetchRoomTypes();
    }
  }, [isOpen, hostelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/users/${user?.id}/tenants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          hostel: hostelId,
          status: "active",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create tenant");
      }

      toast({
        title: "Success",
        description: "Tenant created successfully",
      });

      onSuccess();
      setIsOpen(false);
      setFormData({
        name: "",
        phone: "",
        emergencyContact: "",
        idType: "",
        idNumber: "",
        joinDate: new Date(),
        roomNumber: "",
        roomType: "",
        address: "",
        pinCode: "",
        paymentStatus: "pending",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tenant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
      setIsDatePickerOpen(false);
    }
    if (roomTypeRef.current && !roomTypeRef.current.contains(event.target as Node)) {
      setIsRoomTypeOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          {!isMobile && <span className="ml-2">Create Tenant</span>}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[50%] max-w-full sm:max-w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Tenant</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder="Emergency contact"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idType">ID Type</Label>
              <select
                id="idType"
                value={formData.idType}
                onChange={(e) => setFormData(prev => ({ ...prev, idType: e.target.value }))}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                required
              >
                <option value="">Select ID type</option>
                <option value="aadhar">Aadhar Card</option>
                <option value="pan">PAN Card</option>
                <option value="driving">Driving License</option>
                <option value="voter">Voter ID</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                placeholder="Enter ID number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Join Date</Label>
              <div className="relative" ref={datePickerRef}>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.joinDate && "text-muted-foreground"
                  )}
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.joinDate ? (
                    format(formData.joinDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>

                {isDatePickerOpen && (
                  <div className="absolute z-50 mt-1 bg-popover border rounded-md shadow-md">
                    <Calendar
                      mode="single"
                      selected={formData.joinDate}
                      onSelect={(date) => {
                        if (date) {
                          setFormData(prev => ({ ...prev, joinDate: date }));
                          setIsDatePickerOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input
                id="roomNumber"
                value={formData.roomNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                placeholder="Enter room number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type</Label>
              <div className="relative" ref={roomTypeRef}>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsRoomTypeOpen(!isRoomTypeOpen)}
                >
                  {formData.roomType || "Select room type"}
                </Button>

                {isRoomTypeOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md">
                    <div className="p-2">
                      {roomTypes.map((type) => (
                        <button
                          key={type._id}
                          type="button"
                          className="w-full px-2 py-1 text-left cursor-pointer hover:bg-accent rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({ ...prev, roomType: type.name }));
                            setIsRoomTypeOpen(false);
                          }}
                        >
                          {type.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pinCode">PIN Code (Optional)</Label>
            <Input
              id="pinCode"
              value={formData.pinCode}
              onChange={(e) => setFormData(prev => ({ ...prev, pinCode: e.target.value }))}
              placeholder="Enter PIN code"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Tenant"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}