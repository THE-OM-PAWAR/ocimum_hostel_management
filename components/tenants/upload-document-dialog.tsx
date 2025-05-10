"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, File } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface UploadDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  tenantId: string;
}

export function UploadDocumentDialog({
  isOpen,
  onClose,
  onSuccess,
  tenantId,
}: UploadDocumentDialogProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [documentName, setDocumentName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentName.trim()) {
      toast({
        title: "Error",
        description: "Please select a file and provide a document name",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to Cloudinary through our API
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload document");
      }

      const uploadResult = await uploadResponse.json();

      // Save document reference to tenant
      const response = await fetch(`/api/users/${user?.id}/tenants/${tenantId}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: documentName,
          url: uploadResult.secure_url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save document reference");
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      await onSuccess();
      handleClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setDocumentName("");
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  const isImage = selectedFile?.type.startsWith("image/");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document-name">Document Name</Label>
              <Input
                id="document-name"
                placeholder="e.g., ID Card, Lease Agreement"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-file">Document File</Label>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                  id="document-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Label
                  htmlFor="document-file"
                  className="cursor-pointer flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-6 transition-colors hover:border-muted-foreground/50"
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PDF, PNG, JPG, JPEG (Max 5MB)
                    </span>
                  </div>
                </Label>
              </div>
            </div>

            {previewUrl && (
              <div className="mt-4 border rounded-md p-2">
                <div className="text-sm font-medium mb-2">Preview:</div>
                {isImage ? (
                  <img
                    src={previewUrl}
                    alt="Document preview"
                    className="max-h-[200px] object-contain mx-auto"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-4 bg-muted rounded-md">
                    <File className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium truncate">
                      {selectedFile?.name}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !documentName || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Document"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 