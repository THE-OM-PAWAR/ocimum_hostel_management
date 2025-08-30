"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { RoomTypeImageGallery } from "./room-type-image-gallery";

interface RoomComponent {
  _id: string;
  name: string;
  description: string;
}

interface RoomTypeImage {
  url: string;
  title: string;
  isCover: boolean;
}

interface RoomType {
  _id: string;
  name: string;
  description: string;
  components: RoomComponent[];
  rent: number;
  images: RoomTypeImage[];
}

interface EditRoomTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blockId: string;
  roomType: RoomType;
}

export function EditRoomTypeDialog({
  isOpen,
  onClose,
  onSuccess,
  blockId,
  roomType,
}: EditRoomTypeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [components, setComponents] = useState<RoomComponent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: roomType.name,
    description: roomType.description,
    components: roomType.components.map(c => c._id),
    rent: roomType.rent.toString(),
    images: roomType.images || [],
  });

  useEffect(() => {
    if (isOpen) {
      fetchComponents();
    }
  }, [isOpen, blockId]);

  const fetchComponents = async () => {
    try {
      const response = await fetch(`/api/blocks/${blockId}/components`);
      if (!response.ok) {
        throw new Error("Failed to fetch components");
      }
      const data = await response.json();
      setComponents(data);
    } catch (error) {
      console.error("Error fetching components:", error);
      toast({
        title: "Error",
        description: "Failed to fetch room components",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        console.log("roomType", roomType);
      const response = await fetch(`/api/blocks/${blockId}/room-types/${roomType._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          rent: parseFloat(formData.rent),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update room type");
      }

      toast({
        title: "Success",
        description: "Room type updated successfully",
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update room type. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredComponents = components.filter((component) =>
    component.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleComponentToggle = (componentId: string) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.includes(componentId)
        ? prev.components.filter(id => id !== componentId)
        : [...prev.components, componentId]
    }));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setIsPopoverOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddImage = (image: RoomTypeImage) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({ ...img, isCover: false })).concat({
        ...image,
        isCover: image.isCover || prev.images.length === 0
      })
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSetCoverImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({ ...img, isCover: i === index }))
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Room Type</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Type Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter room type name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter room type description"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Room Components</Label>
            <div className="relative" ref={popoverRef}>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                className="w-full justify-between"
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              >
                {formData.components.length > 0
                  ? `${formData.components.length} component${formData.components.length > 1 ? 's' : ''} selected`
                  : "Select components"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>

              {isPopoverOpen && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md">
                  <div className="p-2">
                    <Input
                      type="text"
                      placeholder="Search components..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredComponents.map((component) => (
                        <button
                          key={component._id}
                          type="button"
                          className={cn(
                            "w-full flex items-center space-x-2 p-2 cursor-pointer hover:bg-accent rounded-md text-left",
                            formData.components.includes(component._id) && "bg-accent"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComponentToggle(component._id);
                          }}
                        >
                          <div className={cn(
                            "h-4 w-4 border rounded-sm flex items-center justify-center shrink-0",
                            formData.components.includes(component._id) && "bg-primary border-primary"
                          )}>
                            {formData.components.includes(component._id) && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                          <span className="flex-1">{component.name}</span>
                        </button>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full mt-2 text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/${blockId}/settings/room-components`);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Component
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rent">Monthly Rent (₹)</Label>
            <Input
              id="rent"
              type="number"
              value={formData.rent}
              onChange={(e) => setFormData(prev => ({ ...prev, rent: e.target.value }))}
              placeholder="Enter monthly rent"
              required
              min="0"
              step="100"
            />
          </div>

          <RoomTypeImageGallery
            images={formData.images}
            onAddImage={handleAddImage}
            onRemoveImage={handleRemoveImage}
            onSetCoverImage={handleSetCoverImage}
          />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Room Type"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}