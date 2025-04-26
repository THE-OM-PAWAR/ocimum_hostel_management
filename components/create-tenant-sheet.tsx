"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Upload } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface CreateTenantSheetProps {
  blockId: string;
  onSuccess: () => void;
}

export function CreateTenantSheet({ blockId, onSuccess }: CreateTenantSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    documentUrl: "",
    paymentStatus: "pending" as const,
  });

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await fetch(`/api/blocks/${blockId}/room-types`);
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
  }, [isOpen, blockId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      try {
        const url = await uploadToCloudinary(file);
        setFormData(prev => ({ ...prev, documentUrl: url }));
        toast({
          title: "Success",
          description: "Document uploaded successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload document",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          block: blockId,
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
        documentUrl: "",
        paymentStatus: "pending",
      });
      setSelectedFile(null);
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Tenant
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Tenant</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-2">
            <Label>Join Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.joinDate && "text-muted-foreground"
                  )}
                >
                  {formData.joinDate ? (
                    format(formData.joinDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.joinDate}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, joinDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {formData.roomType || "Select room type"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <div className="p-2">
                    {roomTypes.map((type) => (
                      <div
                        key={type._id}
                        className="px-2 py-1 cursor-pointer hover:bg-accent rounded-md"
                        onClick={() => setFormData(prev => ({ ...prev, roomType: type.name }))}
                      >
                        {type.name}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
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

          <div className="space-y-2">
            <Label>Upload Document</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {selectedFile ? selectedFile.name : "Click to upload document"}
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
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