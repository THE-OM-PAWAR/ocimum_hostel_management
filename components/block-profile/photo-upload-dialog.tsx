"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";
import { compressDocumentImage, isImageFile } from "@/utils/image-compressor";

interface PhotoUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blockId: string;
}

export function PhotoUploadDialog({
  isOpen,
  onClose,
  onSuccess,
  blockId,
}: PhotoUploadDialogProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "common" as 'boys' | 'girls' | 'common' | 'exterior' | 'interior' | 'amenities',
    file: null as File | null,
    isMain: false,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isImageFile(file)) {
        toast({
          title: "Error",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      try {
        const compressedFile = await compressDocumentImage(file);
        setFormData(prev => ({ ...prev, file: compressedFile }));
        
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        
        const url = URL.createObjectURL(compressedFile);
        setPreviewUrl(url);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process image",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!formData.file || !formData.title) {
      toast({
        title: "Error",
        description: "Please provide a title and select a photo",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", formData.file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }

      const result = await response.json();
      
      const photoResponse = await fetch(`/api/blocks/${blockId}/profile/photos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: result.secure_url,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          isMain: formData.isMain,
        }),
      });

      if (!photoResponse.ok) {
        throw new Error("Failed to save photo");
      }

      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });

      onSuccess();
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setFormData({
      title: "",
      description: "",
      type: "common",
      file: null,
      isMain: false,
    });
    setPreviewUrl(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Block Photo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photoTitle">Photo Title</Label>
            <Input
              id="photoTitle"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter photo title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="photoDescription">Description (Optional)</Label>
            <Textarea
              id="photoDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter photo description"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Photo Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: typeof formData.type) => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boys">Boys Section</SelectItem>
                <SelectItem value="girls">Girls Section</SelectItem>
                <SelectItem value="common">Common Areas</SelectItem>
                <SelectItem value="exterior">Building Exterior</SelectItem>
                <SelectItem value="interior">Interior Spaces</SelectItem>
                <SelectItem value="amenities">Amenities</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="photoFile">Select Photo</Label>
            <div className="grid w-full items-center gap-1.5">
              <Input
                id="photoFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label
                htmlFor="photoFile"
                className="cursor-pointer flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-6 transition-colors hover:border-muted-foreground/50"
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG, JPEG (max 5MB)
                  </span>
                </div>
              </Label>
            </div>
          </div>

          {previewUrl && (
            <div className="mt-4 border rounded-md p-2">
              <div className="text-sm font-medium mb-2">Preview:</div>
              <img
                src={previewUrl}
                alt="Photo preview"
                className="max-h-[200px] object-contain mx-auto rounded"
              />
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !formData.file || !formData.title}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Photo"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}