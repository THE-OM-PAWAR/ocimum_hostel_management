"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Eye, Download, Trash2, FileText, Image as ImageIcon, File, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface DocumentItem {
  _id?: string;
  type: string;
  url: string;
}

interface DocumentListProps {
  documents: DocumentItem[];
  tenantId: string;
  onDocumentDeleted: () => Promise<void>;
}

export function DocumentList({ documents, tenantId, onDocumentDeleted }: DocumentListProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    setIsDeleting(true);
    try {
      if (!documentToDelete._id) {
        toast({
          title: "Error",
          description: "Cannot delete this document as it has no ID",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/users/${user?.id}/tenants/${tenantId}/documents`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: documentToDelete._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      await onDocumentDeleted();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const confirmDelete = (document: DocumentItem) => {
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };

  const openPreview = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const getDocumentIcon = (url: string) => {
    if (url.match(/\.(jpeg|jpg|gif|png)$/i)) {
      return <ImageIcon className="h-8 w-8 text-primary" />;
    } else if (url.match(/\.(pdf)$/i)) {
      return <FileText className="h-8 w-8 text-primary" />;
    } else {
      return <File className="h-8 w-8 text-primary" />;
    }
  };

  const isImage = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/i) !== null;
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((document, index) => (
          <div
            key={document._id || `doc-${index}`}
            className="flex flex-col border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Document Preview */}
            <div 
              className="h-40 bg-muted flex items-center justify-center cursor-pointer"
              onClick={() => openPreview(document)}
            >
              {isImage(document.url) ? (
                <img 
                  src={document.url} 
                  alt={document.type} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4">
                  {getDocumentIcon(document.url)}
                  <span className="mt-2 text-sm text-muted-foreground">
                    {document.url.split("/").pop()?.split(".").pop()?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Document Info */}
            <div className="p-4">
              <h4 className="font-medium truncate">{document.type}</h4>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {document.url.split("/").pop()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between p-2 border-t bg-accent/5">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => openPreview(document)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => {
                  const link = window.document.createElement("a");
                  link.href = document.url;
                  link.download = document.type;
                  window.document.body.appendChild(link);
                  link.click();
                  window.document.body.removeChild(link);
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-destructive hover:text-destructive"
                onClick={() => confirmDelete(document)}
                disabled={!document._id}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Sheet */}
      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent 
          side="right" 
          className="w-full md:w-1/2 p-0 overflow-hidden"
        >
          <div className="p-4 border-b">
            <SheetHeader>
              <SheetTitle>{selectedDocument?.type}</SheetTitle>
              <SheetDescription className="truncate">
                {selectedDocument?.url.split("/").pop()}
              </SheetDescription>
            </SheetHeader>
          </div>
          
          <div className="h-[calc(100vh-10rem)] w-full overflow-hidden">
            {selectedDocument && isImage(selectedDocument.url) ? (
              <TransformWrapper
                initialScale={1}
                initialPositionX={0}
                initialPositionY={0}
                minScale={0.5}
                maxScale={8}
                limitToBounds={true}
                doubleClick={{
                  mode: "reset",
                }}
                panning={{
                  velocityDisabled: true,
                  lockAxisX: false,
                  lockAxisY: false,
                  allowLeftClickPan: true,
                  allowMiddleClickPan: true,
                  allowRightClickPan: false,
                  disabled: false,
                }}
                wheel={{
                  disabled: false,
                  step: 0.1,
                  touchPadDisabled: false,
                }}
                alignmentAnimation={{
                  sizeX: 0,
                  sizeY: 0,
                  animationTime: 0,
                  animationType: "linear",
                }}
                centerOnInit={true}
                centerZoomedOut={true}
              >
                {({ zoomIn, zoomOut, resetTransform }) => (
                  <>
                    {!isMobile && (
                      <div className="absolute top-4 right-4 z-10 flex gap-2 bg-background/80 backdrop-blur-sm rounded-md p-1">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => zoomIn()}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => zoomOut()}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => resetTransform()}
                        >
                          <RotateCw className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <TransformComponent
                      wrapperStyle={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden"
                      }}
                      contentStyle={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <img
                        src={selectedDocument.url}
                        alt={selectedDocument.type}
                        className="max-h-full max-w-full object-contain"
                        style={{ touchAction: "none" }}
                      />
                    </TransformComponent>
                  </>
                )}
              </TransformWrapper>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center p-4">
                <div className="p-8 bg-muted rounded-lg flex flex-col items-center">
                  {selectedDocument && getDocumentIcon(selectedDocument.url)}
                  <p className="mt-4 text-muted-foreground">
                    Preview not available. <a href={selectedDocument?.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">Open file</a>
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end p-4 border-t gap-2 bg-background">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                if (!selectedDocument) return;
                const link = window.document.createElement("a");
                link.href = selectedDocument.url;
                link.download = selectedDocument.type;
                window.document.body.appendChild(link);
                link.click();
                window.document.body.removeChild(link);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document "{documentToDelete?.type}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDocument}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 