"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, Loader2, Crop } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import ReactCrop, { type Crop as CropType, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { compressProfileImage, isImageFile } from "@/utils/image-compressor";

interface EditProfileImageProps {
    tenant: any;
    onSuccess: () => Promise<void>;
    children?: React.ReactNode;
}

export function EditProfileImage({ tenant, onSuccess, children }: EditProfileImageProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [crop, setCrop] = useState<CropType>({
        unit: 'px',
        width: 100,
        height: 100,
        x: 0,
        y: 0
    });
    const [showCrop, setShowCrop] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const [completedCrop, setCompletedCrop] = useState<CropType | null>(null);

    // This creates a centered square crop
    const centerAspectCrop = useCallback(
        (mediaWidth: number, mediaHeight: number, aspect: number) => {
            // Calculate the max possible crop size while maintaining aspect ratio
            let cropWidth = mediaWidth;
            let cropHeight = cropWidth / aspect;
            
            if (cropHeight > mediaHeight) {
                cropHeight = mediaHeight;
                cropWidth = cropHeight * aspect;
            }
            
            // Ensure the crop is centered
            const x = (mediaWidth - cropWidth) / 2;
            const y = (mediaHeight - cropHeight) / 2;
            
            return {
                unit: 'px' as const,
                width: cropWidth,
                height: cropHeight,
                x: x,
                y: y,
            };
        },
        []
    );

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        
        // Always use a 1:1 aspect ratio for profile images
        const initialCrop = centerAspectCrop(width, height, 1);
        setCrop(initialCrop);
        setCompletedCrop(initialCrop);
    }, [centerAspectCrop]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!isImageFile(file)) {
                toast({
                    title: "Error",
                    description: "Please upload an image file",
                    variant: "destructive",
                });
                return;
            }

            try {
                // Compress the image before processing
                const compressedFile = await compressProfileImage(file);
                setSelectedFile(compressedFile);
                
                // Revoke previous object URL to avoid memory leaks
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }
                
                const url = URL.createObjectURL(compressedFile);
                setPreviewUrl(url);
                setShowCrop(true);
            } catch (error) {
                console.error('Error compressing image:', error);
                toast({
                    title: "Error",
                    description: "Failed to process image",
                    variant: "destructive",
                });
            }
        }
    };

    const getCroppedImg = async (image: HTMLImageElement, crop: CropType): Promise<File> => {
        if (!crop.width || !crop.height) {
            throw new Error('Invalid crop dimensions');
        }

        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        
        // Set canvas dimensions to the cropped size
        canvas.width = crop.width;
        canvas.height = crop.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('No 2d context');
        }

        // Fill with white background to ensure transparency is handled properly
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw only the cropped portion of the image
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        // Convert to blob with high quality
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) throw new Error('Canvas is empty');
                resolve(new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' }));
            }, 'image/jpeg', 0.95);
        });
    };

    const handleCropComplete = async () => {
        if (!imgRef.current || !completedCrop?.width || !completedCrop?.height) {
            toast({
                title: "Error",
                description: "Please select a crop area",
                variant: "destructive",
            });
            return;
        }

        try {
            const croppedFile = await getCroppedImg(imgRef.current, completedCrop);
            // Compress the cropped image
            const compressedCroppedFile = await compressProfileImage(croppedFile);
            setSelectedFile(compressedCroppedFile);
            
            // Revoke previous object URL to avoid memory leaks
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            
            const croppedUrl = URL.createObjectURL(compressedCroppedFile);
            setPreviewUrl(croppedUrl);
            setShowCrop(false);
        } catch (error) {
            console.error('Error cropping image:', error);
            toast({
                title: "Error",
                description: "Failed to crop image",
                variant: "destructive",
            });
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !previewUrl) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const uploadResponse = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error("Failed to upload image");
            }

            const uploadResult = await uploadResponse.json();

            const response = await fetch(`/api/users/${user?.id}/tenants/${tenant._id}/profile-image`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageUrl: uploadResult.secure_url,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile image");
            }

            toast({
                title: "Success",
                description: "Profile image updated successfully",
            });

            await onSuccess();
            setIsOpen(false);
        } catch (error) {
            console.error("Upload error:", error);
            toast({
                title: "Error",
                description: "Failed to update profile image",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
            
            // Clean up URLs
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            
            setSelectedFile(null);
            setPreviewUrl(null);
            setShowCrop(false);
        }
    };

    const handleCancel = () => {
        // Clean up URLs
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        
        setPreviewUrl(null);
        setSelectedFile(null);
        setShowCrop(false);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" size="sm" className="absolute top-4 right-4">
                        <Upload className="h-4 w-4 mr-2" />
                        Change Photo
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Profile Image</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="flex flex-col items-center gap-4">
                        {showCrop && previewUrl ? (
                            <div className="w-full">
                                <div className="bg-gray-100 rounded-md p-2 flex justify-center">
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(c) => setCrop(c)}
                                        onComplete={(c) => setCompletedCrop(c)}
                                        aspect={1}
                                        minWidth={50}
                                        minHeight={50}
                                        circularCrop
                                        keepSelection
                                        className="max-w-[300px] max-h-[300px]"
                                    >
                                        <img
                                            ref={imgRef}
                                            src={previewUrl}
                                            alt="Crop preview"
                                            onLoad={onImageLoad}
                                            style={{ 
                                                maxWidth: '100%', 
                                                maxHeight: '300px',
                                                display: 'hostel'
                                            }}
                                            className="object-contain"
                                        />
                                    </ReactCrop>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <Button onClick={handleCropComplete} disabled={!completedCrop?.width || !completedCrop?.height}>
                                        <Crop className="h-4 w-4 mr-2" />
                                        Apply Crop
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Avatar className="h-32 w-32">
                                <AvatarImage className="object-cover" src={previewUrl || tenant.profileImage} alt={tenant.name} />
                                <AvatarFallback className="bg-primary/10">
                                    <User className="h-16 w-16 text-primary" />
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div className="flex flex-col items-center gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="profile-image-upload"
                            />
                            <label
                                htmlFor="profile-image-upload"
                                className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Choose Image
                            </label>
                            <p className="text-sm text-muted-foreground">
                                Recommended: Square image
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isUploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!previewUrl || isUploading || showCrop}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 