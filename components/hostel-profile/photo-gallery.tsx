"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, X, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HostelPhoto {
  url: string;
  title: string;
  description?: string;
  type: 'boys' | 'girls' | 'common' | 'exterior' | 'interior' | 'amenities';
  isMain?: boolean;
}

interface PhotoGalleryProps {
  photos: HostelPhoto[];
  onRemovePhoto: (index: number) => void;
  onSetMainPhoto: (index: number) => void;
}

export function PhotoGallery({ photos, onRemovePhoto, onSetMainPhoto }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<HostelPhoto | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getPhotoTypeLabel = (type: string) => {
    switch (type) {
      case 'boys': return 'Boys Section';
      case 'girls': return 'Girls Section';
      case 'common': return 'Common Areas';
      case 'exterior': return 'Building Exterior';
      case 'interior': return 'Interior Spaces';
      case 'amenities': return 'Amenities';
      default: return type;
    }
  };

  const getPhotoTypeBadge = (type: string) => {
    const colors = {
      boys: 'bg-blue-100 text-blue-800',
      girls: 'bg-pink-100 text-pink-800',
      common: 'bg-green-100 text-green-800',
      exterior: 'bg-orange-100 text-orange-800',
      interior: 'bg-purple-100 text-purple-800',
      amenities: 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {getPhotoTypeLabel(type)}
      </Badge>
    );
  };

  const openPreview = (photo: HostelPhoto) => {
    setSelectedPhoto(photo);
    setIsPreviewOpen(true);
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
        <div className="text-muted-foreground">No photos uploaded yet</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <div className="aspect-video rounded-lg overflow-hidden border cursor-pointer">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onClick={() => openPreview(photo)}
              />
            </div>
            
            <div className="absolute top-2 left-2 flex gap-1">
              {getPhotoTypeBadge(photo.type)}
              {photo.isMain && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" />
                  Main
                </Badge>
              )}
            </div>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openPreview(photo)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                {!photo.isMain && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onSetMainPhoto(index)}
                  >
                    <Star className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onRemovePhoto(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="mt-2">
              <h4 className="font-medium text-sm">{photo.title}</h4>
              {photo.description && (
                <p className="text-xs text-muted-foreground">{photo.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Photo Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedPhoto?.title}</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2">
                {getPhotoTypeBadge(selectedPhoto.type)}
                {selectedPhoto.isMain && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Main Photo
                  </Badge>
                )}
              </div>
              {selectedPhoto.description && (
                <p className="text-muted-foreground">{selectedPhoto.description}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}