"use client";

import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (url: string) => void;
  buttonText?: string;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export function CloudinaryUploadWidget({ 
  onUploadSuccess,
  buttonText = "Upload Image" 
}: CloudinaryUploadWidgetProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const createUploadWidget = useCallback(() => {
    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary configuration is missing");
      return;
    }

    const options = {
      cloudName,
      uploadPreset,
      sources: ["local", "camera"],
      multiple: false,
      maxFiles: 1,
      cropping: true,
      styles: {
        palette: {
          window: "#FFFFFF",
          windowBorder: "#90A0B3",
          tabIcon: "#0078FF",
          menuIcons: "#5A616A",
          textDark: "#000000",
          textLight: "#FFFFFF",
          link: "#0078FF",
          action: "#FF620C",
          inactiveTabIcon: "#0E2F5A",
          error: "#F44235",
          inProgress: "#0078FF",
          complete: "#20B832",
          sourceBg: "#E4EBF1"
        },
        fonts: {
          default: null,
          "'Poppins', sans-serif": {
            url: "https://fonts.googleapis.com/css?family=Poppins",
            active: true
          }
        }
      }
    };

    return window.cloudinary.createUploadWidget(
      options,
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          onUploadSuccess(result.info.secure_url);
        }
      }
    );
  }, [cloudName, uploadPreset, onUploadSuccess]);

  useEffect(() => {
    // Load Cloudinary script
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleClick = () => {
    const widget = createUploadWidget();
    if (widget) {
      widget.open();
    }
  };

  return (
    <Button 
      onClick={handleClick}
      variant="outline"
      className="w-full"
    >
      <Upload className="h-4 w-4 mr-2" />
      {buttonText}
    </Button>
  );
}