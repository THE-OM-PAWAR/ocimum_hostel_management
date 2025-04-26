"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface RoomComponent {
  id: string;
  name: string;
  description: string;
}

interface CreateRoomTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blockId: string;
}

export function CreateRoomTypeDialog({
  isOpen,
  onClose,
  onSuccess,
  blockId,
}: CreateRoomTypeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [components, setComponents] = useState<RoomComponent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    components: [] as string[],
    rent: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchComponents();
    }
  }, [isOpen]);

  const fetchComponents = async () => {
    try {
      const response = await fetch(`/api/blocks/${blockId}/components`);
      const data = await response.json();
      setComponents(data);
    } catch (error) {
      console.error("Error fetching components:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/blocks/${blockId}/room-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          rent: parseFloat(formData.rent),
          blockId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create room type");
      }

      toast({
        title: "Success",
        description: "Room type created successfully",
      });

      onSuccess();
      onClose();
      setFormData({
        name: "",
        description: "",
        components: [],
        rent: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create room type. Please try again.",
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Room Type</DialogTitle>
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {formData.components.length > 0
                    ? `${formData.components.length} component${formData.components.length > 1 ? 's' : ''} selected`
                    : "Select components"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <div className="p-2">
                  <Input
                    placeholder="Search components..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-2"
                  />
                  <div className="max-h-[200px] overflow-y-auto">
                    {filteredComponents.map((component) => (
                      <div
                        key={component.id}
                        className={cn(
                          "flex items-center space-x-2 p-2 cursor-pointer hover:bg-accent rounded-md",
                          formData.components.includes(component.id) && "bg-accent"
                        )}
                        onClick={() => handleComponentToggle(component.id)}
                      >
                        <div className={cn(
                          "h-4 w-4 border rounded-sm flex items-center justify-center",
                          formData.components.includes(component.id) && "bg-primary border-primary"
                        )}>
                          {formData.components.includes(component.id) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <span>{component.name}</span>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full mt-2 text-primary"
                      onClick={() => router.push(`/dashboard/${blockId}/settings/room-components`)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Component
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Room Type"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}