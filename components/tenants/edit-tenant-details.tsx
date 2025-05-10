"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfileImage } from "./edit-profile-image";
import { 
  Bed, 
  Users, 
  Calendar, 
  DoorClosed, 
  Home, 
  Wifi, 
  Fan, 
  ShowerHead as Shower, 
  BookOpen, 
  Armchair, 
  PlusCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Hash,
  PhoneCall,
  Building2,
  Pencil,
  X,
  Loader2,
  Check
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface EditTenantDetailsProps {
  tenant: any;
  roomTypes: any[];
  onSuccess: () => Promise<void>;
}

export function EditTenantDetails({ tenant, roomTypes, onSuccess }: EditTenantDetailsProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: tenant.name,
    phone: tenant.phone,
    email: tenant.email || "",
    emergencyContact: tenant.emergencyContact,
    address: tenant.address || "",
    pinCode: tenant.pinCode || "",
    roomNumber: tenant.roomNumber,
    roomType: tenant.roomType,
  });

  useEffect(() => {
    const currentRoomType = roomTypes.find(type => type.name === formData.roomType);
    setSelectedRoomType(currentRoomType);
  }, [formData.roomType, roomTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/users/${user?.id}/tenants/${tenant._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update tenant details");
      }

      toast({
        title: "Success",
        description: "Tenant details updated successfully",
      });

      await onSuccess();
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tenant details",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAmenityIcon = (name: string) => {
    const icons: { [key: string]: any } = {
      "Air Conditioning": Fan,
      "Attached Bathroom": Shower,
      "Study Table": BookOpen,
      "Wardrobe": Armchair,
      "WiFi": Wifi,
    };
    const Icon = icons[name] || PlusCircle;
    return <Icon className="h-4 w-4" />;
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="sm:flex sm:gap-2">
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">Edit Details</span>
          </Button>
        </div>

        <Card className="p-6 relative">
          <div className="flex items-center gap-4 mb-6">
            <EditProfileImage tenant={tenant} onSuccess={onSuccess}>
              <Avatar className="h-20 w-20 cursor-pointer">
                <AvatarImage className="object-cover" src={tenant.profileImage} alt={formData.name} />
                <AvatarFallback className="bg-primary/10">
                  <User className="h-10 w-10 text-primary" />
                </AvatarFallback>
              </Avatar>
            </EditProfileImage>
            <div>
              <h2 className="text-2xl font-semibold">{formData.name}</h2>
              {/* <p className="text-muted-foreground">Tenant ID: {tenant._id}</p> */}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="capitalize">{tenant.status}</Badge>
                <span className="text-sm text-muted-foreground">
                  Member since {format(new Date(tenant.joinDate), "MMM yyyy")}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.email || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.emergencyContact}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Address Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.address || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.pinCode || "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Room Information</h3>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Room Details</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Room Number</span>
                    <span className="font-medium">{formData.roomNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Room Type</span>
                    <span className="font-medium">{formData.roomType}</span>
                  </div>
                  {selectedRoomType && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Monthly Rent</span>
                      <span className="font-medium">₹{selectedRoomType.rent.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Occupancy Details</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Check-in Date</span>
                    <span className="font-medium">{format(new Date(tenant.joinDate), "PPP")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className="capitalize">{tenant.status}</Badge>
                  </div>
                </div>
              </Card>
            </div>

            {selectedRoomType && (
              <Card className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Room Amenities</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedRoomType.components.map((component: any) => (
                    <Badge 
                      key={component._id} 
                      variant="secondary"
                      className="flex items-center gap-1.5 py-1.5"
                    >
                      {getAmenityIcon(component.name)}
                      {component.name}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedRoomType.description}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Edit Information</h3>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsEditing(false)}
            disabled={isSubmitting}
            className="sm:flex hidden"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)} 
            disabled={isSubmitting}
            className="sm:hidden flex"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="sm:flex hidden"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="sm:hidden flex"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <Label htmlFor="name">Full Name</Label>
            </div>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <Label htmlFor="phone">Phone Number</Label>
            </div>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <Label htmlFor="email">Email</Label>
            </div>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-primary" />
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
            </div>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <Label htmlFor="address">Address</Label>
            </div>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" />
              <Label htmlFor="pinCode">PIN Code</Label>
            </div>
            <Input
              id="pinCode"
              value={formData.pinCode}
              onChange={(e) => setFormData(prev => ({ ...prev, pinCode: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Edit Room Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="roomNumber">Room Number</Label>
            <Input
              id="roomNumber"
              value={formData.roomNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomType">Room Type</Label>
            <Select
              value={formData.roomType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, roomType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((type) => (
                  <SelectItem key={type._id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedRoomType && (
          <Card className="mt-4 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Selected Room Type Details</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monthly Rent</span>
                <span className="font-medium">₹{selectedRoomType.rent.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Included Amenities:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedRoomType.components.map((component: any) => (
                    <Badge 
                      key={component._id} 
                      variant="secondary"
                      className="flex items-center gap-1.5 py-1.5"
                    >
                      {getAmenityIcon(component.name)}
                      {component.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedRoomType.description}
              </p>
            </div>
          </Card>
        )}
      </div>
    </form>
  );
}