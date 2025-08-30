"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Search, Package2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { CreateRoomTypeDialog } from "@/components/room-types/create-room-type-dialog";
import { EditRoomTypeDialog } from "@/components/room-types/edit-room-type-dialog";
import { DeleteRoomTypeDialog } from "@/components/room-types/delete-room-type-dialog";

interface RoomComponent {
  _id: string;
  id: string;
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
  blockId: string;
  images: RoomTypeImage[];
}

export default function RoomTypesPage() {
  const params = useParams();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const response = await fetch(`/api/blocks/${params.blockId}/room-types`);
      const data = await response.json();
      console.log("Fetched room types:", data);
      setRoomTypes(data);
    } catch (error) {
      console.error("Error fetching room types:", error);
      toast({
        title: "Error",
        description: "Failed to fetch room types",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomTypeId: string) => {
    console.log("Deleting room type with ID:", roomTypeId);
    try {
      await fetch(`/api/blocks/${params.blockId}/room-types/${roomTypeId}`, {
        method: "DELETE",
      });
      toast({
        title: "Success",
        description: "Room type deleted successfully",
      });
      fetchRoomTypes();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete room type",
        variant: "destructive",
      });
    }
  };

  const filteredRoomTypes = roomTypes.filter((roomType) =>
    roomType.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const RoomTypeCard = ({ roomType }: { roomType: RoomType }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border rounded-lg p-6 hover:shadow-md transition-all"
    >
      {/* Cover Image */}
      {roomType.images && roomType.images.length > 0 && (
        <div className="mb-4 -mx-6 -mt-6">
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={roomType.images.find(img => img.isCover)?.url || roomType.images[0]?.url}
              alt={roomType.name}
              className="w-full h-full object-cover"
            />
          </div>
          {roomType.images.length > 1 && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-black/50 text-white">
                +{roomType.images.length - 1} more
              </Badge>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{roomType.name}</h3>
          <p className="text-muted-foreground mt-2">{roomType.description}</p>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Components:</h4>
            <div className="flex flex-wrap gap-2">
              {roomType.components.map((component) => (
                <div
                  key={component.id}
                  className="px-2 py-1 bg-primary/10 rounded-md text-xs font-medium"
                >
                  {component.name}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <span className="text-sm font-medium">Monthly Rent: </span>
            <span className="text-lg font-bold">₹{roomType.rent.toLocaleString()}</span>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="flex items-center"
              onClick={() => {
                setSelectedRoomType(roomType);
                setIsEditDialogOpen(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center text-destructive focus:text-destructive"
              onClick={() => {
                setSelectedRoomType(roomType);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Room Types</h1>
        <p className="text-muted-foreground mt-2">
          Manage and organize room types for your hostel
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search room types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <div className="hidden sm:block">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Room Type
          </Button>
        </div>
        <div className="sm:hidden">
          <Button size="icon" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : roomTypes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Package2 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg">No room types yet</h3>
          <p className="text-muted-foreground mt-2 text-center max-w-sm">
            Create your first room type to start managing different room categories
          </p>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="mt-6"
          >
            Create Room Type
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRoomTypes.map((roomType) => (
            <RoomTypeCard key={roomType._id} roomType={roomType} />
          ))}
        </div>
      )}

      <CreateRoomTypeDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={fetchRoomTypes}
        blockId={Array.isArray(params.blockId) ? params.blockId[0] : params.blockId}
      />

      {selectedRoomType && (
        <>
          <EditRoomTypeDialog
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedRoomType(null);
            }}
            onSuccess={fetchRoomTypes}
            blockId={Array.isArray(params.blockId) ? params.blockId[0] : params.blockId}
            roomType={selectedRoomType}
          />

          <DeleteRoomTypeDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedRoomType(null);
            }}
            onConfirm={() => handleDelete(selectedRoomType._id)}
            roomTypeName={selectedRoomType.name}
          />
        </>
      )}
    </div>
  );
}