"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, X, Eye, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { compressDocumentImage, isImageFile } from "@/utils/image-compressor";

interface RoomTypeImage {
  url: string;
  title: string;
  isCover: boolean;
}

interface RoomTypeImageGalleryProps {
  images: RoomTypeImage[];
  onAddImage: (image: RoomTypeImage) => void;
  onRemoveImage: (index: number) => void;
  onSetCoverImage: (index: number) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
  disabled?: boolean;
}

export function RoomTypeImageGallery({ 
  images, 
  onAddImage, 
  onRemoveImage, 
  onSetCoverImage,
  onUploadStateChange,
  disabled = false 
}: RoomTypeImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<RoomTypeImage | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    file: null as File | null,
    isCover: false,
  });
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

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
      setUploadForm(prev => ({ ...prev, file: compressedFile }));
      
      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Create new preview URL
      const newPreviewUrl = URL.createObjectURL(compressedFile);
      setPreviewUrl(newPreviewUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title and select an image",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    onUploadStateChange?.(true);
    
    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      
      const newImage: RoomTypeImage = {
        url: result.secure_url,
        title: uploadForm.title.trim(),
        isCover: uploadForm.isCover || images.length === 0, // First image is cover by default
      };

      onAddImage(newImage);
      handleCloseUploadDialog();

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      onUploadStateChange?.(false);
    }
  };

  const handleCloseUploadDialog = () => {
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    setUploadForm({
      title: "",
      file: null,
      isCover: false,
    });
    setIsUploadDialogOpen(false);
  };

  const openPreview = (image: RoomTypeImage) => {
    setSelectedImage(image);
    setIsPreviewOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Room Images</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsUploadDialogOpen(true)}
            disabled={disabled || uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-video rounded-lg overflow-hidden border cursor-pointer">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onClick={() => openPreview(image)}
                  />
                </div>
                
                <div className="absolute top-2 left-2">
                  {image.isCover && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Cover
                    </Badge>
                  )}
                </div>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => openPreview(image)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    {!image.isCover && (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => onSetCoverImage(index)}
                        disabled={disabled}
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => onRemoveImage(index)}
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-2">
                  <h4 className="font-medium text-sm">{image.title}</h4>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-muted-foreground">No images uploaded yet</div>
          </div>
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.title}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2">
                {selectedImage.isCover && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Cover Image
                  </Badge>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={!uploading ? handleCloseUploadDialog : undefined}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Room Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageTitle">Image Title</Label>
              <Input
                id="imageTitle"
                value={uploadForm.title}
                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter image title"
                disabled={uploading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageFile">Select Image</Label>
              <div className="grid w-full items-center gap-1.5">
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
                <Label
                  htmlFor="imageFile"
                  className={`cursor-pointer flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-6 transition-colors hover:border-muted-foreground/50 ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {uploadForm.file ? uploadForm.file.name : "Click to upload or drag and drop"}
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
                  alt="Preview"
                  className="max-h-[200px] object-contain mx-auto rounded"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="setCover"
                checked={uploadForm.isCover}
                onChange={(e) => setUploadForm(prev => ({ ...prev, isCover: e.target.checked }))}
                className="rounded"
                disabled={uploading}
              />
              <Label htmlFor="setCover" className="text-sm">
                Set as cover image
              </Label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseUploadDialog}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={uploading || !uploadForm.file || !uploadForm.title.trim()}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Image"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}